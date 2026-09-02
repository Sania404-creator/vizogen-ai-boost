// Server-only helpers for reading/writing the stored Google connection.
import { GbpError, refreshAccessToken } from "./gbp.server";

export interface StoredConnection {
  owner_id: string;
  google_email: string | null;
  refresh_token: string | null;
  access_token: string | null;
  access_token_expires_at: string | null;
  status: string;
}

export async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function saveConnection(input: {
  ownerId: string;
  googleEmail: string | null;
  refreshToken: string | null;
  accessToken: string;
  expiresIn: number;
  scopes: string;
}) {
  const db = await admin();
  const payload: Record<string, unknown> = {
    owner_id: input.ownerId,
    google_email: input.googleEmail,
    access_token: input.accessToken,
    access_token_expires_at: new Date(Date.now() + input.expiresIn * 1000).toISOString(),
    scopes: input.scopes,
    status: "connected",
    last_error: null,
    updated_at: new Date().toISOString(),
  };
  if (input.refreshToken) payload["refresh_token"] = input.refreshToken;
  const { error } = await db.from("google_connections").upsert(payload, { onConflict: "owner_id" });
  if (error) throw new Error(error.message);
}

export async function getConnection(ownerId: string): Promise<StoredConnection | null> {
  const db = await admin();
  const { data } = await db
    .from("google_connections")
    .select("owner_id, google_email, refresh_token, access_token, access_token_expires_at, status")
    .eq("owner_id", ownerId)
    .maybeSingle();
  return (data as StoredConnection | null) ?? null;
}

/** Returns a usable access token, refreshing when needed. */
export async function getAccessToken(ownerId: string) {
  const connection = await getConnection(ownerId);
  if (!connection?.refresh_token) {
    throw new GbpError("not_connected", "Connect your Google account to publish to Google.");
  }
  const expiry = connection.access_token_expires_at
    ? new Date(connection.access_token_expires_at).getTime()
    : 0;
  if (connection.access_token && expiry - 60_000 > Date.now()) {
    return connection.access_token;
  }
  const refreshed = await refreshAccessToken(connection.refresh_token);
  const db = await admin();
  await db
    .from("google_connections")
    .update({
      access_token: refreshed.accessToken,
      access_token_expires_at: new Date(Date.now() + refreshed.expiresIn * 1000).toISOString(),
    })
    .eq("owner_id", ownerId);
  return refreshed.accessToken;
}

export async function recordConnectionError(ownerId: string, message: string) {
  const db = await admin();
  await db.from("google_connections").update({ last_error: message }).eq("owner_id", ownerId);
}
