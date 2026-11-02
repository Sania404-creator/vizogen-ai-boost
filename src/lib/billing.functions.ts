import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { SITE_URL } from "@/lib/aeo";
import {
  BILLING_LINK_DAYS,
  billingTotals,
  effectiveBillingStatus,
  formatAmount,
  istDateTime,
  type BillingLine,
} from "@/lib/billing";

const ADMIN_INBOX = "info.vizogen@gmail.com";
const BUCKET = "billing-docs";
const tokenSchema = z.string().trim().regex(/^[A-Za-z0-9_-]{20,80}$/);

const COLS =
  "id, lead_id, title, client_name, client_company, client_email, scope, deliverables, pricing, currency, gst_rate, notes, terms, valid_until, status, version, share_token, sent_at, viewed_at, created_at, expires_at, token_used_at, billing_number, signer_name, signer_designation, confirmed_at, signed_ip, document_hash, signed_pdf_path, change_request, change_requested_at";

type Row = {
  id: string;
  lead_id: string;
  title: string;
  client_name: string;
  client_company: string;
  client_email: string;
  scope: string;
  deliverables: string[];
  pricing: BillingLine[];
  currency: string;
  gst_rate: number;
  notes: string;
  terms: string;
  valid_until: string | null;
  status: string;
  version: number;
  share_token: string;
  created_at: string;
  expires_at: string | null;
  token_used_at: string | null;
  billing_number: string | null;
  signer_name: string | null;
  signer_designation: string | null;
  confirmed_at: string | null;
  signed_pdf_path: string | null;
};

async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

async function loadByToken(token: string) {
  const db = await admin();
  const { data } = await db
    .from("crm_proposals")
    .select(COLS)
    .eq("share_token", token)
    .neq("status", "draft")
    .maybeSingle();
  return data as unknown as Row | null;
}

const toDoc = (r: Row) => ({
  billingNumber: r.billing_number ?? `VZ-${r.id.slice(0, 8).toUpperCase()}`,
  title: r.title,
  clientName: r.client_name,
  clientCompany: r.client_company,
  clientEmail: r.client_email,
  scope: r.scope,
  pricing: r.pricing ?? [],
  currency: r.currency,
  gstRate: Number(r.gst_rate ?? 18),
  notes: r.notes,
  terms: r.terms,
  validUntil: r.valid_until,
  createdAt: r.created_at,
});

async function notifyTeam(leadId: string, title: string, body: string) {
  const db = await admin();
  const { data: lead } = await db.from("crm_leads").select("assigned_to").eq("id", leadId).maybeSingle();
  const { data: admins } = await db.from("user_roles").select("user_id").eq("role", "admin");
  const ids = new Set<string>([...(admins ?? []).map((a) => a.user_id)]);
  if (lead?.assigned_to) ids.add(lead.assigned_to);
  if (ids.size)
    await db.from("crm_notifications").insert(
      [...ids].map((user_id) => ({ user_id, type: "billing", title, body, lead_id: leadId })),
    );
  return lead?.assigned_to ?? null;
}

async function assignedEmail(userId: string | null) {
  if (!userId) return null;
  const db = await admin();
  const { data } = await db.from("crm_members").select("email").eq("user_id", userId).maybeSingle();
  return data?.email ?? null;
}

/** Public: load a billing by its link. Marks Sent billings as Viewed. */
export const getBilling = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ token: tokenSchema }).parse(input))
  .handler(async ({ data }) => {
    const r = await loadByToken(data.token);
    if (!r) return { state: "invalid" as const };
    const status = effectiveBillingStatus(r.status, r.expires_at);
    if (status === "confirmed" || status === "accepted")
      return { state: "confirmed" as const, billingNumber: toDoc(r).billingNumber, signerName: r.signer_name, confirmedAt: r.confirmed_at };
    if (status === "expired") return { state: "expired" as const, billingNumber: toDoc(r).billingNumber };

    if (r.status === "sent") {
      const db = await admin();
      await db.from("crm_proposals").update({ status: "viewed", viewed_at: new Date().toISOString() }).eq("id", r.id);
      await db.from("crm_activities").insert({
        lead_id: r.lead_id, actor_name: r.client_name, type: "billing_viewed",
        body: `Client opened billing ${toDoc(r).billingNumber}.`,
      });
      await notifyTeam(r.lead_id, `${r.client_name} viewed billing`, `${toDoc(r).billingNumber} was opened.`);
    }
    const doc = toDoc(r);
    return {
      state: "open" as const,
      status: r.status === "sent" ? "viewed" : r.status,
      doc,
      deliverables: r.deliverables ?? [],
      totals: billingTotals(doc.pricing, doc.gstRate),
      expiresAt: r.expires_at,
    };
  });

