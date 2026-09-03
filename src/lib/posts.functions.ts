import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface PostRow {
  id: string;
  business_id: string;
  post_type: string;
  headline: string;
  body: string;
  cta_label: string | null;
  cta_url: string | null;
  image_url: string | null;
  video_url: string | null;
  status: string;
  scheduled_at: string | null;
  published_at: string | null;
  error: string | null;
  created_at: string;
}

const POST_COLUMNS =
  "id, business_id, post_type, headline, body, cta_label, cta_url, image_url, video_url, status, scheduled_at, published_at, error, created_at";

export const listPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("posts")
      .select(POST_COLUMNS)
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []) as PostRow[];
  });

export const generatePostDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        postType: z.enum(["update", "offer", "event"]),
        prompt: z.string().trim().max(400).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: business } = await context.supabase
      .from("businesses")
      .select("name, category, city, brand_tone, keywords, website")
      .eq("owner_id", context.userId)
      .limit(1)
      .maybeSingle();

    if (!business) throw new Error("Add your business details first.");

    const { chat, extractJson } = await import("./ai.server");
    const raw = await chat([
      {
        role: "system",
        content:
          "You write Google Business Profile posts for local businesses. Return ONLY JSON: " +
          '{"headline": string (max 58 chars), "body": string (90-260 words? no — 40-90 words), "cta_label": one of "Learn more" | "Call now" | "Book" | "Order online"}. ' +
          "Write naturally, no hashtags spam (max 2), no emoji walls (max 2 emoji), include the city once.",
      },
      {
        role: "user",
        content: [
          `Business: ${business.name}`,
          `Category: ${business.category}`,
          `City: ${business.city}`,
          `Brand tone: ${business.brand_tone}`,
          `Keywords: ${(business.keywords ?? []).join(", ") || "none"}`,
          `Post type: ${data.postType}`,
          data.prompt ? `Extra instruction: ${data.prompt}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ]);

    const parsed = extractJson<{ headline?: string; body?: string; cta_label?: string }>(raw);
    return {
      headline: parsed?.headline?.slice(0, 120) ?? `${business.name} update`,
      body: parsed?.body ?? raw.slice(0, 1200),
      cta_label: parsed?.cta_label ?? "Learn more",
      cta_url: business.website ?? null,
    };
  });

const savePostSchema = z.object({
  id: z.string().uuid().optional(),
  post_type: z.enum(["update", "offer", "event"]),
  headline: z.string().trim().max(160),
  body: z.string().trim().min(1).max(3000),
  cta_label: z.string().trim().max(40).optional().or(z.literal("")),
  cta_url: z.string().trim().max(400).optional().or(z.literal("")),
  image_url: z.string().trim().max(2000).optional().or(z.literal("")),
  video_url: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(["draft", "scheduled"]),
  scheduled_at: z.string().datetime().nullable().optional(),
});

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => savePostSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", userId)
      .limit(1)
      .maybeSingle();
    if (!business) throw new Error("Add your business details first.");

    const payload = {
      owner_id: userId,
      business_id: business.id,
      post_type: data.post_type,
      headline: data.headline,
      body: data.body,
      cta_label: data.cta_label || null,
      cta_url: data.cta_url || null,
      image_url: data.image_url || null,
      video_url: data.video_url || null,
      status: data.status,
      scheduled_at: data.status === "scheduled" ? (data.scheduled_at ?? null) : null,
      error: null,
    };

    if (data.id) {
      const { data: updated, error } = await supabase
        .from("posts")
        .update(payload)
        .eq("id", data.id)
        .eq("owner_id", userId)
        .select(POST_COLUMNS)
        .single();
      if (error) throw new Error(error.message);
      return updated as PostRow;
    }
    const { data: created, error } = await supabase
      .from("posts")
      .insert(payload)
      .select(POST_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return created as PostRow;
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("posts")
      .delete()
      .eq("id", data.id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const publishPostNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: post } = await supabase
      .from("posts")
      .select("id, headline, body, cta_label, cta_url, image_url, business_id")
      .eq("id", data.id)
      .eq("owner_id", userId)
      .maybeSingle();
    if (!post) throw new Error("Post not found.");

    const { data: business } = await supabase
      .from("businesses")
      .select("google_account_id, google_location_id")
      .eq("id", post.business_id)
      .maybeSingle();

    if (!business?.google_account_id || !business.google_location_id) {
      await supabase
        .from("posts")
        .update({ status: "scheduled", error: "Connect a Google location to publish." })
        .eq("id", post.id);
      return {
        ok: false,
        kind: "not_connected",
        message: "Connect a Google Business Profile location first — the post is queued.",
      };
    }

    try {
      const { getAccessToken } = await import("./google-tokens.server");
      const { createLocalPost } = await import("./gbp.server");
      const token = await getAccessToken(userId);
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
      await supabase
        .from("posts")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
          google_post_name: result.name ?? null,
          error: null,
        })
        .eq("id", post.id);
      return { ok: true, kind: "published", message: "Published to your Google Business Profile." };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Publishing failed.";
      const kind =
        error && typeof error === "object" && "kind" in error
          ? String((error as { kind: unknown }).kind)
          : "error";
      await supabase
        .from("posts")
        .update({
          status: kind === "awaiting_google_approval" ? "scheduled" : "failed",
          error: message,
        })
        .eq("id", post.id);
      return { ok: false, kind, message };
    }
  });
