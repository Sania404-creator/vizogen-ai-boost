const API_BASE = "https://api2.magicqr.in/auth";

/** Fixed system values required by the Vizogen auth API. */
const SUPER_ADMIN = 70;
const ROLE_ID = 4;

/** Where a successfully authenticated user lands. */
export const DASHBOARD_URL = "https://login.vizogen.in/dashboard";

export type AuthResult = {
  ok: boolean;
  message: string;
  token?: string;
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

export function signIn(input: { emailOrPhone: string; password: string }) {
  return post("/sign-in", {
    email_or_phone: input.emailOrPhone.trim(),
    password: input.password,
    super_admin_id: SUPER_ADMIN,
  });
}

export function signUp(input: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}) {
  return post("/sign-up", {
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    // country code, digits only, no + or spaces
    phone: input.phone.replace(/[^\d]/g, ""),
    email: input.email.trim(),
    password: input.password,
    password_confirmation: input.password,
    super_admin: SUPER_ADMIN,
    role_id: ROLE_ID,
  });
}

/** Hand the session token over to the Vizogen dashboard. */
export function dashboardRedirectUrl(token?: string) {
  return token ? `${DASHBOARD_URL}?token=${encodeURIComponent(token)}` : DASHBOARD_URL;
}