/** Public: download the billing PDF (unsigned, or signed once confirmed). */
export const downloadBillingPdf = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ token: tokenSchema }).parse(input))
  .handler(async ({ data }) => {
    const r = await loadByToken(data.token);
    if (!r) throw new Error("Link not valid.");
    const db = await admin();
    if (r.signed_pdf_path) {
      const { data: s } = await db.storage.from(BUCKET).createSignedUrl(r.signed_pdf_path, 120);
      if (!s) throw new Error("Could not prepare the download.");
      return { url: s.signedUrl, base64: null, filename: `${toDoc(r).billingNumber}-signed.pdf` };
    }
    if (effectiveBillingStatus(r.status, r.expires_at) === "expired") throw new Error("This link has expired.");
    const { renderBillingPdf, toBase64 } = await import("@/lib/billing-pdf.server");
    const bytes = await renderBillingPdf(toDoc(r));
    return { url: null, base64: toBase64(bytes), filename: `${toDoc(r).billingNumber}.pdf` };
  });

/** Public: client asks for changes. */
export const requestBillingChanges = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: tokenSchema, message: z.string().trim().min(5).max(2000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const r = await loadByToken(data.token);
    if (!r) throw new Error("Link not valid.");
    const st = effectiveBillingStatus(r.status, r.expires_at);
    if (st === "confirmed" || st === "accepted") throw new Error("This billing is already confirmed.");
    if (st === "expired") throw new Error("This link has expired.");
    const db = await admin();
    await db.from("crm_proposals").update({
      status: "changes_requested", change_request: data.message, change_requested_at: new Date().toISOString(),
    }).eq("id", r.id);
    const num = toDoc(r).billingNumber;
    await db.from("crm_activities").insert({
      lead_id: r.lead_id, actor_name: r.client_name, type: "billing_changes", body: `Changes requested on ${num}: ${data.message}`,
    });
    const assigned = await notifyTeam(r.lead_id, `${r.client_name} requested changes`, data.message.slice(0, 200));
    const { sendGmail } = await import("@/lib/email.server");
    const { buildChangesRequestedEmail } = await import("@/lib/crm-emails");
    const html = buildChangesRequestedEmail({
      clientName: r.client_name, billingNumber: num, message: data.message, crmLink: `${SITE_URL}/crm/lead/${r.lead_id}`,
    });
    const to = new Set([ADMIN_INBOX, (await assignedEmail(assigned)) ?? ADMIN_INBOX]);
    for (const t of to) await sendGmail(t, `Changes requested: ${num}`, html).catch(() => false);
    return { ok: true };
  });

