import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface PartnerAccount {
  id: string;
  email: string;
  full_name: string;
  program: string;
  manager_name: string;
  manager_email: string;
  manager_phone: string;
  exclusive_city: string;
  commission_rate: number;
  min_payout: number;
  active: boolean;
  approved_at: string;
  reference_code: string | null;
}

export interface PartnerEarning {
  id: string;
  period_month: string;
  description: string;
  amount: number;
  status: "pending" | "approved" | "paid";
  paid_at: string | null;
  created_at: string;
}

export interface PartnerClient {
  id: string;
  business_name: string;
  city: string;
  contact_name: string;
  plan: string;
  monthly_value: number;
  started_on: string;
  status: "trial" | "active" | "churned";
  confirmation: "pending" | "confirmed" | "rejected";
  admin_note: string;
  created_at: string;
}

export interface PartnerResource {
  id: string;
  title: string;
  description: string;
  category: string;
  resource_type: string;
  url: string;
}

export interface PartnerPortalData {
  account: PartnerAccount | null;
  earnings: PartnerEarning[];
  clients: PartnerClient[];
  resources: PartnerResource[];
  totals: { earned: number; pending: number; paid: number; clients: number; activeClients: number };
}

/** Everything an approved partner sees in their portal. */
export const getPartnerPortal = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PartnerPortalData> => {
    const email = String((context.claims as { email?: string } | null)?.email ?? "").toLowerCase();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const empty: PartnerPortalData = {
      account: null,
      earnings: [],
      clients: [],
      resources: [],
      totals: { earned: 0, pending: 0, paid: 0, clients: 0, activeClients: 0 },
    };
    if (!email) return empty;

    const { data: acc } = await supabaseAdmin
      .from("partner_accounts")
      .select("*, partner_applications(reference_code)")
      .ilike("email", email)
      .maybeSingle();

    if (!acc) return empty;

    // Bind the auth user to the partner account on first sign-in.
    if (!(acc as { user_id: string | null }).user_id) {
      await supabaseAdmin
        .from("partner_accounts")
        .update({ user_id: context.userId } as never)
        .eq("id", (acc as { id: string }).id);
    }

    const partnerId = (acc as { id: string }).id;
    const [earnings, clients, resources] = await Promise.all([
      supabaseAdmin
        .from("partner_earnings")
        .select("id, period_month, description, amount, status, paid_at, created_at")
        .eq("partner_id", partnerId)
        .order("period_month", { ascending: false })
        .limit(200),
      supabaseAdmin
        .from("partner_clients")
        .select(
          "id, business_name, city, contact_name, plan, monthly_value, started_on, status, confirmation, admin_note, created_at",
        )
        .eq("partner_id", partnerId)
        .order("created_at", { ascending: false })
        .limit(200),
      supabaseAdmin
        .from("partner_resources")
        .select("id, title, description, category, resource_type, url")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
    ]);

    const earningRows = (earnings.data ?? []) as unknown as PartnerEarning[];
    const clientRows = (clients.data ?? []) as unknown as PartnerClient[];
    const num = (v: unknown) => Number(v ?? 0);

    const raw = acc as unknown as PartnerAccount & {
      partner_applications: { reference_code: string | null } | null;
    };

    return {
      account: {
        id: raw.id,
        email: raw.email,
        full_name: raw.full_name,
        program: raw.program,
        manager_name: raw.manager_name,
        manager_email: raw.manager_email,
        manager_phone: raw.manager_phone,
        exclusive_city: raw.exclusive_city,
        commission_rate: num(raw.commission_rate),
        min_payout: num(raw.min_payout),
        active: raw.active,
        approved_at: raw.approved_at,
        reference_code: raw.partner_applications?.reference_code ?? null,
      },
      earnings: earningRows.map((e) => ({ ...e, amount: num(e.amount) })),
      clients: clientRows.map((c) => ({ ...c, monthly_value: num(c.monthly_value) })),
      resources: (resources.data ?? []) as unknown as PartnerResource[],
      totals: {
        earned: earningRows.reduce((s, e) => s + num(e.amount), 0),
        pending: earningRows
          .filter((e) => e.status !== "paid")
          .reduce((s, e) => s + num(e.amount), 0),
        paid: earningRows.filter((e) => e.status === "paid").reduce((s, e) => s + num(e.amount), 0),
        clients: clientRows.length,
        activeClients: clientRows.filter((c) => c.status === "active").length,
      },
    };
  });

const clientSchema = z.object({
  businessName: z.string().trim().min(2).max(140),
  city: z.string().trim().max(80).optional().default(""),
  contactName: z.string().trim().max(120).optional().default(""),
  contactEmail: z.string().trim().max(200).optional().default(""),
  contactPhone: z.string().trim().max(30).optional().default(""),
  plan: z.enum(["Starter", "Growth", "Pro", "Custom"]).default("Starter"),
  monthlyValue: z.number().min(0).max(10000000).default(0),
  startedOn: z.string().trim().min(4).max(20),
});

/** A partner logs a client they onboarded; Vizogen confirms it before it counts. */
export const submitPartnerClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => clientSchema.parse(input))
  .handler(async ({ data, context }) => {
    const email = String((context.claims as { email?: string } | null)?.email ?? "").toLowerCase();
    if (!email) throw new Error("We couldn't identify your partner account.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: acc } = await supabaseAdmin
      .from("partner_accounts")
      .select("id, active")
      .ilike("email", email)
      .maybeSingle();
    if (!acc || !(acc as { active: boolean }).active) {
      throw new Error("Only approved partners can add clients.");
    }

    const { error } = await supabaseAdmin.from("partner_clients").insert({
      partner_id: (acc as { id: string }).id,
      business_name: data.businessName,
      city: data.city,
      contact_name: data.contactName,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      plan: data.plan,
      monthly_value: data.monthlyValue,
      started_on: data.startedOn,
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
