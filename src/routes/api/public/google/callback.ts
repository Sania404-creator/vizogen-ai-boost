import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

function redirectTo(origin: string, params: Record<string, string>) {
  const search = new URLSearchParams(params).toString();
  return new Response(null, {
    status: 302,
    headers: { Location: `${origin}/dashboard/settings?${search}` },
  });
}

export const Route = createFileRoute("/api/public/google/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const forwardedHost =
          url.hostname === "localhost" ? request.headers.get("x-forwarded-host") : null;
        const origin = forwardedHost ? `https://${forwardedHost}` : url.origin;

        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const googleError = url.searchParams.get("error");

        if (googleError) {
          return redirectTo(origin, { google: "error", message: googleError });
        }
        if (!code || !state) {
          return redirectTo(origin, { google: "error", message: "Missing authorization code." });
        }

        const { verifyState } = await import("@/lib/oauth-state.server");
        const userId = verifyState(state);
        if (!userId) {
          return redirectTo(origin, { google: "error", message: "This link expired. Try again." });
        }

        try {
          const { exchangeCode, getUserEmail, GBP_SCOPE } = await import("@/lib/gbp.server");
          const { saveConnection } = await import("@/lib/google-tokens.server");
          const tokens = await exchangeCode(code, origin);
          let email: string | null = null;
          try {
            email = await getUserEmail(tokens.access_token!);
          } catch {
            email = null;
          }
          await saveConnection({
            ownerId: userId,
            googleEmail: email,
            refreshToken: tokens.refresh_token ?? null,
            accessToken: tokens.access_token!,
            expiresIn: tokens.expires_in ?? 3600,
            scopes: tokens.scope ?? GBP_SCOPE,
          });
          return redirectTo(origin, { google: "connected" });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Google connection failed.";
          return redirectTo(origin, { google: "error", message });
        }
      },
    },
  },
});
