import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  sourcePage: z.string().trim().max(200).optional().or(z.literal("")),
  requestedAt: z.string().trim().max(60).optional().or(z.literal("")),
  submittedAt: z.string().trim().max(60).optional().or(z.literal("")),
  source: z.string().trim().max(40).optional(),
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["CRM_WEBHOOK_SECRET"];
        if (!secret) return json({ error: "Endpoint not configured" }, 503);

        const provided =
          request.headers.get("x-vizogen-secret") ??
          (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
        if (provided !== secret) return json({ error: "Unauthorized" }, 401);

        let parsed;
        try {
          parsed = payloadSchema.parse(await request.json());
        } catch {
          return json({ error: "Invalid payload" }, 400);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Duplicate detection by email or phone.
        const filters: string[] = [];
        if (parsed.email) filters.push(`email.eq.${parsed.email}`);
        if (parsed.phone) filters.push(`phone.eq.${parsed.phone}`);
        if (filters.length) {
          const { data: existing } = await supabaseAdmin
            .from("crm_leads")
            .select("id")
            .or(filters.join(","))
            .limit(1)
            .maybeSingle();
          if (existing) {
            await supabaseAdmin.from("crm_activities").insert({
              lead_id: existing.id,
              actor_name: "Website",
              type: "note",
              body: `Repeat enquiry received from the website${
                parsed.sourcePage ? ` (${parsed.sourcePage})` : ""
              }.${parsed.message ? ` Message: ${parsed.message}` : ""}`,
            });
            return json({ ok: true, duplicate: true, leadId: existing.id });
          }
        }

        const requestedAt = parsed.requestedAt ? new Date(parsed.requestedAt) : null;
        const { data: created, error } = await supabaseAdmin
          .from("crm_leads")
          .insert({
            name: parsed.name,
            email: parsed.email || "",
            phone: parsed.phone || "",
            company: parsed.company || "",
            source: parsed.source || "website_demo",
            status: "new",
            message: parsed.message || null,
            source_page: parsed.sourcePage || null,
            requested_demo_at:
              requestedAt && !Number.isNaN(requestedAt.getTime()) ? requestedAt.toISOString() : null,
            requested_demo_label: parsed.requestedAt || null,
          })
          .select("id")
          .single();

        if (error) return json({ error: "Could not save the lead" }, 500);
        return json({ ok: true, leadId: created.id });
      },
    },
  },
});
