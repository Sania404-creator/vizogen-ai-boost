import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ADMIN_EMAIL = "info.vizogen@gmail.com";

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
  program: z.enum(["Affiliate Partner", "Prime Plus Partnership"]),
  businessCount: z.enum(["Just starting out", "1-5", "6-20", "20+"]),
  about: z.string().trim().max(1000).optional().default(""),
});

export type PartnerApplicationInput = z.infer<typeof partnerSchema>;

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
      .select("id")
      .single();

    if (error) {
      console.error("Failed to save partner application", error);
      throw new Error("We couldn't save your application. Please try again.");
    }

    const adminSent = await sendGmail(
      ADMIN_EMAIL,
      `New Partner Application: ${data.fullName}`,
      buildPartnerAdminEmail(data),
    );
    const applicantSent = await sendGmail(
      data.email,
      "We've received your Vizogen Partner Application",
      buildPartnerApplicantEmail(data),
    );

    await supabaseAdmin
      .from("partner_applications")
      .update({ admin_email_sent: adminSent, applicant_email_sent: applicantSent })
      .eq("id", row.id);

    return { id: row.id, emailSent: applicantSent };
  });
