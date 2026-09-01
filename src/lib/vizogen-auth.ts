const API_BASE = "https://api2.magicqr.in/auth";

/** Fixed system values required by the Vizogen auth API. */
const SUPER_ADMIN_ID = 70;
const SUPER_ADMIN = 70;
const ROLE_ID = 4;
const DEFAULT_COUNTRY_CODE = "91";

/** Where a successfully authenticated user lands. */
export const DASHBOARD_URL = "https://login.vizogen.in/dashboard";

/** Key used to persist the auth token in browser storage. */
export const TOKEN_STORAGE_KEY = "vizogen_auth_token";

export function storeToken(token?: string) {
  if (!token || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    /* storage unavailable — the token still travels in the redirect URL */
  }
}

/** Normalize a phone number to country code + digits (no + or spaces). */
export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `${DEFAULT_COUNTRY_CODE}${digits}`;
  return digits;
}

export type AuthResult = {
  ok: boolean;
  message: string;
  token?: string | undefined;
  raw?: unknown;
};

function pickToken(payload: any): string | undefined {
  return (
    payload?.token ??
    payload?.access_token ??
    payload?.data?.token ??
    payload?.data?.access_token ??
    payload?.user?.token ??
    undefined
  );
}

function pickMessage(payload: any, fallback: string): string {
  if (typeof payload?.msg === "string") return payload.msg;
  if (typeof payload?.message === "string") return payload.message;
  const errors = payload?.errors;
  if (errors && typeof errors === "object") {
    const first = Object.values(errors)[0];
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
    if (typeof first === "string") return first;
  }
  return fallback;
}

async function post(path: string, body: Record<string, unknown>): Promise<AuthResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, message: "Network error. Please check your connection and try again." };
  }

  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  const success = res.ok && payload?.status !== false;
  return {
    ok: success,
    message: pickMessage(payload, success ? "Success" : "Something went wrong. Please try again."),
    token: pickToken(payload),
    raw: payload,
  };
}

export async function signIn(input: { emailOrPhone: string; password: string }) {
  const result = await post("/sign-in", {
    email_or_phone: input.emailOrPhone.trim(),
    password: input.password,
    super_admin_id: SUPER_ADMIN_ID,
  });
  if (result.ok) storeToken(result.token);
  return result;
}

export async function signUp(input: {
  businessName: string;
  phone: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}) {
  const business = input.businessName.trim();
  const result = await post("/sign-up", {
    first_name: business,
    last_name: business,
    business_name: business,
    phone: normalizePhone(input.phone),
    email: input.email.trim(),
    password: input.password,
    password_confirmation: input.passwordConfirmation,
    super_admin: SUPER_ADMIN,
    role_id: ROLE_ID,
  });
  if (result.ok) storeToken(result.token);
  return result;
}

/** Request a password reset link/OTP for an email or phone. */
export async function forgotPassword(input: { emailOrPhone: string }) {
  const value = input.emailOrPhone.trim();
  return post("/forgot-password", {
    email_or_phone: value,
    email: value,
    super_admin_id: SUPER_ADMIN_ID,
  });
}


/** Hand the authenticated user to the product dashboard with the session token. */
export function dashboardRedirectUrl(token?: string) {
  if (!token) return DASHBOARD_URL;
  return `${DASHBOARD_URL}?token=${encodeURIComponent(token)}`;
}
