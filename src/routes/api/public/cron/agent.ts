import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Runs the GMB AI agent for every business that has it enabled.
// Protected by the LOVABLE_CRON_SECRET bearer token.
export const Route = createFileRoute("/api/public/cron/agent")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["LOVABLE_CRON_SECRET"];
        const provided = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!secret || provided !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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
