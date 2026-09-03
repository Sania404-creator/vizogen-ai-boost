import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ShieldCheck, Users, KanbanSquare, FileText, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { CrmShell, useCrmSession } from "@/components/crm/shell";
import {
  adminAssignLeads,
  getAdminOverview,
  listTeam,
  updateMember,
} from "@/lib/crm.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_crm/crm/admin")({
  head: () => ({
    meta: [
      { title: "Admin panel — Vizogen CRM" },
      {
        name: "description",
        content: "Admin control centre for the Vizogen CRM: team, roles, lead routing and health.",
      },
      { property: "og:title", content: "Admin panel — Vizogen CRM" },
      { property: "og:description", content: "Manage CRM roles, lead routing and pipeline health." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const SOURCE_LABEL: Record<string, string> = {
  website_demo: "Website demo",
  website_popup: "Website popup",
  meta_ads: "Meta Ads",
  manual: "Manual",
  referral: "Referral",
  other: "Other",
};

function AdminPage() {
  const queryClient = useQueryClient();
  const session = useCrmSession();
  const isAdmin = session.data?.isAdmin ?? false;

  const fetchOverview = useServerFn(getAdminOverview);
  const fetchTeam = useServerFn(listTeam);
  const patch = useServerFn(updateMember);
  const assign = useServerFn(adminAssignLeads);

  const overview = useQuery({
    queryKey: ["crm-admin-overview"],
    queryFn: () => fetchOverview(),
    enabled: isAdmin,
  });
  const team = useQuery({ queryKey: ["crm-team"], queryFn: () => fetchTeam(), enabled: isAdmin });

  const [selected, setSelected] = useState<string[]>([]);
  const [assignee, setAssignee] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["crm-admin-overview"] });
    void queryClient.invalidateQueries({ queryKey: ["crm-team"] });
    void queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
  };

  const update = async (input: {
    userId: string;
    role?: "admin" | "sales_rep";
    canViewAll?: boolean;
    active?: boolean;
  }) => {
    try {
      await patch({ data: input });
      refresh();
      toast.success("Member updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    }
  };

  const runAssign = async () => {
    if (!assignee || selected.length === 0) return;
    setBusy(true);
    try {
      const res = await assign({ data: { leadIds: selected, userId: assignee } });
      toast.success(`${res.count} lead${res.count === 1 ? "" : "s"} assigned.`);
      setSelected([]);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not assign leads.");
    } finally {
      setBusy(false);
    }
  };

  if (session.isSuccess && !isAdmin) {
    return (
      <CrmShell title="Admin panel" subtitle="Restricted area">
        <div className="rounded-2xl border border-border bg-card p-7 text-center shadow-soft">
          <ShieldCheck className="mx-auto size-8 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-bold text-foreground font-display">Admins only</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {session.data.email} does not have the Admin role. Ask an Admin to upgrade your seat.
          </p>
        </div>
      </CrmShell>
    );
  }

  const o = overview.data;
  const members = (team.data ?? []).filter((m) => m.active);

  return (
    <CrmShell title="Admin panel" subtitle="Team, roles, lead routing and CRM health">
      {overview.isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading admin data…
        </div>
      ) : null}

      {o ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat icon={Users} label="Active members" value={`${o.members.active}/${o.members.total}`} sub={`${o.members.admins} admin${o.members.admins === 1 ? "" : "s"}`} />
            <Stat icon={KanbanSquare} label="Total leads" value={o.leads.total} sub={`${o.leads.last7} new in last 7 days`} />
            <Stat icon={ShieldCheck} label="Unassigned leads" value={o.leads.unassigned} sub={`${o.leads.won} won · ${o.leads.lost} lost`} />
            <Stat icon={FileText} label="Proposals" value={o.proposals.total} sub={`${o.proposals.sent} sent · ${o.proposals.accepted} accepted`} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-foreground font-display">Team & roles</h2>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/crm/team">
                    <UserPlus className="mr-2 size-3.5" /> Add member
                  </Link>
                </Button>
              </div>
              <div className="mt-4 divide-y divide-border">
                {(team.data ?? []).map((m) => (
                  <div key={m.user_id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {m.full_name || m.email}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                    </div>
                    <Badge variant={m.role === "admin" ? "default" : "secondary"}>
                      {m.role === "admin" ? "Admin" : "Sales rep"}
                    </Badge>
                    <Select
                      value={m.role}
                      onValueChange={(v) =>
                        update({ userId: m.user_id, role: v as "admin" | "sales_rep" })
                      }
                    >
                      <SelectTrigger className="h-9 w-[132px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="sales_rep">Sales rep</SelectItem>
                      </SelectContent>
                    </Select>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      All leads
                      <Switch
                        checked={m.can_view_all}
                        onCheckedChange={(v) => update({ userId: m.user_id, canViewAll: v })}
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      Active
                      <Switch
                        checked={m.active}
                        onCheckedChange={(v) => update({ userId: m.user_id, active: v })}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h2 className="text-base font-bold text-foreground font-display">Lead sources</h2>
              <div className="mt-4 space-y-3">
                {o.bySource.map((s) => {
                  const pct = o.leads.total ? Math.round((s.count / o.leads.total) * 100) : 0;
                  return (
                    <div key={s.source}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {SOURCE_LABEL[s.source] ?? s.source}
                        </span>
                        <span className="font-semibold text-foreground">
                          {s.count} <span className="text-xs text-muted-foreground">({pct}%)</span>
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full gradient-brand" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {o.bySource.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No leads yet.</p>
                ) : null}
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-foreground font-display">
                  Unassigned leads
                </h2>
                <p className="text-sm text-muted-foreground">
                  Route incoming leads to a sales rep in bulk.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger className="h-9 w-[190px]">
                    <SelectValue placeholder="Assign to…" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.user_id} value={m.user_id}>
                        {m.full_name || m.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={runAssign}
                  disabled={busy || !assignee || selected.length === 0}
                  className="gradient-brand text-white"
                >
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  Assign {selected.length || ""}
                </Button>
              </div>
            </div>

            <div className="mt-4 divide-y divide-border">
              {o.unassigned.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  Every lead has an owner. Nice work.
                </p>
              ) : (
                o.unassigned.map((l) => (
                  <label key={l.id} className="flex items-center gap-3 py-3">
                    <Checkbox
                      checked={selected.includes(l.id)}
                      onCheckedChange={(v) =>
                        setSelected((prev) =>
                          v ? [...prev, l.id] : prev.filter((id) => id !== l.id),
                        )
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/crm/lead/$id"
                        params={{ id: l.id }}
                        className="truncate text-sm font-semibold text-foreground hover:underline"
                      >
                        {l.name}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {l.company || "—"} · {SOURCE_LABEL[l.source] ?? l.source} ·{" "}
                        {new Date(l.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </section>
        </>
      ) : null}
    </CrmShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" /> {label}
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground font-display">{value}</p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}
