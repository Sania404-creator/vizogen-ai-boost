import { createHmac, timingSafeEqual } from "crypto";

function secret() {
  const value = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? process.env["SUPABASE_JWKS"];
  if (!value) throw new Error("Missing server secret for OAuth state signing");
  return value;
}

export function signState(userId: string) {
  const payload = `${userId}.${Date.now() + 10 * 60 * 1000}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyState(state: string): string | null {
  try {
    const decoded = Buffer.from(state, "base64url").toString("utf8");
    const parts = decoded.split(".");
    if (parts.length !== 3) return null;
    const [userId, expiry, sig] = parts as [string, string, string];
    const expected = createHmac("sha256", secret()).update(`${userId}.${expiry}`).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    if (Number(expiry) < Date.now()) return null;
    return userId;
  } catch {
    return null;
  }
}
