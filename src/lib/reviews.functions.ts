import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface ReviewRow {
  id: string;
  google_review_id: string | null;
  reviewer_name: string;
  reviewer_photo: string | null;
  rating: number;
  comment: string | null;
  reviewed_at: string;
  reply_text: string | null;
  reply_status: string;
  replied_at: string | null;
  error: string | null;
}

const REVIEW_COLUMNS =
  "id, google_review_id, reviewer_name, reviewer_photo, rating, comment, reviewed_at, reply_text, reply_status, replied_at, error";

function normalise(error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong.";
  const kind =
    error && typeof error === "object" && "kind" in error
      ? String((error as { kind: unknown }).kind)
      : "error";
  return { kind, message };
}

export const listReviewRows = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("reviews")
      .select(REVIEW_COLUMNS)
      .eq("owner_id", context.userId)
      .order("reviewed_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []) as ReviewRow[];
  });

export const syncReviews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: business } = await supabase
      .from("businesses")
      .select("id, google_account_id, google_location_id")
      .eq("owner_id", userId)
      .limit(1)
      .maybeSingle();
    if (!business?.google_account_id || !business.google_location_id) {
      return {
        synced: 0,
        error: {
          kind: "not_connected",
          message: "Connect a Google Business Profile location to pull in reviews.",
        },
      };
    }
    try {
      const { getAccessToken } = await import("./google-tokens.server");
      const { listReviews } = await import("./gbp.server");
      const token = await getAccessToken(userId);
      const reviews = await listReviews(
        token,
        business.google_account_id,
        business.google_location_id,
      );
      if (reviews.length) {
        const { error } = await supabase.from("reviews").upsert(
          reviews.map((review) => ({
            owner_id: userId,
            business_id: business.id,
            google_review_id: review.reviewId,
            reviewer_name: review.reviewer,
            reviewer_photo: review.photo,
            rating: review.rating,
            comment: review.comment,
            reviewed_at: review.createTime,
            reply_text: review.replyComment,
            reply_status: review.replyComment ? "replied" : "pending",
          })),
          { onConflict: "business_id,google_review_id" },
        );
        if (error) throw new Error(error.message);
      }
      return { synced: reviews.length, error: null };
    } catch (error) {
      return { synced: 0, error: normalise(error) };
    }
  });

export const draftReviewReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ data: review }, { data: business }] = await Promise.all([
      supabase
        .from("reviews")
        .select("rating, comment, reviewer_name")
        .eq("id", data.id)
        .eq("owner_id", userId)
        .maybeSingle(),
      supabase
        .from("businesses")
        .select("name, category, city, brand_tone")
        .eq("owner_id", userId)
        .limit(1)
        .maybeSingle(),
    ]);
    if (!review) throw new Error("Review not found.");

    const { chat } = await import("./ai.server");
    const reply = await chat(
      [
        {
          role: "system",
          content:
            "You write short replies to Google reviews on behalf of a local business owner. " +
            "Rules: 2-4 sentences, under 70 words, thank the reviewer by first name, mirror the brand tone, " +
            "never offer refunds or make promises, invite unhappy reviewers to contact the business directly. " +
            "Return only the reply text.",
        },
        {
          role: "user",
          content: [
            `Business: ${business?.name ?? "the business"} (${business?.category ?? "local business"}, ${business?.city ?? ""})`,
            `Brand tone: ${business?.brand_tone ?? "friendly"}`,
            `Reviewer: ${review.reviewer_name}`,
            `Rating: ${review.rating}/5`,
            `Review: ${review.comment ?? "(no comment left)"}`,
          ].join("\n"),
        },
      ],
      { maxTokens: 300 },
    );

    await supabase
      .from("reviews")
      .update({ reply_text: reply, reply_status: "draft" })
      .eq("id", data.id)
      .eq("owner_id", userId);

    return { reply };
  });

export const sendReviewReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ id: z.string().uuid(), reply: z.string().trim().min(2).max(4000) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: review } = await supabase
      .from("reviews")
      .select("id, google_review_id, business_id")
      .eq("id", data.id)
      .eq("owner_id", userId)
      .maybeSingle();
    if (!review) throw new Error("Review not found.");

    const { data: business } = await supabase
      .from("businesses")
      .select("google_account_id, google_location_id")
      .eq("id", review.business_id)
      .maybeSingle();

    if (!business?.google_account_id || !business.google_location_id || !review.google_review_id) {
      await supabase
        .from("reviews")
        .update({ reply_text: data.reply, reply_status: "queued" })
        .eq("id", review.id);
      return {
        ok: false,
        kind: "not_connected",
        message: "Reply saved. It will post once your Google location is connected.",
      };
    }

    try {
      const { getAccessToken } = await import("./google-tokens.server");
      const { replyToReview } = await import("./gbp.server");
      const token = await getAccessToken(userId);
      await replyToReview(
        token,
        business.google_account_id,
        business.google_location_id,
        review.google_review_id,
        data.reply,
      );
      await supabase
        .from("reviews")
        .update({
          reply_text: data.reply,
          reply_status: "replied",
          replied_at: new Date().toISOString(),
          error: null,
        })
        .eq("id", review.id);
      return { ok: true, kind: "replied", message: "Reply posted to Google." };
    } catch (error) {
      const { kind, message } = normalise(error);
      await supabase
        .from("reviews")
        .update({ reply_text: data.reply, reply_status: "queued", error: message })
        .eq("id", review.id);
      return { ok: false, kind, message };
    }
  });
