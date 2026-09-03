import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Runs the GMB AI agent for every business that has it enabled.
// Protected by the LOVABLE_CRON_SECRET bearer token.
export const Route = createFileRoute("/api/public/cron/agent")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const provided =
          request.headers.get("x-cron-token") ??
          request.headers.get("authorization")?.replace("Bearer ", "") ??
          "";
        const envSecret = process.env["LOVABLE_CRON_SECRET"];
        const { data: stored } = await supabaseAdmin
          .from("crm_integration_settings")
          .select("value")
          .eq("key", "agent_cron_token")
          .maybeSingle();

        const allowed = [envSecret, stored?.value].filter((v): v is string => Boolean(v));
        if (!provided || !allowed.includes(provided)) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { runAgentForOwner } = await import("@/lib/agent.server");

        const { data: businesses } = await supabaseAdmin
          .from("businesses")
          .select("owner_id")
          .eq("agent_enabled", true)
          .limit(50);

        const owners = [...new Set((businesses ?? []).map((b) => b.owner_id))];
        const results: { ownerId: string; status: string; summary: string }[] = [];

        for (const ownerId of owners) {
          try {
            const run = await runAgentForOwner(supabaseAdmin as never, ownerId, "cron");
            results.push({ ownerId, status: run.status, summary: run.summary });
          } catch (error) {
            results.push({
              ownerId,
              status: "error",
              summary: error instanceof Error ? error.message : "Run failed.",
            });
          }
        }

        return Response.json({ ok: true, ran: results.length, results });
      },
    },
  },
});