/** Public: accept & sign. All checks run here, on the server. */
export const signBilling = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        token: tokenSchema,
        signerName: z.string().trim().min(2).max(120),
        designation: z.string().trim().max(160).default(""),
        signature: z.string().startsWith("data:image/png;base64,").min(200).max(600000),
        consent: z.literal(true),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const r = await loadByToken(data.token);
    if (!r) throw new Error("Link not valid.");
    const st = effectiveBillingStatus(r.status, r.expires_at);
    if (st === "confirmed" || st === "accepted" || r.token_used_at) throw new Error("This billing has already been confirmed.");
    if (st === "expired") throw new Error("This link has expired. Please contact us for a new one.");

    const db = await admin();
    const signedAt = new Date().toISOString();
    // Claim the token first so two parallel submissions cannot both sign.
    const { data: claimed } = await db
      .from("crm_proposals")
      .update({ token_used_at: signedAt })
      .eq("id", r.id)
      .is("token_used_at", null)
      .select("id");
    if (!claimed?.length) throw new Error("This billing has already been confirmed.");

    try {
      const { renderBillingPdf, billingHash, toBase64 } = await import("@/lib/billing-pdf.server");
      const doc = toDoc(r);
      const pngBytes = new Uint8Array(Buffer.from(data.signature.split(",")[1]!, "base64"));
      const documentHash = await billingHash(doc);
      const ip = (getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for") || "").split(",")[0]!.trim();
      const userAgent = (getRequestHeader("user-agent") || "").slice(0, 400);
      const sig = { pngBytes, signerName: data.signerName, designation: data.designation, signedAt, ip, userAgent, documentHash };
      const pdfBytes = await renderBillingPdf(doc, sig);

      const base = `${r.id}/${Date.now()}`;
      const up1 = await db.storage.from(BUCKET).upload(`${base}-signature.png`, pngBytes, { contentType: "image/png" });
      const up2 = await db.storage.from(BUCKET).upload(`${base}-signed.pdf`, pdfBytes, { contentType: "application/pdf" });
      if (up1.error || up2.error) throw new Error("Could not store the signed document.");

      const { error } = await db.from("crm_proposals").update({
        status: "confirmed", decided_at: signedAt, confirmed_at: signedAt, accepted_at: signedAt, terms_agreed_at: signedAt,
        signer_name: data.signerName, signer_designation: data.designation || null, signed_ip: ip || null,
        signed_user_agent: userAgent || null, document_hash: documentHash,
        signature_path: `${base}-signature.png`, signed_pdf_path: `${base}-signed.pdf`,
        billing_number: doc.billingNumber,
      }).eq("id", r.id);
      if (error) throw new Error(error.message);

      const { data: leadRow } = await db.from("crm_leads").select("tags").eq("id", r.lead_id).maybeSingle();
      const tags = Array.from(new Set([...(leadRow?.tags ?? []), "Billing Confirmed"]));
      await db.from("crm_leads").update({ status: "won", tags }).eq("id", r.lead_id);
      await db.from("crm_activities").insert({
        lead_id: r.lead_id, actor_name: data.signerName, type: "billing_signed",
        body: `${data.signerName} accepted & signed billing ${doc.billingNumber}.`,
        meta: { billing_number: doc.billingNumber, ip, hash: documentHash },
      });
      const assigned = await notifyTeam(r.lead_id, `${r.client_name} signed ${doc.billingNumber}`, "Billing confirmed.");

      const totals = billingTotals(doc.pricing, doc.gstRate);
      const total = formatAmount(totals.total, doc.currency);
      const attachment = [{ filename: `${doc.billingNumber}-signed.pdf`, contentType: "application/pdf", base64: toBase64(pdfBytes) }];
      const { sendGmail } = await import("@/lib/email.server");
      const m = await import("@/lib/crm-emails");
      const emailed = await sendGmail(
        r.client_email,
        `Confirmed: Billing ${doc.billingNumber} signed successfully`,
        m.buildBillingConfirmedClientEmail({ clientName: r.client_name, billingNumber: doc.billingNumber, total }),
        attachment,
      ).catch(() => false);
      const adminHtml = m.buildBillingConfirmedAdminEmail({
        clientName: r.client_name, billingNumber: doc.billingNumber, total, signedAt: istDateTime(signedAt),
        crmLink: `${SITE_URL}/crm/lead/${r.lead_id}`,
      });
      const team = new Set([ADMIN_INBOX, (await assignedEmail(assigned)) ?? ADMIN_INBOX]);
      for (const t of team)
        await sendGmail(t, `✅ ${r.client_name} accepted & signed Billing ${doc.billingNumber}`, adminHtml, attachment).catch(() => false);

      return { ok: true, emailed: Boolean(emailed), billingNumber: doc.billingNumber };
    } catch (e) {
      // Release the token if nothing was confirmed, so the client can retry.
      await db.from("crm_proposals").update({ token_used_at: null }).eq("id", r.id).neq("status", "confirmed");
      throw e;
    }
  });

/** CRM: short-lived link to a signed PDF. */
export const getSignedBillingUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row } = await context.supabase.from("crm_proposals").select("signed_pdf_path").eq("id", data.id).maybeSingle();
    if (!row?.signed_pdf_path) throw new Error("No signed PDF yet.");
    const db = await admin();
    const { data: s } = await db.storage.from(BUCKET).createSignedUrl(row.signed_pdf_path, 120);
    if (!s) throw new Error("Could not prepare the download.");
    return { url: s.signedUrl };
  });

/** CRM: issue a fresh link (new token + new expiry) for an unsigned billing. */
export const regenerateBillingLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    const { error, data: row } = await context.supabase
      .from("crm_proposals")
      .update({
        share_token: token,
        token_used_at: null,
        status: "sent",
        expires_at: new Date(Date.now() + BILLING_LINK_DAYS * 864e5).toISOString(),
      })
      .eq("id", data.id)
      .neq("status", "confirmed")
      .select("id")
      .maybeSingle();
    if (error || !row) throw new Error(error?.message || "This billing can't get a new link.");
    return { link: `${SITE_URL}/billing/${token}` };
  });
