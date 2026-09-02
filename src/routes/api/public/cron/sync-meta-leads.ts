import { createFileRoute } from "@tanstack/react-router";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function run(request: Request) {
  const secret = process.env["CRM_WEBHOOK_SECRET"];
  const cronToken = request.headers.get("x-cron-token");

  let authorized = false;
  if (secret) {
    const provided =
      request.headers.get("x-vizogen-secret") ??
      (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (provided && provided === secret) authorized = true;
  }
  if (!authorized && cronToken) {
    // Hourly pg_cron job authenticates with a token stored in the database.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("crm_integration_settings")
      .select("value")
      .eq("key", "meta_sync_token")
      .maybeSingle();
    if (data?.value && cronToken === data.value) authorized = true;
  }
  if (!secret && !cronToken) return json({ error: "Endpoint not configured" }, 503);
  if (!authorized) return json({ error: "Unauthorized" }, 401);

  const { syncMetaLeads } = await import("@/lib/meta-leads.server");
  const result = await syncMetaLeads();
  return json(result, result.ok ? 200 : 500);
}

export const Route = createFileRoute("/api/public/cron/sync-meta-leads")({
  server: {
    handlers: {
      GET: ({ request }) => run(request),
      POST: ({ request }) => run(request),
    },
  },
});
