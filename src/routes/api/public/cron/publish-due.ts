import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Publishes scheduled posts whose time has come and refreshes reviews.
// Protected by the LOVABLE_CRON_SECRET bearer token.
export const Route = createFileRoute("/api/public/cron/publish-due")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["LOVABLE_CRON_SECRET"];
        const provided = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!secret || provided !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { getAccessToken } = await import("@/lib/google-tokens.server");
        const { createLocalPost } = await import("@/lib/gbp.server");

        const { data: due } = await supabaseAdmin
          .from("posts")
          .select("id, owner_id, business_id, headline, body, cta_label, cta_url, image_url")
          .eq("status", "scheduled")
          .lte("scheduled_at", new Date().toISOString())
          .limit(25);

        let published = 0;
        let queued = 0;

        for (const post of due ?? []) {
          const { data: business } = await supabaseAdmin
            .from("businesses")
            .select("google_account_id, google_location_id")
            .eq("id", post.business_id)
            .maybeSingle();

          if (!business?.google_account_id || !business.google_location_id) {
            queued += 1;
            continue;
          }

          try {
            const token = await getAccessToken(post.owner_id);
            const result = await createLocalPost(
              token,
              business.google_account_id,
              business.google_location_id,
              {
                summary: [post.headline, post.body].filter(Boolean).join("\n\n").slice(0, 1500),
                ctaLabel: post.cta_label,
                ctaUrl: post.cta_url,
                imageUrl: post.image_url,
              },
            );
            await supabaseAdmin
              .from("posts")
              .update({
                status: "published",
                published_at: new Date().toISOString(),
                google_post_name: result.name ?? null,
                error: null,
              })
              .eq("id", post.id);
            published += 1;
          } catch (error) {
            const message = error instanceof Error ? error.message : "Publishing failed.";
            const kind =
              error && typeof error === "object" && "kind" in error
                ? String((error as { kind: unknown }).kind)
                : "error";
            await supabaseAdmin
              .from("posts")
              .update({
                status: kind === "error" ? "failed" : "scheduled",
                error: message,
              })
              .eq("id", post.id);
            queued += 1;
          }
        }

        return Response.json({ ok: true, published, queued });
      },
    },
  },
});
