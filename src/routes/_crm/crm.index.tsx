import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CalendarClock, FileText, Trophy, TrendingUp, Users } from "lucide-react";
import { CrmShell, useCrmSession } from "@/components/crm/shell";
import { getCrmDashboard, listLeads, listStages } from "@/lib/crm.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_crm/crm/")({
  head: () => ({
    meta: [
      { title: "Vizogen CRM Dashboard — pipeline at a glance" },
      {
        name: "description",
        content:
          "Vizogen CRM dashboard with lead volume, pipeline stages, follow-ups due and proposal activity.",
      },
      { property: "og:title", content: "Vizogen CRM Dashboard" },
      { property: "og:description", content: "Pipeline, follow-ups and proposals at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CrmDashboard,
});

function Metric({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground font-display">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function CrmDashboard() {
  const session = useCrmSession();
  const fetchStats = useServerFn(getCrmDashboard);
  const fetchStages = useServerFn(listStages);
  const fetchLeads = useServerFn(listLeads);

  const stats = useQuery({ queryKey: ["crm-dashboard"], queryFn: () => fetchStats() });
  const stages = useQuery({ queryKey: ["crm-stages"], queryFn: () => fetchStages() });
  const dueToday = useQuery({
    queryKey: ["crm-leads", "due-today"],
    queryFn: () => fetchLeads({ data: { due: "today" } }),
  });
  const overdue = useQuery({
    queryKey: ["crm-leads", "overdue"],
    queryFn: () => fetchLeads({ data: { due: "overdue" } }),
  });

  const t = stats.data?.totals;
  const maxStage = Math.max(1, ...Object.values(stats.data?.byStage ?? { a: 1 }));

  return (
    <CrmShell
      title={`Welcome back${session.data?.member?.full_name ? `, ${session.data.member.full_name}` : ""}`}
      subtitle={
        session.data?.canViewAll
          ? "Showing the whole team's pipeline."
          : "Showing the leads assigned to you."
      }
      actions={
        <Button asChild className="hidden gradient-brand text-white sm:inline-flex">
          <Link to="/crm/leads">Open pipeline</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Leads this week" value={t?.week ?? 0} icon={Users} hint={`${t?.month ?? 0} in last 30 days`} />
        <Metric label="Follow-ups due today" value={t?.dueToday ?? 0} icon={CalendarClock} />
        <Metric label="Proposals sent (30d)" value={t?.proposalsMonth ?? 0} icon={FileText} />
        <Metric
          label="Win rate"
          value={`${t?.winRate ?? 0}%`}
          icon={TrendingUp}
          hint={`${t?.won ?? 0} won · avg ${t?.avgDaysToClose ?? 0} days to close`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <h2 className="text-base font-semibold text-foreground font-display">Pipeline funnel</h2>
          <div className="mt-4 space-y-3">
            {(stages.data ?? []).map((stage) => {
              const count = stats.data?.byStage[stage.key] ?? 0;
              return (
                <div key={stage.key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{stage.label}</span>
                    <span className="font-semibold text-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full gradient-brand"
                      style={{ width: `${Math.round((count / maxStage) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground font-display">
              <CalendarClock className="size-4 text-primary" /> Due today
            </h2>
            <FollowUpList leads={dueToday.data ?? []} empty="Nothing due today." />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground font-display">
              <AlertTriangle className="size-4 text-destructive" /> Overdue
            </h2>
            <FollowUpList leads={overdue.data ?? []} empty="No overdue follow-ups. Nice." />
          </div>
        </div>
      </div>

      {session.data?.isAdmin ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground font-display">
            <Trophy className="size-4 text-primary" /> Leaderboard
          </h2>
          <div className="mt-3 divide-y divide-border">
            {(stats.data?.leaderboard ?? []).map((row) => (
              <div key={row.name} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-medium text-foreground">{row.name}</span>
                <span className="text-muted-foreground">
                  {row.won} won · {row.total} leads
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </CrmShell>
  );
}

function FollowUpList({
  leads,
  empty,
}: {
  leads: { id: string; name: string; company: string; follow_up_on: string | null }[];
  empty: string;
}) {
  if (!leads.length) return <p className="mt-3 text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="mt-3 divide-y divide-border">
      {leads.slice(0, 6).map((lead) => (
        <Link
          key={lead.id}
          to="/crm/lead/$id"
          params={{ id: lead.id }}
          className="flex items-center justify-between py-2.5 text-sm hover:text-primary"
        >
          <span className="min-w-0 truncate font-medium">{lead.name}</span>
          <span className="ml-3 shrink-0 text-xs text-muted-foreground">
            {lead.company || lead.follow_up_on}
          </span>
        </Link>
      ))}
    </div>
  );
}
