import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: {
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> };
  userId: string;
}) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (data !== true) throw new Error("Admins only.");
}

export interface AdminPartnerRow {
  id: string;
  application_id: string;
  email: string;
  full_name: string;
  program: string;
  manager_name: string;
  manager_email: string;
  manager_phone: string;
  exclusive_city: string;
  commission_rate: number;
  min_payout: number;
  active: boolean;
  approved_at: string;
  earned: number;
  pending: number;
  clients: number;
  pendingClients: number;
}

export interface AdminPartnerClientRow {
  id: string;
  partner_id: string;
  partner_email: string;
  business_name: string;
  city: string;
  plan: string;
  monthly_value: number;
  started_on: string;
  status: string;
  confirmation: string;
  created_at: string;
}

export interface PartnerAdminOverview {
  partners: AdminPartnerRow[];
  clients: AdminPartnerClientRow[];
  summary: {
    approvedPartners: number;
    clientsOnboarded: number;
    commissionPending: number;
    commissionPaid: number;
  };
}

/** Partner accounts, their clients and commission totals — admin only. */
export const getPartnerAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PartnerAdminOverview> => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [accounts, earnings, clients] = await Promise.all([
      supabaseAdmin
        .from("partner_accounts")
        .select("*")
        .order("approved_at", { ascending: false })
        .limit(300),
      supabaseAdmin.from("partner_earnings").select("partner_id, amount, status").limit(3000),
      supabaseAdmin
        .from("partner_clients")
        .select(
          "id, partner_id, business_name, city, plan, monthly_value, started_on, status, confirmation, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    const num = (v: unknown) => Number(v ?? 0);
    const accRows = (accounts.data ?? []) as unknown as AdminPartnerRow[];
    const earnRows = (earnings.data ?? []) as unknown as {
      partner_id: string;
      amount: number;
      status: string;
    }[];
    const clientRows = (clients.data ?? []) as unknown as AdminPartnerClientRow[];
    const emailById = new Map(accRows.map((a) => [a.id, a.email]));

    const partners = accRows.map((a) => {
      const mine = earnRows.filter((e) => e.partner_id === a.id);
      const myClients = clientRows.filter((c) => c.partner_id === a.id);
      return {
        ...a,
        commission_rate: num(a.commission_rate),
        min_payout: num(a.min_payout),
        earned: mine.reduce((s, e) => s + num(e.amount), 0),
        pending: mine.filter((e) => e.status !== "paid").reduce((s, e) => s + num(e.amount), 0),
        clients: myClients.length,
        pendingClients: myClients.filter((c) => c.confirmation === "pending").length,
      };
    });

    return {
      partners,
      clients: clientRows.map((c) => ({
        ...c,
        monthly_value: num(c.monthly_value),
        partner_email: emailById.get(c.partner_id) ?? "",
      })),
      summary: {
        approvedPartners: accRows.filter((a) => a.active).length,
        clientsOnboarded: clientRows.filter((c) => c.confirmation === "confirmed").length,
        commissionPending: earnRows
          .filter((e) => e.status !== "paid")
          .reduce((s, e) => s + num(e.amount), 0),
        commissionPaid: earnRows
          .filter((e) => e.status === "paid")
          .reduce((s, e) => s + num(e.amount), 0),
      },
    };
  });

export const updatePartnerAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        managerName: z.string().trim().max(120).optional(),
        managerEmail: z.string().trim().max(200).optional(),
        managerPhone: z.string().trim().max(30).optional(),
        exclusiveCity: z.string().trim().max(80).optional(),
        commissionRate: z.number().min(0).max(100).optional(),
        active: z.boolean().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = {};
    if (data.managerName !== undefined) patch["manager_name"] = data.managerName;
    if (data.managerEmail !== undefined) patch["manager_email"] = data.managerEmail;
    if (data.managerPhone !== undefined) patch["manager_phone"] = data.managerPhone;
    if (data.exclusiveCity !== undefined) patch["exclusive_city"] = data.exclusiveCity;
    if (data.commissionRate !== undefined) patch["commission_rate"] = data.commissionRate;
    if (data.active !== undefined) patch["active"] = data.active;
    if (Object.keys(patch).length === 0) return { ok: true };

    const { error } = await supabaseAdmin
      .from("partner_accounts")
      .update(patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const addPartnerEarning = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        partnerId: z.string().uuid(),
        description: z.string().trim().max(200).optional().default(""),
        amount: z.number().min(0).max(10000000),
        periodMonth: z.string().trim().min(7).max(10),
        status: z.enum(["pending", "approved", "paid"]).default("pending"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const month = data.periodMonth.length === 7 ? `${data.periodMonth}-01` : data.periodMonth;
    const { error } = await supabaseAdmin.from("partner_earnings").insert({
      partner_id: data.partnerId,
      description: data.description,
      amount: data.amount,
      period_month: month,
      status: data.status,
      paid_at: data.status === "paid" ? new Date().toISOString() : null,
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updatePartnerClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        confirmation: z.enum(["pending", "confirmed", "rejected"]).optional(),
        status: z.enum(["trial", "active", "churned"]).optional(),
        adminNote: z.string().trim().max(500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = {};
    if (data.confirmation) patch["confirmation"] = data.confirmation;
    if (data.status) patch["status"] = data.status;
    if (data.adminNote !== undefined) patch["admin_note"] = data.adminNote;
    if (Object.keys(patch).length === 0) return { ok: true };
    const { error } = await supabaseAdmin
      .from("partner_clients")
      .update(patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
