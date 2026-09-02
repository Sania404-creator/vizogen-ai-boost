import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, Clock, Percent, TrendingUp } from "lucide-react";
import { CrmShell } from "@/components/crm/shell";
import { getCrmDashboard, listStages } from "@/lib/crm.functions";

export const Route = createFileRoute("/_crm/crm/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Vizogen CRM" },
      {
        name: "description",
        content:
          "Conversion rate, average days to close, pipeline by stage, lead sources and rep performance.",
      },
      { property: "og:title", content: "Reports — Vizogen CRM" },
      { property: "og:description", content: "Sales performance analytics for the Vizogen team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReportsPage,
});

const SOURCE_LABEL: Record<string, string> = {
  website_demo: "Website demo form",
  website_popup: "Website popup",
  manual: "Added manually",
  referral: "Referral",
  other: "Other",
};

function ReportsPage() {
  const fetchDashboard = useServerFn(getCrmDashboard);
  const fetchStages = useServerFn(listStages);
  const data = useQuery({ queryKey: ["crm-dashboard"], queryFn: () => fetchDashboard() });
  const stages = useQuery({ queryKey: ["crm-stages"], queryFn: () => fetchStages() });

  const totals = data.data?.totals;
  const byStage = data.data?.byStage ?? {};
  const bySource = data.data?.bySource ?? {};
  const maxStage = Math.max(1, ...Object.values(byStage));
  const sourceTotal = Math.max(1, Object.values(bySource).reduce((a, b) => a + b, 0));

  const cards = [
    { label: "Conversion rate", value: `${totals?.winRate ?? 0}%`, icon: Percent },
    { label: "Deals won", value: totals?.won ?? 0, icon: Award },
    { label: "Avg days to close", value: totals?.avgDaysToClose ?? 0, icon: Clock },
    { label: "New leads (30d)", value: totals?.month ?? 0, icon: TrendingUp },
  ];

  return (
    <CrmShell title="Reports" subtitle="How the pipeline and the team are performing">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <span className="grid size-9 place-items-center rounded-xl gradient-brand text-white">
              <c.icon className="size-4" />
            </span>
            <p className="mt-3 text-2xl font-bold text-foreground font-display">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-base font-semibold text-foreground font-display">Leads by stage</h2>
          <div className="mt-4 space-y-3">
            {(stages.data ?? []).map((s) => {
              const count = byStage[s.key] ?? 0;
              return (
                <div key={s.key}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold text-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full gradient-brand"
                      style={{ width: `${(count / maxStage) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-base font-semibold text-foreground font-display">Lead sources</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(bySource).map(([key, count]) => (
              <div key={key}>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{SOURCE_LABEL[key] ?? key}</span>
                  <span className="font-semibold text-foreground">
                    {count} · {Math.round((count / sourceTotal) * 100)}%
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(count / sourceTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {Object.keys(bySource).length === 0 ? (
              <p className="text-sm text-muted-foreground">No leads recorded yet.</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h2 className="text-base font-semibold text-foreground font-display">Rep performance</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="pb-2">Rep</th>
                <th className="pb-2">Leads</th>
                <th className="pb-2">Won</th>
                <th className="pb-2">Win rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(data.data?.leaderboard ?? []).map((r) => (
                <tr key={r.name}>
                  <td className="py-2.5 font-medium text-foreground">{r.name}</td>
                  <td className="py-2.5 text-muted-foreground">{r.total}</td>
                  <td className="py-2.5 text-muted-foreground">{r.won}</td>
                  <td className="py-2.5 text-muted-foreground">
                    {r.total ? Math.round((r.won / r.total) * 100) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CrmShell>
  );
}
