import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const LEAD_SOURCES = [
  "website_demo",
  "website_popup",
  "manual",
  "referral",
  "other",
] as const;

export const LOST_REASONS = [
  "Price",
  "No Response",
  "Chose Competitor",
  "Not a Fit",
  "Timing",
  "Other",
] as const;

export interface CrmMember {
  user_id: string;
  full_name: string;
  email: string;
  can_view_all: boolean;
  active: boolean;
  role: "admin" | "sales_rep";
}

export interface Stage {
  key: string;
  label: string;
  position: number;
  kind: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string | null;
  source: string;
  status: string;
  assigned_to: string | null;
  requested_demo_at: string | null;
  requested_demo_label: string | null;
  message: string | null;
  source_page: string | null;
  follow_up_on: string | null;
  tags: string[];
  lost_reason: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  lead_id: string;
  actor_name: string;
  type: string;
  body: string;
  created_at: string;
}

const LEAD_COLUMNS =
  "id, name, email, phone, company, job_title, source, status, assigned_to, requested_demo_at, requested_demo_label, message, source_page, follow_up_on, tags, lost_reason, last_contacted_at, created_at, updated_at";

/** Signed-in CRM identity. The very first signed-in user claims the Admin seat. */
export const getCrmSession = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;
    const email = (claims as { email?: string }).email ?? "";

    let { data: member } = await supabase
      .from("crm_members")
      .select("user_id, full_name, email, can_view_all, active")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    let isAdmin = (roleRows ?? []).some((r) => r.role === "admin");

    if (!member) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { count } = await supabaseAdmin
        .from("crm_members")
        .select("user_id", { count: "exact", head: true });
      if (!count) {
        await supabaseAdmin.from("crm_members").insert({
          user_id: userId,
          email,
          full_name: email.split("@")[0] ?? "Admin",
          can_view_all: true,
          active: true,
        });
        await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" });
        isAdmin = true;
        member = {
          user_id: userId,
          email,
          full_name: email.split("@")[0] ?? "Admin",
          can_view_all: true,
          active: true,
        };
      }
    }

    if (!member || !member.active) {
      return { member: null, isAdmin: false, canViewAll: false, email };
    }

    return {
      member: { ...member, role: isAdmin ? "admin" : "sales_rep" } as CrmMember,
      isAdmin,
      canViewAll: isAdmin || member.can_view_all,
      email,
    };
  });

export const listStages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("crm_stages")
      .select("key, label, position, kind")
      .order("position", { ascending: true });
    return (data ?? []) as Stage[];
  });

export const listTeam = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: members }, { data: roles }] = await Promise.all([
      context.supabase
        .from("crm_members")
        .select("user_id, full_name, email, can_view_all, active")
        .order("created_at", { ascending: true }),
      context.supabase.from("user_roles").select("user_id, role"),
    ]);
    const adminIds = new Set(
      (roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id),
    );
    return (members ?? []).map((m) => ({
      ...m,
      role: adminIds.has(m.user_id) ? "admin" : "sales_rep",
    })) as CrmMember[];
  });

const filterSchema = z.object({
  status: z.string().trim().max(40).optional(),
  assignedTo: z.string().max(60).optional(),
  source: z.string().trim().max(40).optional(),
  tag: z.string().trim().max(40).optional(),
  search: z.string().trim().max(120).optional(),
  due: z.enum(["today", "overdue", "week"]).optional(),
  createdFrom: z.string().max(30).optional(),
  createdTo: z.string().max(30).optional(),
});

export const listLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => filterSchema.parse(input ?? {}))
  .handler(async ({ data, context }) => {
    let query = context.supabase
      .from("crm_leads")
      .select(LEAD_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(500);

    if (data.status) query = query.eq("status", data.status);
    if (data.source) query = query.eq("source", data.source);
    if (data.assignedTo === "unassigned") query = query.is("assigned_to", null);
    else if (data.assignedTo) query = query.eq("assigned_to", data.assignedTo);
    if (data.tag) query = query.contains("tags", [data.tag]);
    if (data.createdFrom) query = query.gte("created_at", data.createdFrom);
    if (data.createdTo) query = query.lte("created_at", data.createdTo);
    if (data.search) {
      const term = `%${data.search}%`;
      query = query.or(
        `name.ilike.${term},email.ilike.${term},company.ilike.${term},phone.ilike.${term}`,
      );
    }
    const today = new Date().toISOString().slice(0, 10);
    if (data.due === "today") query = query.eq("follow_up_on", today);
    if (data.due === "overdue") query = query.lt("follow_up_on", today);
    if (data.due === "week") {
      const week = new Date(Date.now() + 6 * 864e5).toISOString().slice(0, 10);
      query = query.gte("follow_up_on", today).lte("follow_up_on", week);
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return (rows ?? []) as Lead[];
  });

export const getLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const [{ data: lead }, { data: activities }, { data: proposals }] = await Promise.all([
      context.supabase.from("crm_leads").select(LEAD_COLUMNS).eq("id", data.id).maybeSingle(),
      context.supabase
        .from("crm_activities")
        .select("id, lead_id, actor_name, type, body, created_at")
        .eq("lead_id", data.id)
        .order("created_at", { ascending: false })
        .limit(200),
      context.supabase
        .from("crm_proposals")
        .select("id, title, status, version, share_token, valid_until, sent_at, viewed_at, created_at")
        .eq("lead_id", data.id)
        .order("created_at", { ascending: false }),
    ]);
    if (!lead) throw new Error("Lead not found or not assigned to you.");
    return {
      lead: lead as Lead,
      activities: (activities ?? []) as Activity[],
      proposals: proposals ?? [],
    };
  });

