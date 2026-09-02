import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface Business {
  id: string;
  name: string;
  category: string;
  city: string;
  brand_tone: string;
  keywords: string[];
  website: string | null;
  phone: string | null;
  posting_frequency: string;
  google_account_id: string | null;
  google_location_id: string | null;
  google_location_name: string | null;
  review_link: string | null;
}

const BUSINESS_COLUMNS =
  "id, name, category, city, brand_tone, keywords, website, phone, posting_frequency, google_account_id, google_location_id, google_location_name, review_link";

export const getWorkspace = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: business }, { data: connection }] = await Promise.all([
      supabase
        .from("businesses")
        .select(BUSINESS_COLUMNS)
        .eq("owner_id", userId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("google_connections")
        .select("google_email, status, last_error, updated_at")
        .eq("owner_id", userId)
        .maybeSingle(),
    ]);

    return {
      business: (business as Business | null) ?? null,
      google: connection ?? null,
    };
  });

const businessSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  brand_tone: z.enum(["friendly", "professional", "premium", "playful", "local"]),
  keywords: z.array(z.string().trim().min(1).max(60)).max(12).default([]),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  posting_frequency: z.enum(["daily", "twice-weekly", "weekly"]).default("weekly"),
  review_link: z.string().trim().max(400).optional().or(z.literal("")),
});

export const saveBusiness = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => businessSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", userId)
      .limit(1)
      .maybeSingle();

    const payload = {
      owner_id: userId,
      name: data.name,
      category: data.category,
      city: data.city,
      brand_tone: data.brand_tone,
      keywords: data.keywords,
      website: data.website || null,
      phone: data.phone || null,
      posting_frequency: data.posting_frequency,
      review_link: data.review_link || null,
    };

    if (existing?.id) {
      const { data: updated, error } = await supabase
        .from("businesses")
        .update(payload)
        .eq("id", existing.id)
        .select(BUSINESS_COLUMNS)
        .single();
      if (error) throw new Error(error.message);
      return updated as Business;
    }

    const { data: created, error } = await supabase
      .from("businesses")
      .insert(payload)
      .select(BUSINESS_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return created as Business;
  });

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [posts, reviews, qrCodes, feedback] = await Promise.all([
      supabase.from("posts").select("status, scheduled_at, published_at").eq("owner_id", userId),
      supabase.from("reviews").select("rating, reply_status").eq("owner_id", userId),
      supabase.from("qr_codes").select("scans").eq("owner_id", userId),
      supabase.from("qr_feedback").select("rating, routed_to_google").eq("owner_id", userId),
    ]);

    const postRows = posts.data ?? [];
    const reviewRows = reviews.data ?? [];
    const feedbackRows = feedback.data ?? [];
    const ratings = reviewRows.map((r) => r.rating ?? 0).filter((n) => n > 0);

    return {
      posts: {
        total: postRows.length,
        drafts: postRows.filter((p) => p.status === "draft").length,
        scheduled: postRows.filter((p) => p.status === "scheduled").length,
        published: postRows.filter((p) => p.status === "published").length,
        failed: postRows.filter((p) => p.status === "failed").length,
      },
      reviews: {
        total: reviewRows.length,
        awaiting: reviewRows.filter((r) => r.reply_status !== "replied").length,
        averageRating: ratings.length
          ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
          : 0,
      },
      qr: {
        scans: (qrCodes.data ?? []).reduce((sum, row) => sum + (row.scans ?? 0), 0),
        feedback: feedbackRows.length,
        routedToGoogle: feedbackRows.filter((f) => f.routed_to_google).length,
      },
    };
  });
