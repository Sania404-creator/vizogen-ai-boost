import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "post-media";
const SIGNED_TTL = 60 * 60 * 24 * 365; // 1 year

export interface MediaItem {
  path: string;
  name: string;
  url: string;
  kind: "image" | "video";
  created_at: string | null;
}

function kindFor(name: string): "image" | "video" {
  return /\.(mp4|mov|webm|m4v)$/i.test(name) ? "video" : "image";
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-60);
}

export const listMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .list(context.userId, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (error) return [] as MediaItem[];
    const files = (data ?? []).filter((f) => f.name && !f.name.startsWith("."));
    const items: MediaItem[] = [];
    for (const file of files) {
      const path = `${context.userId}/${file.name}`;
      const { data: signed } = await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(path, SIGNED_TTL);
      if (!signed?.signedUrl) continue;
      items.push({
        path,
        name: file.name,
        url: signed.signedUrl,
        kind: kindFor(file.name),
        created_at: (file as { created_at?: string }).created_at ?? null,
      });
    }
    return items;
  });

export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        filename: z.string().trim().min(1).max(120),
        contentType: z.string().trim().min(3).max(100),
        dataBase64: z.string().min(10),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const bytes = Uint8Array.from(atob(data.dataBase64), (c) => c.charCodeAt(0));
    if (bytes.byteLength > 45 * 1024 * 1024) throw new Error("File is larger than 45MB.");
    const path = `${context.userId}/${Date.now()}-${safeName(data.filename)}`;
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);
    const { data: signed } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_TTL);
    return {
      path,
      name: path.split("/").pop() ?? path,
      url: signed?.signedUrl ?? "",
      kind: kindFor(data.filename),
      created_at: new Date().toISOString(),
    } satisfies MediaItem;
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ path: z.string().min(3) }).parse(input))
  .handler(async ({ data, context }) => {
    if (!data.path.startsWith(`${context.userId}/`)) throw new Error("Not allowed.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.storage.from(BUCKET).remove([data.path]);
    return { ok: true };
  });

export const generatePostImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ prompt: z.string().trim().min(3).max(600) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured yet.");

    const { data: business } = await context.supabase
      .from("businesses")
      .select("name, category, city")
      .eq("owner_id", context.userId)
      .limit(1)
      .maybeSingle();

    const prompt = [
      `Create a clean, professional square social media graphic for a local business Google Business Profile post.`,
      business ? `Business: ${business.name} (${business.category}) in ${business.city}.` : "",
      `Creative brief: ${data.prompt}`,
      `Photographic or modern flat-illustration style, bright, high contrast, plenty of empty space, no gibberish text, no watermark, no logos.`,
    ]
      .filter(Boolean)
      .join(" ");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });
    if (res.status === 429) throw new Error("AI rate limit reached. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted — top up to keep generating.");
    if (!res.ok) throw new Error(`Image generation failed (${res.status}).`);

    const json = (await res.json()) as { data?: { b64_json?: string }[] };
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) throw new Error("The AI returned no image. Try a different brief.");

    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const path = `${context.userId}/${Date.now()}-ai-post.png`;
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: "image/png", upsert: false });
    if (error) throw new Error(error.message);
    const { data: signed } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_TTL);
    return {
      path,
      name: path.split("/").pop() ?? path,
      url: signed?.signedUrl ?? "",
      kind: "image" as const,
      created_at: new Date().toISOString(),
    } satisfies MediaItem;
  });
