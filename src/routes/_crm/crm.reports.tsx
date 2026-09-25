import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BadgeIndianRupee, CircleDollarSign, Stethoscope, Target, Users } from "lucide-react";
import { CrmShell } from "@/components/crm/shell";
import { LeadDateFilter } from "@/components/crm/lead-date-filter";
import { getSalesDashboard } from "@/lib/crm.functions";
import { rangeLabel, rangeToIsoFilters } from "@/lib/crm-date-range";

const isDay = (value: unknown) =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";

export const Route = createFileRoute("/_crm/crm/reports")({
  head: () => ({
    meta: [
      { title: "Sales Dashboard — Vizogen CRM" },
      {
        name: "description",
        content: "Date-filtered revenue, lead sources, conversion rate and doctor lead pipeline.",
      },
      { property: "og:title", content: "Sales Dashboard — Vizogen CRM" },
      {
        property: "og:description",
        content: "Revenue, lead acquisition and doctor pipeline performance for the Vizogen team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { from?: string; to?: string } => {
    const from = isDay(search["from"]);
    const to = isDay(search["to"]);
    return { ...(from ? { from } : {}), ...(to ? { to } : {}) };
  },
  component: SalesDashboardPage,
});

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function SalesDashboardPage() {
  const { from = "", to = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/crm/reports" });
  const fetchDashboard = useServerFn(getSalesDashboard);
  const filters = rangeToIsoFilters(from, to);
  const dashboard = useQuery({
    queryKey: ["crm-sales-dashboard", filters],
    queryFn: () => fetchDashboard({ data: filters }),
  });

  const data = dashboard.data;
  const sourceMax = Math.max(1, ...(data?.bySource ?? []).map((source) => source.count));
  const doctorMax = Math.max(1, ...(data?.doctorPipeline ?? []).map((stage) => stage.count));
  const revenueEntries = Object.entries(data?.revenueByCurrency ?? {});
  const revenue = revenueEntries.length
    ? revenueEntries.map(([currency, value]) => formatMoney(value, currency)).join(" + ")
    : "₹0";

  return (
    <CrmShell
      title="Sales dashboard"
      subtitle={`Revenue and lead performance · ${rangeLabel(from, to)}`}
    >
      <LeadDateFilter
        from={from}
        to={to}
        loading={dashboard.isLoading}
        summary={data ? { total: data.total, doctor: data.doctor, bySource: data.bySource } : undefined}
        onChange={(range) =>
          void navigate({
            search: {
              ...(range.from ? { from: range.from } : {}),
              ...(range.to ? { to: range.to } : {}),
            },
          })
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Revenue won", value: revenue, hint: "Accepted proposals", icon: BadgeIndianRupee },
          { label: "Leads", value: data?.total ?? 0, hint: "Created in this range", icon: Users },
          {
            label: "Conversion rate",
            value: `${data?.conversionRate ?? 0}%`,
            hint: `${data?.won ?? 0} closed-won leads`,
            icon: Target,
          },
          {
            label: "Doctor leads",
            value: data?.doctor ?? 0,
            hint: "Across the doctor pipeline",
            icon: Stethoscope,
          },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-2 break-words font-mono text-2xl font-semibold text-foreground">
                  {dashboard.isLoading ? "…" : card.value}
                </p>
              </div>
              <span className="grid size-9 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground">
                <card.icon className="size-4" />
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground font-display">Leads by source</h2>
            <CircleDollarSign className="size-4 text-primary" />
          </div>
          <div className="mt-5 space-y-4">
            {(data?.bySource ?? []).map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{source.label}</span>
                  <span className="font-mono font-semibold text-foreground">{source.count}</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full gradient-brand transition-all"
                    style={{ width: `${Math.max((source.count / sourceMax) * 100, 2)}%` }}
                  />
                </div>
              </div>
            ))}
            {!dashboard.isLoading && !(data?.bySource ?? []).length ? (
              <p className="text-sm text-muted-foreground">No leads in this range.</p>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground font-display">Doctor lead pipeline</h2>
            <Stethoscope className="size-4 text-primary" />
          </div>
          <div className="mt-5 space-y-4">
            {(data?.doctorPipeline ?? []).map((stage) => (
              <div key={stage.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{stage.label}</span>
                  <span className="font-mono font-semibold text-foreground">{stage.count}</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${stage.count ? Math.max((stage.count / doctorMax) * 100, 2) : 0}%` }}
                  />
                </div>
              </div>
            ))}
            {!dashboard.isLoading && !(data?.doctorPipeline ?? []).some((stage) => stage.count) ? (
              <p className="text-sm text-muted-foreground">No doctor leads in this range.</p>
            ) : null}
          </div>
        </section>
      </div>
    </CrmShell>
  );
}