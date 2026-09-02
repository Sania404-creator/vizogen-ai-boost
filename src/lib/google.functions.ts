import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function normalise(error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong.";
  const kind =
    error && typeof error === "object" && "kind" in error
      ? String((error as { kind: unknown }).kind)
      : "error";
  return { kind, message };
}

export const getGoogleStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { isGoogleConfigured } = await import("./gbp.server");
    const { data } = await context.supabase
      .from("google_connections")
      .select("google_email, status, last_error, updated_at")
      .eq("owner_id", context.userId)
      .maybeSingle();
    return {
      configured: isGoogleConfigured(),
      connection: data ?? null,
    };
  });

export const startGoogleConnect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ origin: z.string().url() }).parse(input))
  .handler(async ({ data, context }) => {
    try {
      const { buildConsentUrl } = await import("./gbp.server");
      const { signState } = await import("./oauth-state.server");
      return { url: buildConsentUrl(data.origin, signState(context.userId)), error: null };
    } catch (error) {
      return { url: null, error: normalise(error) };
    }
  });

export const listGoogleLocations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      const { getAccessToken } = await import("./google-tokens.server");
      const { listLocations } = await import("./gbp.server");
      const token = await getAccessToken(context.userId);
      return { locations: await listLocations(token), error: null };
    } catch (error) {
      return { locations: [], error: normalise(error) };
    }
  });

export const selectGoogleLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        accountId: z.string().trim().min(1).max(80),
        locationId: z.string().trim().min(1).max(80),
        title: z.string().trim().min(1).max(200),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("businesses")
      .update({
        google_account_id: data.accountId,
        google_location_id: data.locationId,
        google_location_name: data.title,
      })
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const disconnectGoogle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase.from("google_connections").delete().eq("owner_id", context.userId);
    await context.supabase
      .from("businesses")
      .update({ google_account_id: null, google_location_id: null, google_location_name: null })
      .eq("owner_id", context.userId);
    return { ok: true };
  });
