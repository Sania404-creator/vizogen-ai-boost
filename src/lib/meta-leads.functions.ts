import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Pull new Meta lead-ads rows from the connected Google Sheet into the CRM. */
export const runMetaLeadSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: member } = await context.supabase
      .from("crm_members")
      .select("user_id, active")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!member?.active) throw new Error("You do not have CRM access.");

    const { syncMetaLeads } = await import("./meta-leads.server");
    return syncMetaLeads();
  });

/** Sheet details shown in CRM settings. */
export const getMetaLeadConfig = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { META_SHEET_ID, META_SHEET_TAB } = await import("./meta-leads.server");
    return {
      connected: Boolean(process.env["GOOGLE_SHEETS_API_KEY"] && process.env["LOVABLE_API_KEY"]),
      sheetTab: META_SHEET_TAB,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${META_SHEET_ID}/edit`,
    };
  });
