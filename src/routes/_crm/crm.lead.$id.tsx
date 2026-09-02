import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  StickyNote,
} from "lucide-react";
import { toast } from "sonner";
import { CrmShell } from "@/components/crm/shell";
import {
  addActivity,
  getLead,
  listStages,
  listTeam,
  updateLead,
  LOST_REASONS,
} from "@/lib/crm.functions";
import { ProposalEditor } from "@/components/crm/proposal-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_crm/crm/lead/$id")({
  head: () => ({
    meta: [
      { title: "Lead detail — Vizogen CRM" },
      {
        name: "description",
        content: "Lead profile with activity timeline, follow-ups and Vizogen-branded proposals.",
      },
      { property: "og:title", content: "Lead detail — Vizogen CRM" },
      { property: "og:description", content: "Timeline, follow-ups and proposals for one lead." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LeadDetail,
});

const TYPE_ICON: Record<string, typeof StickyNote> = {
  note: StickyNote,
  call: Phone,
  email: Mail,
  proposal_sent: FileText,
  follow_up: CalendarClock,
  contacted: CheckCircle2,
};

function LeadDetail() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const fetchLead = useServerFn(getLead);
  const fetchStages = useServerFn(listStages);
  const fetchTeam = useServerFn(listTeam);
  const save = useServerFn(updateLead);
  const logActivity = useServerFn(addActivity);

  const lead = useQuery({ queryKey: ["crm-lead", id], queryFn: () => fetchLead({ data: { id } }) });
  const stages = useQuery({ queryKey: ["crm-stages"], queryFn: () => fetchStages() });
  const team = useQuery({ queryKey: ["crm-team"], queryFn: () => fetchTeam() });

  const [note, setNote] = useState("");
  const [noteType, setNoteType] = useState<"note" | "call" | "email" | "meeting">("note");
  const [followUp, setFollowUp] = useState("");
  const [tags, setTags] = useState("");
  const [lostReason, setLostReason] = useState("");
  const [busy, setBusy] = useState(false);

  const row = lead.data?.lead;

  useEffect(() => {
    if (row) {
      setFollowUp(row.follow_up_on ?? "");
      setTags(row.tags.join(", "));
      setLostReason(row.lost_reason ?? "");
    }
  }, [row]);

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["crm-lead", id] });
    void queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
    void queryClient.invalidateQueries({ queryKey: ["crm-dashboard"] });
  };

  const patch = async (input: Parameters<typeof save>[0]["data"]) => {
    setBusy(true);
    try {
      await save({ data: input });
      refresh();
      toast.success("Lead updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  };

  const submitNote = async () => {
    if (note.trim().length < 2) return;
    setBusy(true);
    try {
      await logActivity({ data: { leadId: id, type: noteType, body: note.trim() } });
      setNote("");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the entry.");
    } finally {
      setBusy(false);
    }
  };

  if (lead.isError) {
    return (
      <CrmShell title="Lead not found">
        <p className="text-sm text-muted-foreground">
          This lead does not exist or is not assigned to you.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/crm/leads">Back to pipeline</Link>
        </Button>
      </CrmShell>
    );
  }

  return (
    <CrmShell
      title={row?.name ?? "Lead"}
      subtitle={row ? [row.company, row.email, row.phone].filter(Boolean).join(" · ") : ""}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/crm/leads">
            <ArrowLeft className="size-4" /> Pipeline
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => patch({ id, markContacted: true, status: "contacted" })}
              >
                <CheckCircle2 className="size-4" /> Mark contacted
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setNoteType("call");
                  document.getElementById("crm-note")?.focus();
                }}
              >
                <Phone className="size-4" /> Log a call
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setNoteType("note");
                  document.getElementById("crm-note")?.focus();
                }}
              >
                <StickyNote className="size-4" /> Add note
              </Button>
              {row ? (
                <ProposalEditor
                  lead={row}
                  onSent={refresh}
                  trigger={
                    <Button size="sm" className="gradient-brand text-white">
                      <FileText className="size-4" /> Send proposal
                    </Button>
                  }
                />
              ) : null}
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2">
                <Select value={noteType} onValueChange={(v) => setNoteType(v as typeof noteType)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={submitNote} disabled={busy || note.trim().length < 2} size="sm">
                  Add to timeline
                </Button>
              </div>
              <Textarea
                id="crm-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What happened? e.g. Called — asked for pricing for 3 locations."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="text-base font-semibold text-foreground font-display">
              Activity timeline
            </h2>
            <div className="mt-4 space-y-4">
              {(lead.data?.activities ?? []).map((a) => {
                const Icon = TYPE_ICON[a.type] ?? StickyNote;
                return (
                  <div key={a.id} className="flex gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-muted text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground">{a.body}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {a.actor_name} · {new Date(a.created_at).toLocaleString()} ·{" "}
                        {a.type.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                );
              })}
              {(lead.data?.activities ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity logged yet.</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="text-base font-semibold text-foreground font-display">Lead details</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label>Stage</Label>
                <Select
                  value={row?.status ?? "new"}
                  onValueChange={(v) => {
                    if (v === "lost") {
                      toast.info("Pick a reason lost below, then confirm.");
                      setLostReason(LOST_REASONS[1]);
                      void patch({ id, status: v, lostReason: LOST_REASONS[1] });
                      return;
                    }
                    void patch({ id, status: v });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(stages.data ?? []).map((s) => (
                      <SelectItem key={s.key} value={s.key}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {row?.status === "lost" ? (
                <div className="space-y-1.5">
                  <Label>Reason lost</Label>
                  <Select
                    value={lostReason || LOST_REASONS[1]}
                    onValueChange={(v) => {
                      setLostReason(v);
                      void patch({ id, status: "lost", lostReason: v });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOST_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label>Assigned rep</Label>
                <Select
                  value={row?.assigned_to ?? "unassigned"}
                  onValueChange={(v) => patch({ id, assignedTo: v === "unassigned" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {(team.data ?? []).map((m) => (
                      <SelectItem key={m.user_id} value={m.user_id}>
                        {m.full_name || m.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Next follow-up</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                  />
                  <Button variant="outline" onClick={() => patch({ id, followUpOn: followUp })}>
                    Set
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Hot Lead, Enterprise"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      patch({
                        id,
                        tags: tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                  >
                    Save
                  </Button>
                </div>
              </div>

              <dl className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Source</dt>
                  <dd className="text-foreground">{row?.source.replace(/_/g, " ")}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Requested demo</dt>
                  <dd className="text-foreground">{row?.requested_demo_label ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Last contacted</dt>
                  <dd className="text-foreground">
                    {row?.last_contacted_at
                      ? new Date(row.last_contacted_at).toLocaleDateString()
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="text-foreground">
                    {row ? new Date(row.created_at).toLocaleDateString() : "—"}
                  </dd>
                </div>
              </dl>

              {row?.message ? (
                <div className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                  {row.message}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="text-base font-semibold text-foreground font-display">Proposals</h2>
            <div className="mt-3 space-y-3">
              {(lead.data?.proposals ?? []).map((p) => (
                <div key={p.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{p.title}</p>
                    <Badge variant="secondary" className="capitalize">
                      {p.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    v{p.version} ·{" "}
                    {p.sent_at ? `sent ${new Date(p.sent_at).toLocaleDateString()}` : "draft"}
                    {p.viewed_at ? ` · viewed ${new Date(p.viewed_at).toLocaleDateString()}` : ""}
                  </p>
                  <a
                    href={`/proposal/${p.share_token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Open client view <ExternalLink className="size-3" />
                  </a>
                </div>
              ))}
              {(lead.data?.proposals ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No proposals sent yet.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </CrmShell>
  );
}
