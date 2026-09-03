import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface AgentSettingsRow {
  agent_enabled: boolean;
  auto_reply_enabled: boolean;
  auto_reply_min_rating: number;
  auto_reply_send: boolean;
  auto_post_enabled: boolean;
}

export interface AgentRunRow {
  id: string;
  trigger: string;
  status: string;
  summary: string;
  details: {
    reviewsSynced?: number;
    repliesDrafted?: number;
    repliesSent?: number;
    postsScheduled?: number;
    profileTips?: string[];
    notes?: string[];
  };
  created_at: string;
}

const SETTINGS_COLUMNS =
  "agent_enabled, auto_reply_enabled, auto_reply_min_rating, auto_reply_send, auto_post_enabled";

export const getAgentSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("businesses")
      .select(SETTINGS_COLUMNS)
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    return (data as AgentSettingsRow | null) ?? null;
  });

export const saveAgentSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        agent_enabled: z.boolean(),
        auto_reply_enabled: z.boolean(),
        auto_reply_min_rating: z.number().int().min(1).max(5),
        auto_reply_send: z.boolean(),
        auto_post_enabled: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("businesses")
      .update(data)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return data;
  });

export const listAgentRuns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("agent_runs")
      .select("id, trigger, status, summary, details, created_at")
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as AgentRunRow[];
  });

export const runAgentNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { runAgentForOwner } = await import("./agent.server");
    return runAgentForOwner(supabaseAdmin as never, context.userId, "manual");
  });
