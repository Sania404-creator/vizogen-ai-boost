// Server-only Google Business Profile (GBP) API layer.
// All calls go through a stored refresh token; errors are normalised so the UI
// can tell "Google has not granted API access yet" apart from real failures.

export const GBP_SCOPE = "https://www.googleapis.com/auth/business.manage";

export type GbpErrorKind = "not_configured" | "not_connected" | "awaiting_google_approval" | "error";

export class GbpError extends Error {
  kind: GbpErrorKind;
  constructor(kind: GbpErrorKind, message: string) {
    super(message);
    this.kind = kind;
  }
}

export function googleOAuthConfig() {
  const clientId = process.env["GOOGLE_GBP_CLIENT_ID"];
  const clientSecret = process.env["GOOGLE_GBP_CLIENT_SECRET"];
  if (!clientId || !clientSecret) {
    throw new GbpError(
      "not_configured",
      "Google connection is not configured yet. Add the Google OAuth client ID and secret to enable it.",
    );
  }
  return { clientId, clientSecret };
}

export function isGoogleConfigured() {
  return Boolean(process.env["GOOGLE_GBP_CLIENT_ID"] && process.env["GOOGLE_GBP_CLIENT_SECRET"]);
}

export function buildConsentUrl(origin: string, state: string) {
  const { clientId } = googleOAuthConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/public/google/callback`,
    response_type: "code",
    scope: `${GBP_SCOPE} https://www.googleapis.com/auth/userinfo.email`,
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCode(code: string, origin: string) {
  const { clientId, clientSecret } = googleOAuthConfig();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${origin}/api/public/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  const json = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    error_description?: string;
  };
  if (!res.ok || !json.access_token) {
    throw new GbpError("error", json.error_description ?? "Google rejected the sign-in.");
  }
  return json;
}

export async function refreshAccessToken(refreshToken: string) {
  const { clientId, clientSecret } = googleOAuthConfig();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });
  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };
  if (!res.ok || !json.access_token) {
    throw new GbpError(
      "not_connected",
      json.error_description ?? "Google connection expired. Reconnect your Google account.",
    );
  }
  return { accessToken: json.access_token, expiresIn: json.expires_in ?? 3600 };
}

async function gapi<T>(url: string, accessToken: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
  });
  const text = await res.text();
  if (!res.ok) {
    const lower = text.toLowerCase();
    if (
      res.status === 403 &&
      (lower.includes("has not been used") ||
        lower.includes("is disabled") ||
        lower.includes("accessnotconfigured") ||
        lower.includes("quota"))
    ) {
      throw new GbpError(
        "awaiting_google_approval",
        "Google has not granted this project access to the Business Profile APIs yet. Posts and replies stay queued until access is approved.",
      );
    }
    throw new GbpError("error", `Google API error (${res.status}): ${text.slice(0, 300)}`);
  }
  return (text ? JSON.parse(text) : {}) as T;
}

export async function getUserEmail(accessToken: string) {
  const data = await gapi<{ email?: string }>(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    accessToken,
  );
  return data.email ?? null;
}

export interface GbpLocation {
  accountId: string;
  locationId: string;
  title: string;
  address: string;
}

export async function listLocations(accessToken: string): Promise<GbpLocation[]> {
  const accounts = await gapi<{ accounts?: { name: string; accountName?: string }[] }>(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    accessToken,
  );
  const out: GbpLocation[] = [];
  for (const account of accounts.accounts ?? []) {
    const url =
      `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations` +
      `?readMask=name,title,storefrontAddress&pageSize=100`;
    const locations = await gapi<{
      locations?: {
        name: string;
        title?: string;
        storefrontAddress?: { addressLines?: string[]; locality?: string; administrativeArea?: string };
      }[];
    }>(url, accessToken);
    for (const location of locations.locations ?? []) {
      const addr = location.storefrontAddress;
      out.push({
        accountId: account.name.replace("accounts/", ""),
        locationId: location.name.replace("locations/", ""),
        title: location.title ?? "Untitled location",
        address: [addr?.addressLines?.join(", "), addr?.locality, addr?.administrativeArea]
          .filter(Boolean)
          .join(", "),
      });
    }
  }
  return out;
}

export async function createLocalPost(
  accessToken: string,
  accountId: string,
  locationId: string,
  post: {
    summary: string;
    ctaLabel?: string | null;
    ctaUrl?: string | null;
    imageUrl?: string | null;
  },
) {
  const body: Record<string, unknown> = {
    languageCode: "en",
    summary: post.summary,
    topicType: "STANDARD",
  };
  if (post.ctaUrl) {
    body["callToAction"] = {
      actionType: post.ctaLabel === "Call now" ? "CALL" : "LEARN_MORE",
      url: post.ctaUrl,
    };
  }
  if (post.imageUrl) {
    body["media"] = [{ mediaFormat: "PHOTO", sourceUrl: post.imageUrl }];
  }
  return gapi<{ name?: string }>(
    `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/localPosts`,
    accessToken,
    { method: "POST", body: JSON.stringify(body) },
  );
}

export interface GbpReview {
  reviewId: string;
  reviewer: string;
  photo: string | null;
  rating: number;
  comment: string | null;
  createTime: string;
  replyComment: string | null;
}

const STAR_MAP: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export async function listReviews(
  accessToken: string,
  accountId: string,
  locationId: string,
): Promise<GbpReview[]> {
  const data = await gapi<{
    reviews?: {
      reviewId: string;
      reviewer?: { displayName?: string; profilePhotoUrl?: string };
      starRating?: string;
      comment?: string;
      createTime?: string;
      reviewReply?: { comment?: string };
    }[];
  }>(
    `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews?pageSize=50`,
    accessToken,
  );
  return (data.reviews ?? []).map((review) => ({
    reviewId: review.reviewId,
    reviewer: review.reviewer?.displayName ?? "Google user",
    photo: review.reviewer?.profilePhotoUrl ?? null,
    rating: STAR_MAP[review.starRating ?? "FIVE"] ?? 5,
    comment: review.comment ?? null,
    createTime: review.createTime ?? new Date().toISOString(),
    replyComment: review.reviewReply?.comment ?? null,
  }));
}

export async function replyToReview(
  accessToken: string,
  accountId: string,
  locationId: string,
  reviewId: string,
  comment: string,
) {
  return gapi<unknown>(
    `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`,
    accessToken,
    { method: "PUT", body: JSON.stringify({ comment }) },
  );
}
