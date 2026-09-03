import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Play, Sparkles, Star, CalendarClock, Lightbulb } from "lucide-react";
import {
  getAgentSettings,
  saveAgentSettings,
  listAgentRuns,
  runAgentNow,
  type AgentSettingsRow,
} from "@/lib/agent.functions";
import { getWorkspace } from "@/lib/workspace.functions";
import { DashboardShell } from "@/components/dashboard/shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/agent")({
  head: () => ({
    meta: [
      { title: "AI Agent · Vizogen" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AgentPage,
});

const DEFAULTS: AgentSettingsRow = {
  agent_enabled: false,
  auto_reply_enabled: true,
  auto_reply_min_rating: 4,
  auto_reply_send: false,
  auto_post_enabled: true,
};

function AgentPage() {
  const fetchSettings = useServerFn(getAgentSettings);
  const persist = useServerFn(saveAgentSettings);
  const fetchRuns = useServerFn(listAgentRuns);
  const run = useServerFn(runAgentNow);
  const fetchWorkspace = useServerFn(getWorkspace);

  const settingsQuery = useQuery({ queryKey: ["agent-settings"], queryFn: () => fetchSettings() });
  const runsQuery = useQuery({ queryKey: ["agent-runs"], queryFn: () => fetchRuns() });
  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });

  const [form, setForm] = useState<AgentSettingsRow>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (settingsQuery.data) setForm(settingsQuery.data);
  }, [settingsQuery.data]);

  const connected = Boolean(workspace.data?.business?.google_location_id);
  const latest = runsQuery.data?.[0] ?? null;

  const update = (patch: Partial<AgentSettingsRow>) => setForm((prev) => ({ ...prev, ...patch }));

  const save = async (next: AgentSettingsRow) => {
    setSaving(true);
    try {
      await persist({ data: next });
      setForm(next);
      toast.success("Automation settings saved.");
      void settingsQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  const runNow = async () => {
    setRunning(true);
    try {
      const result = await run();
      if (result.status === "error") toast.error(result.summary);
      else toast.success(result.summary);
      void runsQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The agent could not run.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <DashboardShell
      title="AI Agent"
      subtitle="Your always-on GMB manager: syncs reviews, replies for you, keeps posts flowing and audits the profile."
      actions={
        <Button onClick={runNow} disabled={running} className="gradient-brand text-white">
          {running ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Play className="mr-2 size-4" />
          )}
          Run now
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 font-semibold text-foreground font-display">
                  <Bot className="size-4 text-primary" /> Agent autopilot
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  When on, the agent runs automatically every hour and logs what it did.
                </p>
              </div>
              <Switch
                checked={form.agent_enabled}
                disabled={saving}
                onCheckedChange={(v) => save({ ...form, agent_enabled: v })}
              />
            </div>

            <div className="mt-6 space-y-5 border-t border-border pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold">
                    <Star className="size-3.5 text-primary" /> Review reply automation
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Writes brand-tone replies to reviews that are still waiting.
                  </p>
                </div>
                <Switch
                  checked={form.auto_reply_enabled}
                  onCheckedChange={(v) => update({ auto_reply_enabled: v })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Reply to ratings of at least</Label>
                  <Select
                    value={String(form.auto_reply_min_rating)}
                    onValueChange={(v) => update({ auto_reply_min_rating: Number(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} star{n === 1 ? "" : "s"} and above
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Reply handling</Label>
                  <Select
                    value={form.auto_reply_send ? "send" : "draft"}
                    onValueChange={(v) => update({ auto_reply_send: v === "send" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft for my approval</SelectItem>
                      <SelectItem value="send">Post to Google automatically</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 border-t border-border pt-5">
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarClock className="size-3.5 text-primary" /> Keep posts flowing
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Schedules a fresh AI post whenever your cadence has a gap.
                  </p>
                </div>
                <Switch
                  checked={form.auto_post_enabled}
                  onCheckedChange={(v) => update({ auto_post_enabled: v })}
                />
              </div>

              <Button onClick={() => save(form)} disabled={saving} className="w-full sm:w-auto">
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                Save settings
              </Button>
            </div>
          </div>

          {!connected ? (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <p className="font-semibold text-foreground">Google location not connected</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The agent still drafts replies, schedules posts and audits your profile. It starts
                posting to Google the moment your profile is connected.
              </p>
              <Button asChild size="sm" className="mt-3 gradient-brand text-white">
                <Link to="/dashboard/settings">Connect Google</Link>
              </Button>
            </div>
          ) : null}

          {latest?.details?.profileTips?.length ? (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="flex items-center gap-2 font-semibold text-foreground font-display">
                <Lightbulb className="size-4 text-primary" /> What to fix this week
              </p>
              <ul className="mt-3 space-y-2">
                {latest.details.profileTips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-sm text-muted-foreground">
                    <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="font-semibold text-foreground font-display">Activity log</p>
          <p className="mt-1 text-sm text-muted-foreground">The last 20 agent runs.</p>

          {runsQuery.isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : (runsQuery.data ?? []).length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No runs yet. Hit “Run now” to see the agent work.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {(runsQuery.data ?? []).map((item) => (
                <li key={item.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Badge
                      variant={item.status === "ok" ? "default" : "outline"}
                      className="capitalize"
                    >
                      {item.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.trigger === "cron" ? "Automatic" : "Manual"} ·{" "}
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground">{item.summary}</p>
                  {item.details?.notes?.length ? (
                    <ul className="mt-2 space-y-1">
                      {item.details.notes.map((note) => (
                        <li key={note} className="text-xs text-muted-foreground">
                          • {note}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
