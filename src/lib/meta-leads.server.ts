/**
 * Meta (Facebook / Instagram) lead-ads sync.
 *
 * Meta writes lead-form submissions into a Google Sheet. We read that sheet
 * through the Lovable connector gateway and turn new rows into CRM leads.
 * Server-only: never import this from browser code.
 */

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

export const META_SHEET_ID =
  process.env["META_LEADS_SHEET_ID"] ?? "13Aemk6eVz8s_EJJapE2s3GvjFW6PElocoJGLcKfrTEg";
export const META_SHEET_TAB = process.env["META_LEADS_SHEET_TAB"] ?? "vizogen lead form-copy";

export interface MetaSyncResult {
  ok: boolean;
  configured: boolean;
  rows: number;
  created: number;
  duplicates: number;
  skipped: number;
  error?: string;
}

function humanize(value: string | undefined) {
  if (!value) return "";
  return value
    .replace(/\\/g, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanPhone(value: string | undefined) {
  if (!value) return "";
  return value.replace(/^p:/i, "").replace(/\s+/g, "").trim();
}

function parseDate(value: string | undefined) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function readSheet(): Promise<string[][]> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const sheetsKey = process.env["GOOGLE_SHEETS_API_KEY"];
  if (!lovableKey || !sheetsKey) throw new Error("NOT_CONFIGURED");

  const range = `'${META_SHEET_TAB}'!A1:Z5000`;
  const res = await fetch(`${GATEWAY_URL}/spreadsheets/${META_SHEET_ID}/values/${range}`, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": sheetsKey,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Google Sheets request failed [${res.status}]: ${body}`);
    throw new Error(`Google Sheets request failed [${res.status}]: ${body}`);
  }
  const json = (await res.json()) as { values?: string[][] };
  return json.values ?? [];
}

export async function syncMetaLeads(): Promise<MetaSyncResult> {
  let values: string[][];
  try {
    values = await readSheet();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      ok: false,
      configured: message !== "NOT_CONFIGURED",
      rows: 0,
      created: 0,
      duplicates: 0,
      skipped: 0,
      error: message === "NOT_CONFIGURED" ? "Google Sheets is not connected yet." : message,
    };
  }

  const [header = [], ...rows] = values;
  const index = new Map<string, number>();
  header.forEach((h, i) => index.set(h.trim().toLowerCase(), i));
  const col = (row: string[], name: string) => {
    const i = index.get(name);
    return i === undefined ? undefined : row[i];
  };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: existing } = await supabaseAdmin
    .from("crm_leads")
    .select("id, email, phone, source_page")
    .limit(10000);

  const seenMeta = new Set<string>();
  const seenEmail = new Set<string>();
  const seenPhone = new Set<string>();
  for (const lead of existing ?? []) {
    if (lead.source_page?.startsWith("meta:")) seenMeta.add(lead.source_page);
    if (lead.email) seenEmail.add(lead.email.toLowerCase());
    if (lead.phone) seenPhone.add(cleanPhone(lead.phone));
  }

  let created = 0;
  let duplicates = 0;
  let skipped = 0;

  for (const row of rows) {
    const metaId = (col(row, "t") ?? col(row, "id") ?? "").trim();
    const name = (col(row, "full_name") ?? "").trim();
    const email = (col(row, "email") ?? "").trim().toLowerCase();
    const phone = cleanPhone(col(row, "phone_number"));

    if (!name && !email && !phone) {
      skipped += 1;
      continue;
    }

    const key = metaId ? `meta:${metaId}` : "";
    if (
      (key && seenMeta.has(key)) ||
      (email && seenEmail.has(email)) ||
      (phone && seenPhone.has(phone))
    ) {
      duplicates += 1;
      continue;
    }

    const business = humanize(col(row, "what_is_your_business_?"));
    const looking = humanize(col(row, "what_are_you_looking_for_?"));
    const start = humanize(col(row, "when_will_you_want_to_start_?"));
    const interest = humanize(
      col(row, "our_plan_starts_from_999\\-month_and_we_offer_25%_discount_on_yearly_plan_!"),
    );
    const demoRaw = (col(row, "i_want_to_book_demo_for_this_software_!") ?? "").trim();
    const campaign = (col(row, "campaign_name") ?? "").trim();
    const platform = (col(row, "platform") ?? "").trim();
    const leadStatus = (col(row, "lead_status") ?? "").trim();
    const createdAt = parseDate(col(row, "created_time"));
    const demoAt = parseDate(demoRaw);

    const messageParts = [
      business ? `Business: ${business}` : "",
      looking ? `Looking for: ${looking}` : "",
      start ? `Wants to start: ${start}` : "",
      interest ? `Pricing response: ${interest}` : "",
      demoRaw ? `Demo requested: ${demoRaw}` : "",
      campaign ? `Campaign: ${campaign}` : "",
      leadStatus ? `Meta lead status: ${leadStatus}` : "",
    ].filter(Boolean);

    const tags = ["meta-ads"];
    if (platform === "ig") tags.push("instagram");
    else if (platform === "fb") tags.push("facebook");

    const { error } = await supabaseAdmin.from("crm_leads").insert({
      name: name || email || phone,
      email,
      phone,
      company: business || "",
      source: "meta_ads",
      status: "new",
      message: messageParts.join("\n") || null,
      source_page: key || "meta:sheet",
      requested_demo_at: demoAt ? demoAt.toISOString() : null,
      requested_demo_label: demoRaw || null,
      tags,
      created_at: createdAt ? createdAt.toISOString() : undefined,
    });

    if (error) {
      console.error(`Could not import Meta lead ${metaId}: ${error.message}`);
      skipped += 1;
      continue;
    }

    created += 1;
    if (key) seenMeta.add(key);
    if (email) seenEmail.add(email);
    if (phone) seenPhone.add(phone);
  }

  return { ok: true, configured: true, rows: rows.length, created, duplicates, skipped };
}
