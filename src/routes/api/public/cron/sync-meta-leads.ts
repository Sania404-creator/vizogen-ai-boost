import { createFileRoute } from "@tanstack/react-router";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function run(request: Request) {
  const secret = process.env["CRM_WEBHOOK_SECRET"];
  if (!secret) return json({ error: "Endpoint not configured" }, 503);

  const provided =
    request.headers.get("x-vizogen-secret") ??
    (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (provided !== secret) return json({ error: "Unauthorized" }, 401);

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