async function actorName(
  supabase: { from: (t: "crm_members") => any },
  userId: string,
  fallback: string,
) {
  const { data } = await supabase
    .from("crm_members")
    .select("full_name, email")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.full_name || data?.email || fallback;
}

async function log(
  context: { supabase: any; userId: string; claims: unknown },
  leadId: string,
  type: string,
  body: string,
) {
  const email = (context.claims as { email?: string }).email ?? "Team";
  const name = await actorName(context.supabase, context.userId, email);
  await context.supabase.from("crm_activities").insert({
    lead_id: leadId,
    actor_id: context.userId,
    actor_name: name,
    type,
    body,
  });
}

const leadInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  jobTitle: z.string().trim().max(120).optional().or(z.literal("")),
  source: z.enum(LEAD_SOURCES).default("manual"),
  status: z.string().trim().max(40).default("new"),
  assignedTo: z.string().uuid().optional().or(z.literal("")),
  followUpOn: z.string().max(20).optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const createLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => leadInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: created, error } = await context.supabase
      .from("crm_leads")
      .insert({
        name: data.name,
        email: data.email || "",
        phone: data.phone || "",
        company: data.company || "",
        job_title: data.jobTitle || null,
        source: data.source,
        status: data.status,
        assigned_to: data.assignedTo || context.userId,
        follow_up_on: data.followUpOn || null,
        tags: data.tags,
        message: data.message || null,
        created_by: context.userId,
      })
      .select(LEAD_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    const lead = created as Lead;
    await log(context, lead.id, "created", `Lead created (${data.source.replace("_", " ")}).`);
    return lead;
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(30).optional(),
  company: z.string().trim().max(160).optional(),
  jobTitle: z.string().trim().max(120).optional(),
  status: z.string().trim().max(40).optional(),
  lostReason: z.string().trim().max(60).optional(),
  assignedTo: z.string().max(60).optional(),
  followUpOn: z.string().max(20).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).optional(),
  markContacted: z.boolean().optional(),
});

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: before } = await context.supabase
      .from("crm_leads")
      .select("status, assigned_to")
      .eq("id", data.id)
      .maybeSingle();
    if (!before) throw new Error("Lead not found.");

    const payload: Record<string, string | string[] | null> = {};
    if (data.name !== undefined) payload["name"] = data.name;
    if (data.email !== undefined) payload["email"] = data.email;
    if (data.phone !== undefined) payload["phone"] = data.phone;
    if (data.company !== undefined) payload["company"] = data.company;
    if (data.jobTitle !== undefined) payload["job_title"] = data.jobTitle || null;
    if (data.status !== undefined) payload["status"] = data.status;
    if (data.lostReason !== undefined) payload["lost_reason"] = data.lostReason || null;
    if (data.assignedTo !== undefined) payload["assigned_to"] = data.assignedTo || null;
    if (data.followUpOn !== undefined) payload["follow_up_on"] = data.followUpOn || null;
    if (data.tags !== undefined) payload["tags"] = data.tags;
    if (data.markContacted) payload["last_contacted_at"] = new Date().toISOString();
    if (data.status === "lost" && !data.lostReason) {
      throw new Error("Pick a reason before marking a lead as lost.");
    }

    const { data: updated, error } = await context.supabase
      .from("crm_leads")
      .update(payload as never)
      .eq("id", data.id)
      .select(LEAD_COLUMNS)
      .single();
    if (error) throw new Error(error.message);

    if (data.status && data.status !== before.status) {
      await log(
        context,
        data.id,
        "status_change",
        `Stage moved from ${before.status} to ${data.status}${
          data.lostReason ? ` (${data.lostReason})` : ""
        }.`,
      );
    }
    if (data.markContacted) await log(context, data.id, "contacted", "Marked as contacted.");
    if (data.followUpOn) {
      await log(context, data.id, "follow_up", `Follow-up scheduled for ${data.followUpOn}.`);
    }
    if (data.assignedTo && data.assignedTo !== before.assigned_to) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("crm_notifications").insert({
        user_id: data.assignedTo,
        type: "lead_assigned",
        title: "New lead assigned to you",
        body: (updated as Lead).name,
        lead_id: data.id,
      });
      await log(context, data.id, "assigned", "Lead reassigned.");
    }
    return updated as Lead;
  });

