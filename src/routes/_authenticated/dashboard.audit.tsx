import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  ClipboardCheck,
  Sparkles,
  Printer,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import { listAudits, runAudit, deleteAudit, type AuditRow } from "@/lib/audit.functions";
import { getWorkspace } from "@/lib/workspace.functions";
import { DashboardShell } from "@/components/dashboard/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/audit")({
  component: AuditPage,
});

const STATUS_STYLE = {
  good: { icon: CheckCircle2, cls: "text-emerald-600", badge: "Healthy" },
  warning: { icon: CircleAlert, cls: "text-amber-600", badge: "Needs work" },
  critical: { icon: AlertTriangle, cls: "text-destructive", badge: "Critical" },
} as const;

function AuditPage() {
  const fetchWorkspace = useServerFn(getWorkspace);
  const fetchAudits = useServerFn(listAudits);
  const run = useServerFn(runAudit);
  const remove = useServerFn(deleteAudit);

  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });
  const audits = useQuery({ queryKey: ["gbp-audits"], queryFn: () => fetchAudits() });

  const business = workspace.data?.business ?? null;
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<AuditRow | null>(null);

  useEffect(() => {
    if (!business) return;
    setName((v) => v || business.name);
    setCity((v) => v || business.city);
    setCategory((v) => v || business.category);
    setWebsite((v) => v || business.website || "");
  }, [business]);

  useEffect(() => {
    if (!active && audits.data && audits.data.length > 0) setActive(audits.data[0] ?? null);
  }, [audits.data, active]);

  const generate = async () => {
    if (name.trim().length < 2 || city.trim().length < 2 || category.trim().length < 2) {
      toast.error("Add your business name, city and category first.");
      return;
    }
    setBusy(true);
    try {
      const row = await run({
        data: {
          businessName: name.trim(),
          city: city.trim(),
          category: category.trim(),
          website: website.trim(),
          keywords: business?.keywords ?? [],
          notes: notes.trim(),
        },
      });
      setActive(row);
      void audits.refetch();
      toast.success("Your GMB audit report is ready.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not run the audit.");
    } finally {
      setBusy(false);
    }
  };

  const drop = async (id: string) => {
    await remove({ data: { id } });
    if (active?.id === id) setActive(null);
    void audits.refetch();
    toast.success("Report deleted.");
  };

  return (
    <DashboardShell
      title="GMB Audit Report"
      subtitle="Score your Google Business Profile and get a prioritised fix list."
      actions={
        active ? (
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 size-4" /> Print / Save PDF
          </Button>
        ) : undefined
      }
    >
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-6 print:hidden">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="font-display text-base font-semibold">Run a new audit</h2>
            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="a-name">Business name</Label>
                <Input id="a-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="a-city">City</Label>
                <Input id="a-city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="a-cat">Category</Label>
                <Input
                  id="a-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Dental clinic"
                />
              </div>
              <div>
                <Label htmlFor="a-web">Website (optional)</Label>
                <Input id="a-web" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="a-notes">Anything else? (optional)</Label>
                <Textarea
                  id="a-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 42 reviews, no posts in 3 months, 2 locations"
                />
              </div>
              <Button
                onClick={generate}
                disabled={busy}
                className="w-full gradient-brand text-white"
              >
                {busy ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 size-4" />
                )}
                {busy ? "Auditing your profile…" : "Generate audit report"}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="font-display text-base font-semibold">Past reports</h2>
            {audits.isLoading ? (
              <Loader2 className="mt-4 size-4 animate-spin text-muted-foreground" />
            ) : (audits.data?.length ?? 0) === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No audits yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {audits.data?.map((a) => (
                  <li key={a.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActive(a)}
                      className={`flex-1 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                        active?.id === a.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="block font-medium">{a.business_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString()} · Score {a.score}
                      </span>
                    </button>
                    <Button size="icon" variant="ghost" onClick={() => void drop(a.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          {!active ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <ClipboardCheck className="mx-auto size-10 text-muted-foreground" />
              <h3 className="mt-4 font-display text-lg font-semibold">No report selected</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Run an audit to see your Google Business Profile score, findings and a week-by-week
                action plan.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold">{active.business_name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {active.category} · {active.city} ·{" "}
                      {new Date(active.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-gradient font-display text-4xl font-bold">
                      {active.score}
                      <span className="text-lg text-muted-foreground">/100</span>
                    </div>
                    <Badge variant="secondary">Grade {active.grade}</Badge>
                  </div>
                </div>
                <Progress value={active.score} className="mt-4" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {active.summary}
                </p>
              </div>

              {active.quick_wins.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="font-display text-lg font-semibold">Quick wins</h3>
                  <ul className="mt-3 space-y-2">
                    {active.quick_wins.map((w, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {active.sections.map((s) => {
                  const style = STATUS_STYLE[s.status];
                  const Icon = style.icon;
                  return (
                    <div
                      key={s.name}
                      className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Icon className={`size-4 ${style.cls}`} />
                          <h4 className="font-display text-sm font-semibold">{s.name}</h4>
                        </div>
                        <Badge variant="outline">{s.score}/100</Badge>
                      </div>
                      <Progress value={s.score} className="mt-3" />
                      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                        {s.findings.map((f, i) => (
                          <li key={i}>• {f}</li>
                        ))}
                      </ul>
                      {s.fixes.length > 0 && (
                        <div className="mt-3 rounded-xl bg-muted/60 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                            How to fix
                          </p>
                          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                            {s.fixes.map((f, i) => (
                              <li key={i}>→ {f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {active.action_plan.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="font-display text-lg font-semibold">Action plan</h3>
                  <div className="mt-4 space-y-4">
                    {active.action_plan.map((step, i) => (
                      <div key={i} className="rounded-xl border border-border p-4">
                        <div className="flex items-center gap-2">
                          <Badge className="gradient-brand text-white">{step.week}</Badge>
                          <span className="text-sm font-medium">{step.focus}</span>
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                          {step.tasks?.map((t, j) => <li key={j}>• {t}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
