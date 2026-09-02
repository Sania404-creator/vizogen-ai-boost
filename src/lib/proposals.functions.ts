import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { SITE_URL } from "@/lib/aeo";

export interface PricingLine {
  item: string;
  qty: number;
  price: number;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  scope: string;
  deliverables: string[];
  pricing: PricingLine[];
  notes: string;
  terms: string;
}

export interface Proposal {
  id: string;
  lead_id: string;
  title: string;
  client_name: string;
  client_company: string;
  client_email: string;
  scope: string;
  deliverables: string[];
  pricing: PricingLine[];
  currency: string;
  notes: string;
  terms: string;
  valid_until: string | null;
  status: string;
  version: number;
  share_token: string;
  sent_at: string | null;
  viewed_at: string | null;
  created_at: string;
}

const PROPOSAL_COLUMNS =
  "id, lead_id, title, client_name, client_company, client_email, scope, deliverables, pricing, currency, notes, terms, valid_until, status, version, share_token, sent_at, viewed_at, created_at";

const pricingSchema = z.array(
  z.object({
    item: z.string().trim().min(1).max(160),
    qty: z.number().int().min(1).max(999),
    price: z.number().min(0).max(100000000),
  }),
);

export const listTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("crm_proposal_templates")
      .select("id, name, scope, deliverables, pricing, notes, terms")
      .order("created_at", { ascending: true });
    return (data ?? []) as unknown as ProposalTemplate[];
  });

export const saveTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string().trim().min(2).max(120),
        scope: z.string().trim().max(4000).default(""),
        deliverables: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
        pricing: pricingSchema.max(20).default([]),
        notes: z.string().trim().max(2000).default(""),
        terms: z.string().trim().max(4000).default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const payload = {
      name: data.name,
      scope: data.scope,
      deliverables: data.deliverables,
      pricing: data.pricing,
      notes: data.notes,
      terms: data.terms,
      created_by: context.userId,
    };
    if (data.id) {
      const { error } = await context.supabase
        .from("crm_proposal_templates")
        .update(payload)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }
    const { error } = await context.supabase.from("crm_proposal_templates").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("crm_proposal_templates")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listProposals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("crm_proposals")
      .select(PROPOSAL_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(300);
    return (data ?? []) as unknown as Proposal[];
  });

const proposalSchema = z.object({
  id: z.string().uuid().optional(),
  leadId: z.string().uuid(),
  templateId: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2).max(160),
  clientName: z.string().trim().min(2).max(160),
  clientCompany: z.string().trim().max(160).default(""),
  clientEmail: z.string().trim().email().max(200),
  scope: z.string().trim().max(6000).default(""),
  deliverables: z.array(z.string().trim().min(1).max(200)).max(30).default([]),
  pricing: pricingSchema.max(30).default([]),
  currency: z.enum(["INR", "USD"]).default("INR"),
  notes: z.string().trim().max(3000).default(""),
  terms: z.string().trim().max(6000).default(""),
  validUntil: z.string().max(20).optional().or(z.literal("")),
});

