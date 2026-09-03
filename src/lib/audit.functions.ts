import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface AuditSection {
  name: string;
  score: number;
  status: "good" | "warning" | "critical";
  findings: string[];
  fixes: string[];
}

export interface AuditPlanStep {
  week: string;
  focus: string;
  tasks: string[];
}

export interface AuditRow {
  id: string;
  business_name: string;
  city: string;
  category: string;
  website: string | null;
  score: number;
  grade: string;
  summary: string;
  sections: AuditSection[];
  quick_wins: string[];
  action_plan: AuditPlanStep[];
  keywords: string[];
  created_at: string;
}

const AUDIT_COLUMNS =
  "id, business_name, city, category, website, score, grade, summary, sections, quick_wins, action_plan, keywords, created_at";

export const listAudits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("gbp_audits")
      .select(AUDIT_COLUMNS)
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(25);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as AuditRow[];
  });

export const deleteAudit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("gbp_audits")
      .delete()
      .eq("id", data.id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const runSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(80),
  category: z.string().trim().min(2).max(80),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  keywords: z.array(z.string().trim().min(1).max(60)).max(12).default([]),
  notes: z.string().trim().max(600).optional().or(z.literal("")),
});

interface AiAudit {
  score: number;
  grade: string;
  summary: string;
  sections: AuditSection[];
  quickWins: string[];
  actionPlan: AuditPlanStep[];
}

const SECTIONS = [
  "Profile completeness",
  "Categories & services",
  "Reviews & reputation",
  "Posts & activity",
  "Photos & media",
  "Local keyword relevance",
  "Citations & NAP consistency",
];

export const runAudit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => runSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { chat, extractJson } = await import("@/lib/ai.server");

    const prompt = `You are a senior Google Business Profile (GMB) and local SEO auditor in India.
Audit this business and return STRICT JSON only.

Business name: ${data.businessName}
City: ${data.city}
Category: ${data.category}
Website: ${data.website || "none provided"}
Target keywords: ${data.keywords.join(", ") || "none provided"}
Extra context: ${data.notes || "none"}

Judge realistically for a typical business of this type and city, and be specific to the category and city (mention local competitors' common behaviour, local search intent, and seasonality where relevant).

JSON shape:
{
  "score": 0-100 overall,
  "grade": "A"|"B"|"C"|"D",
  "summary": "2-3 sentence executive summary",
  "sections": [ { "name": one of ${JSON.stringify(SECTIONS)}, "score": 0-100, "status": "good"|"warning"|"critical", "findings": ["3 specific observations"], "fixes": ["2-3 concrete actions"] } ],
  "quickWins": ["5 actions that take under 30 minutes each"],
  "actionPlan": [ { "week": "Week 1", "focus": "short title", "tasks": ["3 tasks"] } ]
}
Include all ${SECTIONS.length} sections in order. Return JSON only, no prose.`;

    const raw = await chat(
      [
        { role: "system", content: "You return only valid JSON. No markdown fences, no commentary." },
        { role: "user", content: prompt },
      ],
      { maxTokens: 2600 },
    );

    const parsed = extractJson<AiAudit>(raw);
    if (!parsed || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
      throw new Error("The audit could not be generated. Please try again.");
    }

    const clamp = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
    const sections: AuditSection[] = parsed.sections.slice(0, 10).map((s) => ({
      name: String(s.name ?? "Section"),
      score: clamp(s.score),
      status: s.status === "good" || s.status === "critical" ? s.status : "warning",
      findings: (s.findings ?? []).slice(0, 6).map(String),
      fixes: (s.fixes ?? []).slice(0, 6).map(String),
    }));

    const score = parsed.score
      ? clamp(parsed.score)
      : Math.round(sections.reduce((sum, s) => sum + s.score, 0) / sections.length);
    const grade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : "D";

    const { data: business } = await context.supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", context.userId)
      .limit(1)
      .maybeSingle();

    const { data: row, error } = await context.supabase
      .from("gbp_audits")
      .insert({
        owner_id: context.userId,
        business_id: business?.id ?? null,
        business_name: data.businessName,
        city: data.city,
        category: data.category,
        website: data.website || null,
        score,
        grade,
        summary: String(parsed.summary ?? ""),
        sections: sections as unknown as never,
        quick_wins: ((parsed.quickWins ?? []).slice(0, 8).map(String)) as unknown as never,
        action_plan: ((parsed.actionPlan ?? []).slice(0, 6)) as unknown as never,
        keywords: data.keywords,
      })
      .select(AUDIT_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return row as unknown as AuditRow;
  });
