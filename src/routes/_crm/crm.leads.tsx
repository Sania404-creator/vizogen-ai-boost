import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, KanbanSquare, List, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { CrmShell, useCrmSession } from "@/components/crm/shell";
import {
  createLead,
  listLeads,
  listStages,
  listTeam,
  updateLead,
  LEAD_SOURCES,
  LOST_REASONS,
  type Lead,
} from "@/lib/crm.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_crm/crm/leads")({
  head: () => ({
    meta: [
      { title: "Leads pipeline — Vizogen CRM" },
      {
        name: "description",
        content: "Kanban and list views of every Vizogen sales lead, with filters and follow-ups.",
      },
      { property: "og:title", content: "Leads pipeline — Vizogen CRM" },
      { property: "og:description", content: "Kanban and list views of every Vizogen sales lead." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LeadsPage,
});

const ANY = "any";

function LeadsPage() {
  const queryClient = useQueryClient();
  const session = useCrmSession();
  const [view, setView] = useState<"board" | "list">("board");
  const [status, setStatus] = useState(ANY);
  const [assignedTo, setAssignedTo] = useState(ANY);
  const [source, setSource] = useState(ANY);
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");
  const [due, setDue] = useState(ANY);
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  const fetchLeads = useServerFn(listLeads);
  const fetchStages = useServerFn(listStages);
  const fetchTeam = useServerFn(listTeam);
  const saveLead = useServerFn(updateLead);

  const filters = {
    ...(status !== ANY ? { status } : {}),
    ...(assignedTo !== ANY ? { assignedTo } : {}),
    ...(source !== ANY ? { source } : {}),
    ...(tag ? { tag } : {}),
    ...(search ? { search } : {}),
    ...(due !== ANY ? { due: due as "today" | "overdue" | "week" } : {}),
    ...(createdFrom ? { createdFrom: new Date(createdFrom).toISOString() } : {}),
    ...(createdTo ? { createdTo: new Date(`${createdTo}T23:59:59`).toISOString() } : {}),
  };

  const leads = useQuery({
    queryKey: ["crm-leads", filters],
    queryFn: () => fetchLeads({ data: filters }),
  });
  const stages = useQuery({ queryKey: ["crm-stages"], queryFn: () => fetchStages() });
  const team = useQuery({ queryKey: ["crm-team"], queryFn: () => fetchTeam() });

  const move = useMutation({
    mutationFn: (input: { id: string; status: string; lostReason?: string }) =>
      saveLead({ data: input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
      void queryClient.invalidateQueries({ queryKey: ["crm-dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const grouped = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    for (const stage of stages.data ?? []) map[stage.key] = [];
    for (const lead of leads.data ?? []) (map[lead.status] ??= []).push(lead);
    return map;
  }, [leads.data, stages.data]);

  const nameFor = (id: string | null) =>
    id ? (team.data ?? []).find((m) => m.user_id === id)?.full_name ?? "Team" : "Unassigned";

  const onDrop = (leadId: string, stageKey: string) => {
    const lead = (leads.data ?? []).find((l) => l.id === leadId);
    if (!lead || lead.status === stageKey) return;
    if (stageKey === "lost") {
      const reason = window.prompt(
        `Reason lost? One of: ${LOST_REASONS.join(", ")}`,
        "No Response",
      );
      if (!reason) return;
      move.mutate({ id: leadId, status: stageKey, lostReason: reason });
      return;
    }
    move.mutate({ id: leadId, status: stageKey });
  };

  const exportCsv = () => {
    const rows = leads.data ?? [];
    const header = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Source",
      "Stage",
      "Assigned to",
      "Follow-up",
      "Tags",
      "Created",
    ];
    const csv = [
      header.join(","),
      ...rows.map((l) =>
        [
          l.name,
          l.email,
          l.phone,
          l.company,
          l.source,
          l.status,
          nameFor(l.assigned_to),
          l.follow_up_on ?? "",
          l.tags.join(" | "),
          new Date(l.created_at).toLocaleDateString(),
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `vizogen-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CrmShell
      title="Leads"
      subtitle={`${leads.data?.length ?? 0} lead${(leads.data?.length ?? 0) === 1 ? "" : "s"} in view`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={exportCsv} aria-label="Export CSV">
            <Download className="size-4" />
          </Button>
          <div className="hidden rounded-full border border-border p-0.5 sm:flex">
            <Button
              variant={view === "board" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => setView("board")}
            >
              <KanbanSquare className="size-4" /> Board
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => setView("list")}
            >
              <List className="size-4" /> List
            </Button>
          </div>
          <AddLeadDialog team={team.data ?? []} />
        </div>
      }
    >
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <div className="relative md:col-span-2 xl:col-span-2">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company, phone"
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All stages</SelectItem>
              {(stages.data ?? []).map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Rep" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All reps</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {(team.data ?? []).map((m) => (
                <SelectItem key={m.user_id} value={m.user_id}>
                  {m.full_name || m.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger>
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All sources</SelectItem>
              {LEAD_SOURCES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={due} onValueChange={setDue}>
            <SelectTrigger>
              <SelectValue placeholder="Follow-up" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Any follow-up</SelectItem>
              <SelectItem value="today">Due today</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="week">Next 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag e.g. Hot Lead" />
          <div className="flex items-center gap-2">
            <Label className="shrink-0 text-xs text-muted-foreground">Created from</Label>
            <Input type="date" value={createdFrom} onChange={(e) => setCreatedFrom(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Label className="shrink-0 text-xs text-muted-foreground">to</Label>
            <Input type="date" value={createdTo} onChange={(e) => setCreatedTo(e.target.value)} />
          </div>
        </div>
      </div>

      {view === "board" ? (
        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {(stages.data ?? []).map((stage) => (
            <div
              key={stage.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e.dataTransfer.getData("text/plain"), stage.key)}
              className="w-72 shrink-0 rounded-2xl border border-border bg-card p-3 shadow-soft"
            >
              <div className="flex items-center justify-between px-1 pb-2">
                <p className="text-sm font-semibold text-foreground">{stage.label}</p>
                <Badge variant="secondary">{(grouped[stage.key] ?? []).length}</Badge>
              </div>
              <div className="space-y-2">
                {(grouped[stage.key] ?? []).map((lead) => (
                  <Link
                    key={lead.id}
                    to="/crm/lead/$id"
                    params={{ id: lead.id }}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", lead.id)}
                    className="block rounded-xl border border-border bg-background p-3 transition-colors hover:border-primary/50"
                  >
                    <p className="truncate text-sm font-semibold text-foreground">{lead.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {lead.company || lead.email || lead.phone}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      {lead.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                      {lead.follow_up_on ? (
                        <span className="text-[10px] text-muted-foreground">
                          ⏱ {lead.follow_up_on}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {nameFor(lead.assigned_to)}
                    </p>
                  </Link>
                ))}
                {(grouped[stage.key] ?? []).length === 0 ? (
                  <p className="px-1 py-4 text-xs text-muted-foreground">Drop leads here</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Rep</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Follow-up</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(leads.data ?? []).map((lead) => (
                <tr key={lead.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <Link
                      to="/crm/lead/$id"
                      params={{ id: lead.id }}
                      className="font-semibold text-foreground hover:text-primary"
                    >
                      {lead.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{lead.email || lead.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.company || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">
                      {(stages.data ?? []).find((s) => s.key === lead.status)?.label ?? lead.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{nameFor(lead.assigned_to)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {lead.source.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.follow_up_on ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(leads.data ?? []).length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No leads match these filters.
            </p>
          ) : null}
        </div>
      )}
      {session.data?.canViewAll ? null : (
        <p className="mt-4 text-xs text-muted-foreground">
          You are viewing only the leads assigned to you.
        </p>
      )}
    </CrmShell>
  );
}

function AddLeadDialog({ team }: { team: { user_id: string; full_name: string; email: string }[] }) {
  const queryClient = useQueryClient();
  const add = useServerFn(createLead);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    source: "manual" as (typeof LEAD_SOURCES)[number],
    assignedTo: "",
    followUpOn: "",
    tags: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await add({
        data: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          jobTitle: form.jobTitle,
          source: form.source,
          status: "new",
          assignedTo: form.assignedTo,
          followUpOn: form.followUpOn,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          message: form.message,
        },
      });
      toast.success("Lead added.");
      setOpen(false);
      setForm({ ...form, name: "", email: "", phone: "", company: "", message: "", tags: "" });
      void queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add the lead.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-brand text-white">
          <Plus className="size-4" /> Add lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a lead</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Company</Label>
            <Input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Job title</Label>
            <Input
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Source</Label>
            <Select
              value={form.source}
              onValueChange={(v) => setForm({ ...form, source: v as typeof form.source })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAD_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Assign to</Label>
            <Select
              value={form.assignedTo || "me"}
              onValueChange={(v) => setForm({ ...form, assignedTo: v === "me" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="me">Me</SelectItem>
                {team.map((m) => (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.full_name || m.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Follow-up date</Label>
            <Input
              type="date"
              value={form.followUpOn}
              onChange={(e) => setForm({ ...form, followUpOn: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={submit}
            disabled={busy || form.name.trim().length < 2}
            className="gradient-brand text-white"
          >
            Save lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
