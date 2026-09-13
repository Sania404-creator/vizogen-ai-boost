import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_EMAIL = "info.vizogen@gmail.com";

export const PARTNER_STATUSES = ["new", "reviewing", "approved", "rejected"] as const;
export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

export const PARTNER_STATUS_LABEL: Record<PartnerStatus, string> = {
  new: "Received",
  reviewing: "Under review",
  approved: "Approved",
  rejected: "Not selected",
};

export interface PartnerApplicationRow {
  id: string;
  reference_code: string | null;
  full_name: string;
  email: string;
  phone: string;
  business_name: string;
  website: string | null;
  program: string;
  business_count: string;
  about: string | null;
  status: PartnerStatus;
  admin_notes: string;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

const APPLICATION_COLUMNS =
  "id, reference_code, full_name, email, phone, business_name, website, program, business_count, about, status, admin_notes, reviewed_at, created_at, updated_at";

const partnerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/),
  businessName: z.string().trim().min(2).max(120),
  website: z.string().trim().max(200).optional().default(""),
  program: z.enum(["Affiliate Partner", "Prime Plus Partnership", "White-Labelled Partner"]),
  businessCount: z.enum(["Just starting out", "1-5", "6-20", "20+"]),
  about: z.string().trim().max(1000).optional().default(""),
});

export type PartnerApplicationInput = z.infer<typeof partnerSchema>;

async function assertPartnerAdmin(context: {
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> };
  userId: string;
}) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (data !== true) throw new Error("Admins only.");
}

export const createPartnerApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => partnerSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendGmail } = await import("@/lib/email.server");
    const { buildPartnerAdminEmail, buildPartnerApplicantEmail } = await import(
      "@/lib/partner-emails"
    );

    const { data: row, error } = await supabaseAdmin
      .from("partner_applications")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        business_name: data.businessName,
        website: data.website || null,
        program: data.program,
        business_count: data.businessCount,
        about: data.about || null,
      })
      .select("id, reference_code")
      .single();

    if (error) {
      console.error("Failed to save partner application", error);
      throw new Error("We couldn't save your application. Please try again.");
    }

    const referenceCode = (row as { reference_code: string | null }).reference_code ?? "";

    const adminSent = await sendGmail(
      ADMIN_EMAIL,
      `New Partner Application: ${data.fullName}`,
      buildPartnerAdminEmail(data),
    );
    const applicantSent = await sendGmail(
      data.email,
      "We've received your Vizogen Partner Application",
      buildPartnerApplicantEmail(data, referenceCode),
    );

    await supabaseAdmin
      .from("partner_applications")
      .update({ admin_email_sent: adminSent, applicant_email_sent: applicantSent })
      .eq("id", row.id);

    return { id: row.id, referenceCode, emailSent: applicantSent };
  });

/** Public status lookup — needs both the reference code and the email used to apply. */
export const getPartnerApplicationStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        referenceCode: z.string().trim().min(4).max(20),
        email: z.string().trim().email().max(255),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("partner_applications")
      .select("reference_code, full_name, program, status, created_at, updated_at")
      .eq("reference_code", data.referenceCode.trim().toUpperCase())
      .ilike("email", data.email.trim())
      .maybeSingle();

    if (!row) return null;
    return {
      referenceCode: row.reference_code as string,
      fullName: row.full_name as string,
      program: row.program as string,
      status: row.status as PartnerStatus,
      submittedAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  });

export const listPartnerApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PartnerApplicationRow[]> => {
    await assertPartnerAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("partner_applications")
      .select(APPLICATION_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(200);
    return (data ?? []) as unknown as PartnerApplicationRow[];
  });

export const updatePartnerApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(PARTNER_STATUSES).optional(),
        adminNotes: z.string().trim().max(2000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertPartnerAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const patch: Record<string, unknown> = {};
    if (data.status) {
      patch['status'] = data.status;
      patch['reviewed_at'] = new Date().toISOString();
      patch['reviewed_by'] = context.userId;
    }
    if (data.adminNotes !== undefined) patch['admin_notes'] = data.adminNotes;
    if (Object.keys(patch).length === 0) return { ok: true };

    const { error } = await supabaseAdmin
      .from("partner_applications")
      .update(patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    if (data.status === "approved" || data.status === "rejected") {
      await handleDecision(data.id, data.status);
    }
    return { ok: true };
  });

const PROGRAM_TERMS: Record<string, { rate: number; minPayout: number }> = {
  "Affiliate Partner": { rate: 20, minPayout: 999 },
  "Prime Plus Partnership": { rate: 30, minPayout: 999 },
  "White-Labelled Partner": { rate: 0, minPayout: 0 },
};

/** Creates the partner account on approval and emails the applicant once. */
async function handleDecision(applicationId: string, status: "approved" | "rejected") {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sendGmail } = await import("@/lib/email.server");
  const { buildPartnerApprovedEmail, buildPartnerRejectedEmail } = await import(
    "@/lib/partner-emails"
  );

  const { data: app } = await supabaseAdmin
    .from("partner_applications")
    .select(
      "id, full_name, email, program, reference_code, business_name, approval_email_sent, rejection_email_sent",
    )
    .eq("id", applicationId)
    .maybeSingle();
  if (!app) return;

  const row = app as unknown as {
    id: string;
    full_name: string;
    email: string;
    program: string;
    reference_code: string | null;
    approval_email_sent: boolean;
    rejection_email_sent: boolean;
  };

  if (status === "rejected") {
    if (row.rejection_email_sent) return;
    const sent = await sendGmail(
      row.email,
      "About your Vizogen partner application",
      buildPartnerRejectedEmail({ fullName: row.full_name, program: row.program }),
    );
    if (sent) {
      await supabaseAdmin
        .from("partner_applications")
        .update({ rejection_email_sent: true } as never)
        .eq("id", row.id);
    }
    return;
  }

  const terms = PROGRAM_TERMS[row.program] ?? { rate: 20, minPayout: 999 };
  const manager = {
    name: "Vizogen Partnerships Desk",
    email: ADMIN_EMAIL,
    phone: "+91 84889 18358",
  };

  const { data: existing } = await supabaseAdmin
    .from("partner_accounts")
    .select("id, manager_name, manager_email, manager_phone")
    .eq("application_id", row.id)
    .maybeSingle();

  if (existing) {
    const e = existing as unknown as {
      manager_name: string;
      manager_email: string;
      manager_phone: string;
    };
    manager.name = e.manager_name;
    manager.email = e.manager_email;
    manager.phone = e.manager_phone;
    await supabaseAdmin
      .from("partner_accounts")
      .update({ active: true } as never)
      .eq("application_id", row.id);
  } else {
    await supabaseAdmin.from("partner_accounts").insert({
      application_id: row.id,
      email: row.email,
      full_name: row.full_name,
      program: row.program,
      commission_rate: terms.rate,
      min_payout: terms.minPayout,
    } as never);
  }

  if (row.approval_email_sent) return;
  const sent = await sendGmail(
    row.email,
    `You're approved — welcome to the Vizogen ${row.program} program`,
    buildPartnerApprovedEmail({
      fullName: row.full_name,
      program: row.program,
      referenceCode: row.reference_code ?? "",
      managerName: manager.name,
      managerEmail: manager.email,
      managerPhone: manager.phone,
      portalUrl: "https://www.vizogen.in/partner-portal",
    }),
  );
  if (sent) {
    await supabaseAdmin
      .from("partner_applications")
      .update({ approval_email_sent: true } as never)
      .eq("id", row.id);
  }
}