export const saveProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => proposalSchema.parse(input))
  .handler(async ({ data, context }) => {
    const payload = {
      lead_id: data.leadId,
      template_id: data.templateId || null,
      title: data.title,
      client_name: data.clientName,
      client_company: data.clientCompany,
      client_email: data.clientEmail,
      scope: data.scope,
      deliverables: data.deliverables,
      pricing: data.pricing,
      currency: data.currency,
      notes: data.notes,
      terms: data.terms,
      valid_until: data.validUntil || null,
      created_by: context.userId,
    };

    if (data.id) {
      const { data: updated, error } = await context.supabase
        .from("crm_proposals")
        .update(payload)
        .eq("id", data.id)
        .select(PROPOSAL_COLUMNS)
        .single();
      if (error) throw new Error(error.message);
      return updated as unknown as Proposal;
    }

    const { count } = await context.supabase
      .from("crm_proposals")
      .select("id", { count: "exact", head: true })
      .eq("lead_id", data.leadId);

    const { data: created, error } = await context.supabase
      .from("crm_proposals")
      .insert({ ...payload, version: (count ?? 0) + 1 })
      .select(PROPOSAL_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return created as unknown as Proposal;
  });

export const sendProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        subject: z.string().trim().min(3).max(200),
        message: z.string().trim().min(10).max(4000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: proposal, error } = await context.supabase
      .from("crm_proposals")
      .select(PROPOSAL_COLUMNS)
      .eq("id", data.id)
      .single();
    if (error || !proposal) throw new Error("Proposal not found.");
    const row = proposal as unknown as Proposal;

    const link = `${SITE_URL}/proposal/${row.share_token}`;
    const { sendGmail } = await import("@/lib/email.server");
    const { buildProposalEmail } = await import("@/lib/crm-emails");
    const sent = await sendGmail(
      row.client_email,
      data.subject,
      buildProposalEmail({
        clientName: row.client_name,
        company: row.client_company,
        title: row.title,
        link,
        message: data.message,
        validUntil: row.valid_until,
      }),
    );
    if (!sent) throw new Error("Email sending failed. Check the Vizogen email connection.");

    await context.supabase
      .from("crm_proposals")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", row.id);

    const { data: member } = await context.supabase
      .from("crm_members")
      .select("full_name, email")
      .eq("user_id", context.userId)
      .maybeSingle();

    await context.supabase.from("crm_activities").insert({
      lead_id: row.lead_id,
      actor_id: context.userId,
      actor_name: member?.full_name || member?.email || "Team",
      type: "proposal_sent",
      body: `Proposal "${row.title}" (v${row.version}) sent to ${row.client_email}.`,
    });

    await context.supabase
      .from("crm_leads")
      .update({ status: "proposal_sent", last_contacted_at: new Date().toISOString() })
      .eq("id", row.lead_id);

    return { ok: true, link };
  });

/** Marks a proposal as sent over WhatsApp and returns its public link. */
export const sendProposalWhatsApp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: proposal, error } = await context.supabase
      .from("crm_proposals")
      .select(PROPOSAL_COLUMNS)
      .eq("id", data.id)
      .single();
    if (error || !proposal) throw new Error("Proposal not found.");
    const row = proposal as unknown as Proposal;
    const link = `${SITE_URL}/proposal/${row.share_token}`;

    await context.supabase
      .from("crm_proposals")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", row.id);

    const { data: member } = await context.supabase
      .from("crm_members")
      .select("full_name, email")
      .eq("user_id", context.userId)
      .maybeSingle();

    await context.supabase.from("crm_activities").insert({
      lead_id: row.lead_id,
      actor_id: context.userId,
      actor_name: member?.full_name || member?.email || "Team",
      type: "proposal_sent",
      body: `Proposal "${row.title}" (v${row.version}) sent on WhatsApp.`,
    });

    await context.supabase
      .from("crm_leads")
      .update({ status: "proposal_sent", last_contacted_at: new Date().toISOString() })
      .eq("id", row.lead_id);

    return { ok: true, link, clientName: row.client_name };
  });

export const setProposalStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["draft", "sent", "viewed", "accepted", "rejected"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: updated, error } = await context.supabase
      .from("crm_proposals")
      .update({
        status: data.status,
        decided_at:
          data.status === "accepted" || data.status === "rejected"
            ? new Date().toISOString()
            : null,
        ...(data.status === "viewed" ? { viewed_at: new Date().toISOString() } : {}),
      })
      .eq("id", data.id)
      .select("lead_id, title")
      .single();
    if (error) throw new Error(error.message);

    await context.supabase.from("crm_activities").insert({
      lead_id: updated.lead_id,
      actor_id: context.userId,
      actor_name: "Team",
      type: "proposal_status",
      body: `Proposal "${updated.title}" marked ${data.status}.`,
    });
    return { ok: true };
  });

/** Public proposal fetch by share token — marks the proposal as viewed. */
export const viewProposal = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().trim().min(10).max(80) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const client = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data: rows } = await client.rpc("crm_view_proposal", { _token: data.token });
    const row = (rows ?? [])[0];
    return row ? { proposal: row } : { proposal: null };
  });
