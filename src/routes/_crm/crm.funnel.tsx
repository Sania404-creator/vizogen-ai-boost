import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Filter, Target, Timer, TrendingDown, Wallet } from "lucide-react";
import { CrmShell } from "@/components/crm/shell";
import { Button } from "@/components/ui/button";
import { getSalesFunnel } from "@/lib/crm.functions";

export const Route = createFileRoute("/_crm/crm/funnel")({
  head: () => ({
    meta: [
      { title: "Sales funnel — Vizogen CRM" },
      {
        name: "description",
        content:
          "Track how many Meta Ads and website leads convert into demos, proposals and closed deals, stage by stage.",
      },
      { property: "og:title", content: "Sales funnel — Vizogen CRM" },
      {
        property: "og:description",
        content: "Lead-to-demo-to-proposal conversion analytics for the Vizogen sales team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FunnelPage,
});

const SOURCE_LABEL: Record<string, string> = {
  meta_ads: "Meta Ads",
  website_demo: "Website demo form",
  website_popup: "Website popup",
  manual: "Added manually",
  referral: "Referral",
  other: "Other",
};

const RANGES = [
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "12 months", days: 365 },
  { label: "All time", days: 0 },
];

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

function FunnelPage() {
  const [days, setDays] = useState(90);
  const fetchFunnel = useServerFn(getSalesFunnel);
  const funnel = useQuery({
    queryKey: ["crm-funnel", days],
    queryFn: () => fetchFunnel({ data: { days } }),
  });

  const overall = funnel.data?.overall ?? [];
  const top = overall[0]?.count ?? 0;
  const demo = overall.find((s) => s.key === "demo")?.count ?? 0;
  const proposal = overall.find((s) => s.key === "proposal")?.count ?? 0;
  const won = overall.find((s) => s.key === "won")?.count ?? 0;
  const metaFunnel = funnel.data?.bySource.find((s) => s.source === "meta_ads");

  return (
    <CrmShell
      title="Sales funnel"
      subtitle="Where leads convert — and where they leak — from first touch to closed deal"
      actions={
        <div className="hidden items-center gap-1 rounded-xl border border-border bg-card p-1 md:flex">
          {RANGES.map((r) => (
            <Button
              key={r.days}
              size="sm"
              variant="ghost"
              onClick={() => setDays(r.days)}
              className={
                days === r.days ? "gradient-brand text-white hover:text-white" : "text-muted-foreground"
              }
            >
              {r.label}
            </Button>
          ))}
        </div>
      }
    >
      <div className="mb-6 flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 md:hidden">
        <Filter className="mx-2 size-4 shrink-0 text-muted-foreground" />
        {RANGES.map((r) => (
          <Button
            key={r.days}
            size="sm"
            variant="ghost"
            onClick={() => setDays(r.days)}
            className={
              days === r.days ? "gradient-brand text-white hover:text-white" : "text-muted-foreground"
            }
          >
            {r.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Lead → demo",
            value: `${pct(demo, top)}%`,
            hint: `${demo} demos from ${top} leads`,
            icon: Target,
          },
          {
            label: "Demo → proposal",
            value: `${pct(proposal, demo)}%`,
            hint: `${proposal} proposals sent`,
            icon: TrendingDown,
          },
          {
            label: "Proposal → won",
            value: `${pct(won, proposal)}%`,
            hint: `${won} deals closed`,
            icon: Wallet,
          },
          {
            label: "Avg days to win",
            value: String(funnel.data?.avgDaysToWin ?? 0),
            hint: `${funnel.data?.lost ?? 0} leads lost in range`,
            icon: Timer,
          },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <span className="grid size-8 place-items-center rounded-xl gradient-brand text-white">
                <c.icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-foreground font-display">
              {c.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-base font-semibold text-foreground font-display">
            Full funnel — all sources
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Each bar is the share of captured leads that reached that stage.
          </p>
          <div className="mt-5 space-y-4">
            {overall.map((s, i) => {
              const prev = i === 0 ? s.count : (overall[i - 1]?.count ?? s.count);
              return (
                <div key={s.key}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-foreground">{s.label}</span>
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{s.count}</span> ·{" "}
                      {pct(s.count, top)}% of leads
                      {i > 0 ? <> · {pct(s.count, prev)}% step</> : null}
                    </span>
                  </div>
                  <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full gradient-brand transition-all"
                      style={{ width: `${Math.max(pct(s.count, top), s.count ? 2 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {overall.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leads in this range yet.</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-base font-semibold text-foreground font-display">
            Meta Ads performance
          </h2>
          {metaFunnel ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                {metaFunnel.steps[0]?.count ?? 0} Meta Ads leads captured in this range.
              </p>
              <div className="mt-5 space-y-3">
                {metaFunnel.steps.map((s, i) => (
                  <div key={s.key} className="flex items-center gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-xs font-bold text-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="truncate text-muted-foreground">{s.label}</span>
                        <span className="font-semibold text-foreground">{s.count}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.max(pct(s.count, metaFunnel.steps[0]?.count ?? 0), s.count ? 2 : 0)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                Meta lead → demo is{" "}
                <span className="font-semibold text-foreground">
                  {pct(metaFunnel.steps[2]?.count ?? 0, metaFunnel.steps[0]?.count ?? 0)}%
                </span>
                . Anything under 25% usually means follow-up speed, not ad quality — work the New
                column within an hour of the lead landing.
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No Meta Ads leads in this range yet. New ad leads sync automatically every hour.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h2 className="text-base font-semibold text-foreground font-display">
          Conversion by source
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="pb-2">Source</th>
                <th className="pb-2">Leads</th>
                <th className="pb-2">Demos</th>
                <th className="pb-2">Lead → demo</th>
                <th className="pb-2">Proposals</th>
                <th className="pb-2">Viewed</th>
                <th className="pb-2">Won</th>
                <th className="pb-2">Lead → won</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(funnel.data?.bySource ?? []).map((row) => {
                const get = (k: string) => row.steps.find((s) => s.key === k)?.count ?? 0;
                const leads = get("leads");
                return (
                  <tr key={row.source}>
                    <td className="py-2.5 font-medium text-foreground">
                      {SOURCE_LABEL[row.source] ?? row.source}
                    </td>
                    <td className="py-2.5 text-muted-foreground">{leads}</td>
                    <td className="py-2.5 text-muted-foreground">{get("demo")}</td>
                    <td className="py-2.5 font-semibold text-foreground">
                      {pct(get("demo"), leads)}%
                    </td>
                    <td className="py-2.5 text-muted-foreground">{get("proposal")}</td>
                    <td className="py-2.5 text-muted-foreground">{get("viewed")}</td>
                    <td className="py-2.5 text-muted-foreground">{get("won")}</td>
                    <td className="py-2.5 font-semibold text-foreground">
                      {pct(get("won"), leads)}%
                    </td>
                  </tr>
                );
              })}
              {(funnel.data?.bySource ?? []).length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-muted-foreground">
                    No data for this range.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </CrmShell>
  );
}