export const addActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        leadId: z.string().uuid(),
        type: z.enum(["note", "call", "email", "meeting"]),
        body: z.string().trim().min(1).max(3000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await log(context, data.leadId, data.type, data.body);
    if (data.type === "call" || data.type === "email") {
      await context.supabase
        .from("crm_leads")
        .update({ last_contacted_at: new Date().toISOString() })
        .eq("id", data.leadId);
    }
    return { ok: true };
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("crm_leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------------------------- team --------------------------------- */

const inviteSchema = z.object({
  email: z.string().trim().email().max(200),
  fullName: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(72),
  role: z.enum(["admin", "sales_rep"]),
  canViewAll: z.boolean().default(false),
});

export const inviteMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inviteSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Only Admins can add team members.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    if (error || !created.user) throw new Error(error?.message ?? "Could not create the account.");

    await supabaseAdmin.from("crm_members").upsert(
      {
        user_id: created.user.id,
        email: data.email,
        full_name: data.fullName,
        can_view_all: data.canViewAll,
        active: true,
      },
      { onConflict: "user_id" },
    );
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: created.user.id, role: data.role }, { onConflict: "user_id,role" });

    const { sendGmail } = await import("@/lib/email.server");
    const { buildCrmInviteEmail } = await import("@/lib/crm-emails");
    await sendGmail(
      data.email,
      "Your Vizogen CRM account is ready",
      buildCrmInviteEmail({ fullName: data.fullName, email: data.email, password: data.password }),
    );

    return { ok: true };
  });

export const updateMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["admin", "sales_rep"]).optional(),
        canViewAll: z.boolean().optional(),
        active: z.boolean().optional(),
        fullName: z.string().trim().min(2).max(120).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Only Admins can manage the team.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload: Record<string, string | boolean> = {};
    if (data.canViewAll !== undefined) payload["can_view_all"] = data.canViewAll;
    if (data.active !== undefined) payload["active"] = data.active;
    if (data.fullName !== undefined) payload["full_name"] = data.fullName;
    if (Object.keys(payload).length) {
      await supabaseAdmin
        .from("crm_members")
        .update(payload as never)
        .eq("user_id", data.userId);
    }
    if (data.role) {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
      await supabaseAdmin.from("user_roles").insert({ user_id: data.userId, role: data.role });
    }
    return { ok: true };
  });

/* ------------------------------- dashboard ------------------------------- */

export const getCrmDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: leads } = await context.supabase
      .from("crm_leads")
      .select("id, status, source, assigned_to, follow_up_on, created_at, updated_at");
    const { data: proposals } = await context.supabase
      .from("crm_proposals")
      .select("id, status, sent_at, created_at");
    const { data: members } = await context.supabase
      .from("crm_members")
      .select("user_id, full_name, email");

    const rows = leads ?? [];
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
    const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString();

    const byStage: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    for (const r of rows) {
      byStage[r.status] = (byStage[r.status] ?? 0) + 1;
      bySource[r.source] = (bySource[r.source] ?? 0) + 1;
    }

    const won = rows.filter((r) => r.status === "won");
    const closed = rows.filter((r) => r.status === "won" || r.status === "lost");
    const leaderboard = (members ?? [])
      .map((m) => ({
        name: m.full_name || m.email,
        won: won.filter((r) => r.assigned_to === m.user_id).length,
        total: rows.filter((r) => r.assigned_to === m.user_id).length,
      }))
      .sort((a, b) => b.won - a.won);

    const avgDaysToClose = won.length
      ? Math.round(
          (won.reduce(
            (sum, r) => sum + (new Date(r.updated_at).getTime() - new Date(r.created_at).getTime()),
            0,
          ) /
            won.length /
            864e5) *
            10,
        ) / 10
      : 0;

    return {
      totals: {
        all: rows.length,
        week: rows.filter((r) => r.created_at >= weekAgo).length,
        month: rows.filter((r) => r.created_at >= monthAgo).length,
        won: won.length,
        dueToday: rows.filter((r) => r.follow_up_on === today).length,
        overdue: rows.filter((r) => r.follow_up_on && r.follow_up_on < today).length,
        proposalsMonth: (proposals ?? []).filter((p) => (p.sent_at ?? "") >= monthAgo).length,
        winRate: closed.length ? Math.round((won.length / closed.length) * 100) : 0,
        avgDaysToClose,
      },
      byStage,
      bySource,
      leaderboard,
    };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("crm_notifications")
      .select("id, type, title, body, lead_id, read_at, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(30);
    return data ?? [];
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase
      .from("crm_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", context.userId)
      .is("read_at", null);
    return { ok: true };
  });
