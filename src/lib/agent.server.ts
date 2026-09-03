// Server-only GMB AI agent core. Shared by the dashboard server functions and
// the scheduled cron endpoint, so both behave identically.
import { chat, extractJson } from "./ai.server";

type Client = {
  from: (table: string) => any;
};

export interface AgentSettings {
  agent_enabled: boolean;
  auto_reply_enabled: boolean;
  auto_reply_min_rating: number;
  auto_reply_send: boolean;
  auto_post_enabled: boolean;
}

export interface AgentRunResult {
  status: "ok" | "partial" | "error";
  summary: string;
  details: {
    reviewsSynced: number;
    repliesDrafted: number;
    repliesSent: number;
    postsScheduled: number;
    profileTips: string[];
    notes: string[];
  };
}

const BUSINESS_COLUMNS =
  "id, name, category, city, brand_tone, keywords, website, phone, review_link, posting_frequency, " +
  "google_account_id, google_location_id, agent_enabled, auto_reply_enabled, auto_reply_min_rating, " +
  "auto_reply_send, auto_post_enabled";

function message(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

async function writeReply(
  client: Client,
  business: any,
  review: any,
): Promise<string> {
  const reply = await chat(
    [
      {
        role: "system",
        content:
          "You write short replies to Google reviews for a local business owner. Rules: 2-4 sentences, " +
          "under 70 words, thank the reviewer by first name, mirror the brand tone, never promise refunds, " +
          "invite unhappy reviewers to contact the business directly. Return only the reply text.",
      },
      {
        role: "user",
        content: [
          `Business: ${business.name} (${business.category}, ${business.city})`,
          `Brand tone: ${business.brand_tone}`,
          `Reviewer: ${review.reviewer_name}`,
          `Rating: ${review.rating}/5`,
          `Review: ${review.comment ?? "(no comment left)"}`,
        ].join("\n"),
      },
    ],
    { maxTokens: 300 },
  );
  return reply.trim();
}

async function profileTips(business: any, reviewStats: { count: number; avg: number }) {
  const raw = await chat(
    [
      {
        role: "system",
        content:
          "You are a Google Business Profile manager. Return strict JSON: " +
          '{"tips":["..."]} with 3-5 short, specific, immediately actionable tips (max 18 words each) ' +
          "for improving this profile's local ranking and conversions this week. No preamble.",
      },
      {
        role: "user",
        content: [
          `Business: ${business.name} — ${business.category} in ${business.city}`,
          `Keywords: ${(business.keywords ?? []).join(", ") || "none set"}`,
          `Website: ${business.website || "none"}`,
          `Phone: ${business.phone || "none"}`,
          `Review link set: ${business.review_link ? "yes" : "no"}`,
          `Google location connected: ${business.google_location_id ? "yes" : "no"}`,
          `Reviews stored: ${reviewStats.count}, average rating: ${reviewStats.avg || "n/a"}`,
          `Posting cadence: ${business.posting_frequency}`,
        ].join("\n"),
      },
    ],
    { maxTokens: 500 },
  );
  const parsed = extractJson<{ tips?: string[] }>(raw);
  return (parsed?.tips ?? []).filter((t) => typeof t === "string").slice(0, 5);
}

async function schedulePost(client: Client, business: any, ownerId: string) {
  const raw = await chat(
    [
      {
        role: "system",
        content:
          "You write Google Business Profile posts. Return strict JSON: " +
          '{"headline":"...","body":"...","cta_label":"...","cta_url":""} — headline under 60 chars, ' +
          "body 60-140 words, natural local keywords, one clear call to action.",
      },
      {
        role: "user",
        content: [
          `Business: ${business.name} — ${business.category} in ${business.city}`,
          `Brand tone: ${business.brand_tone}`,
          `Keywords: ${(business.keywords ?? []).join(", ")}`,
          `Website: ${business.website || ""}`,
        ].join("\n"),
      },
    ],
    { maxTokens: 700 },
  );
  const parsed = extractJson<{
    headline?: string;
    body?: string;
    cta_label?: string;
    cta_url?: string;
  }>(raw);
  if (!parsed?.headline || !parsed.body) return false;

  const when = new Date();
  when.setDate(when.getDate() + 1);
  when.setHours(10, 0, 0, 0);

  const { error } = await client.from("posts").insert({
    owner_id: ownerId,
    business_id: business.id,
    post_type: "update",
    headline: parsed.headline.slice(0, 300),
    body: parsed.body.slice(0, 3000),
    cta_label: parsed.cta_label || null,
    cta_url: parsed.cta_url || business.website || null,
    status: "scheduled",
    scheduled_at: when.toISOString(),
  });
  return !error;
}

function cadenceGapDays(frequency: string) {
  if (frequency === "daily") return 1;
  if (frequency === "twice-weekly") return 3;
  return 7;
}

export async function runAgentForOwner(
  client: Client,
  ownerId: string,
  trigger: "manual" | "cron",
): Promise<AgentRunResult> {
  const details: AgentRunResult["details"] = {
    reviewsSynced: 0,
    repliesDrafted: 0,
    repliesSent: 0,
    postsScheduled: 0,
    profileTips: [],
    notes: [],
  };

  const { data: business } = await client
    .from("businesses")
    .select(BUSINESS_COLUMNS)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!business) {
    return {
      status: "error",
      summary: "No business profile yet — finish onboarding first.",
      details,
    };
  }

  const connected = Boolean(business.google_account_id && business.google_location_id);

  // 1. Pull the freshest reviews from Google when connected.
  if (connected) {
    try {
      const { getAccessToken } = await import("./google-tokens.server");
      const { listReviews } = await import("./gbp.server");
      const token = await getAccessToken(ownerId);
      const reviews = await listReviews(
        token,
        business.google_account_id,
        business.google_location_id,
      );
      if (reviews.length) {
        await client.from("reviews").upsert(
          reviews.map((review) => ({
            owner_id: ownerId,
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
      }
      details.reviewsSynced = reviews.length;
    } catch (error) {
      details.notes.push(`Google review sync skipped: ${message(error)}`);
    }
  } else {
    details.notes.push("Google Business Profile not connected — replies are queued, not posted.");
  }

  // 2. Reply to reviews that are still waiting.
  if (business.auto_reply_enabled) {
    const { data: pending } = await client
      .from("reviews")
      .select("id, google_review_id, rating, comment, reviewer_name, reply_text, reply_status")
      .eq("owner_id", ownerId)
      .in("reply_status", ["pending", "draft"])
      .gte("rating", business.auto_reply_min_rating)
      .order("reviewed_at", { ascending: false })
      .limit(10);

    for (const review of pending ?? []) {
      try {
        const reply = review.reply_text?.trim()
          ? review.reply_text.trim()
          : await writeReply(client, business, review);
        if (!reply) continue;

        let posted = false;
        if (business.auto_reply_send && connected && review.google_review_id) {
          try {
            const { getAccessToken } = await import("./google-tokens.server");
            const { replyToReview } = await import("./gbp.server");
            const token = await getAccessToken(ownerId);
            await replyToReview(
              token,
              business.google_account_id,
              business.google_location_id,
              review.google_review_id,
              reply,
            );
            posted = true;
          } catch (error) {
            details.notes.push(`Could not post a reply to Google: ${message(error)}`);
          }
        }

        await client
          .from("reviews")
          .update(
            posted
              ? {
                  reply_text: reply,
                  reply_status: "replied",
                  replied_at: new Date().toISOString(),
                  error: null,
                }
              : {
                  reply_text: reply,
                  reply_status: business.auto_reply_send ? "queued" : "draft",
                },
          )
          .eq("id", review.id);

        if (posted) details.repliesSent += 1;
        else details.repliesDrafted += 1;
      } catch (error) {
        details.notes.push(`Reply generation failed: ${message(error)}`);
      }
    }
  }

  // 3. Keep the posting cadence alive.
  if (business.auto_post_enabled) {
    const gap = cadenceGapDays(business.posting_frequency);
    const since = new Date(Date.now() - gap * 24 * 60 * 60 * 1000).toISOString();
    const { data: recent } = await client
      .from("posts")
      .select("id")
      .eq("owner_id", ownerId)
      .in("status", ["scheduled", "published"])
      .gte("created_at", since)
      .limit(1);

    if (!(recent ?? []).length) {
      try {
        if (await schedulePost(client, business, ownerId)) details.postsScheduled = 1;
      } catch (error) {
        details.notes.push(`Post generation failed: ${message(error)}`);
      }
    } else {
      details.notes.push("Posting cadence already covered — no new post needed.");
    }
  }

  // 4. Profile management tips.
  try {
    const { data: allReviews } = await client
      .from("reviews")
      .select("rating")
      .eq("owner_id", ownerId)
      .limit(500);
    const ratings = (allReviews ?? []).map((r: { rating: number }) => r.rating ?? 0).filter(Boolean);
    details.profileTips = await profileTips(business, {
      count: ratings.length,
      avg: ratings.length
        ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
        : 0,
    });
  } catch (error) {
    details.notes.push(`Profile review skipped: ${message(error)}`);
  }

  const parts = [
    details.reviewsSynced ? `${details.reviewsSynced} reviews synced` : null,
    details.repliesSent ? `${details.repliesSent} replies posted` : null,
    details.repliesDrafted ? `${details.repliesDrafted} replies drafted` : null,
    details.postsScheduled ? "1 post scheduled" : null,
    details.profileTips.length ? `${details.profileTips.length} profile tips` : null,
  ].filter(Boolean);

  const status: AgentRunResult["status"] = details.notes.length
    ? parts.length
      ? "partial"
      : "error"
    : "ok";

  const result: AgentRunResult = {
    status,
    summary: parts.length ? parts.join(" · ") : "Nothing to do this run.",
    details,
  };

  await client.from("agent_runs").insert({
    owner_id: ownerId,
    business_id: business.id,
    trigger,
    status: result.status,
    summary: result.summary,
    details: result.details,
  });

  return result;
}
