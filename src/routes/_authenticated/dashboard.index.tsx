import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles,
  Star,
  QrCode,
  CalendarClock,
  Loader2,
  ArrowRight,
  PlugZap,
  CheckCircle2,
} from "lucide-react";
import { getWorkspace, getDashboardStats } from "@/lib/workspace.functions";
import { DashboardShell } from "@/components/dashboard/shell";
import { BusinessForm } from "@/components/dashboard/business-form";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const fetchWorkspace = useServerFn(getWorkspace);
  const fetchStats = useServerFn(getDashboardStats);

  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });
  const stats = useQuery({ queryKey: ["dashboard-stats"], queryFn: () => fetchStats() });

  if (workspace.isLoading) {
    return (
      <DashboardShell title="Overview">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  const business = workspace.data?.business ?? null;

  if (!business) {
    return (
      <DashboardShell
        title="Set up your business"
        subtitle="One minute of setup and the AI can write posts and replies that sound like you."
      >
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <BusinessForm business={null} onSaved={() => void workspace.refetch()} submitLabel="Create workspace" />
        </div>
      </DashboardShell>
    );
  }

  const s = stats.data;
  const cards = [
    {
      label: "Posts published",
      value: s?.posts.published ?? 0,
      hint: `${s?.posts.scheduled ?? 0} scheduled · ${s?.posts.drafts ?? 0} drafts`,
      icon: Sparkles,
      to: "/dashboard/posts" as const,
    },
    {
      label: "Average rating",
      value: s?.reviews.averageRating ? s.reviews.averageRating.toFixed(1) : "—",
      hint: `${s?.reviews.awaiting ?? 0} awaiting a reply`,
      icon: Star,
      to: "/dashboard/reviews" as const,
    },
    {
      label: "QR scans",
      value: s?.qr.scans ?? 0,
      hint: `${s?.qr.routedToGoogle ?? 0} sent to Google`,
      icon: QrCode,
      to: "/dashboard/magic-qr" as const,
    },
    {
      label: "Posting cadence",
      value: business.posting_frequency.replace("-", " "),
      hint: `${business.category} · ${business.city}`,
      icon: CalendarClock,
      to: "/dashboard/settings" as const,
    },
  ];

  const connected = Boolean(business.google_location_id);

  return (
    <DashboardShell
      title={business.name}
      subtitle={`${business.category} in ${business.city}`}
      actions={
        <Button asChild className="hidden gradient-brand text-white sm:inline-flex">
          <Link to="/dashboard/posts">
            Generate a post <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      }
    >
      <div
        className={`mb-6 flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
          connected ? "border-border bg-card" : "border-primary/30 bg-primary/5"
        }`}
      >
        <div className="flex items-start gap-3">
          {connected ? (
            <CheckCircle2 className="mt-0.5 size-5 text-primary" />
          ) : (
            <PlugZap className="mt-0.5 size-5 text-primary" />
          )}
          <div>
            <p className="font-semibold text-foreground">
              {connected
                ? `Connected to ${business.google_location_name ?? "your Google location"}`
                : "Connect your Google Business Profile"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {connected
                ? "Posts and review replies go live on Google automatically."
                : "Until it's connected, everything you create is saved and queued — nothing is lost."}
            </p>
          </div>
        </div>
        <Button asChild variant={connected ? "outline" : "default"} className={connected ? "" : "gradient-brand text-white"}>
          <Link to="/dashboard/settings">{connected ? "Manage connection" : "Connect Google"}</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <card.icon className="size-4 text-primary" />
            </div>
            <p className="mt-3 text-3xl font-bold capitalize text-foreground font-display">
              {stats.isLoading ? "…" : card.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Write today's post",
            body: "The AI drafts a Google-ready update using your tone, city and keywords.",
            to: "/dashboard/posts" as const,
            cta: "Open AI Posts",
          },
          {
            title: "Clear your review inbox",
            body: "Pull in the latest Google reviews and send AI-drafted replies in one click.",
            to: "/dashboard/reviews" as const,
            cta: "Open Reviews",
          },
          {
            title: "Print a Magic QR",
            body: "Happy customers go to Google; unhappy ones reach you privately first.",
            to: "/dashboard/magic-qr" as const,
            cta: "Open Magic QR",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="text-base font-semibold text-foreground font-display">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to={item.to}>{item.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
