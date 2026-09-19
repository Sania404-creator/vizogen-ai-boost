import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, Search, Stethoscope } from "lucide-react";
import { CrmShell, useCrmSession } from "@/components/crm/shell";
import { AddLeadDialog } from "@/components/crm/add-lead-dialog";
import {
  DOCTOR_TAG,
  listLeads,
  listStages,
  listTeam,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
} from "@/lib/crm.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_crm/crm/doctor-leads")({
  head: () => ({
    meta: [
      { title: "Doctor leads — Vizogen CRM" },
      {
        name: "description",
        content:
          "Every doctor and clinic lead in the Vizogen CRM, detected automatically from the lead name or business name.",
      },
      { property: "og:title", content: "Doctor leads — Vizogen CRM" },
      {
        property: "og:description",
        content: "Doctor and clinic leads, auto-detected and grouped in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DoctorLeadsPage,
});

const ANY = "any";

function DoctorLeadsPage() {
  const session = useCrmSession();
  const [status, setStatus] = useState(ANY);
  const [assignedTo, setAssignedTo] = useState(ANY);
  const [source, setSource] = useState(ANY);
  const [search, setSearch] = useState("");

  const fetchLeads = useServerFn(listLeads);
  const fetchStages = useServerFn(listStages);
  const fetchTeam = useServerFn(listTeam);

  const filters = {
    tag: DOCTOR_TAG,
    ...(status !== ANY ? { status } : {}),
    ...(assignedTo !== ANY ? { assignedTo } : {}),
    ...(source !== ANY ? { source } : {}),
    ...(search ? { search } : {}),
  };

  const leads = useQuery({
    queryKey: ["crm-doctor-leads", filters],
    queryFn: () => fetchLeads({ data: filters }),
  });
  const stages = useQuery({ queryKey: ["crm-stages"], queryFn: () => fetchStages() });
  const team = useQuery({ queryKey: ["crm-team"], queryFn: () => fetchTeam() });

  const rows = leads.data ?? [];
  const nameFor = (id: string | null) =>
    id ? (team.data ?? []).find((m) => m.user_id === id)?.full_name ?? "Team" : "Unassigned";

  const exportCsv = () => {
    const header = ["Name", "Phone", "Email", "Company", "Source", "Stage", "Rep", "Created"];
    const csv = [
      header.join(","),
      ...rows.map((l) =>
        [
          l.name,
          l.phone,
          l.email,
          l.company,
          l.source,
          l.status,
          nameFor(l.assigned_to),
          new Date(l.created_at).toLocaleDateString(),
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `vizogen-doctor-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CrmShell
      title="Doctor leads"
      subtitle={`${rows.length} doctor lead${rows.length === 1 ? "" : "s"} in view`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={exportCsv} aria-label="Export CSV">
            <Download className="size-4" />
          </Button>
          <AddLeadDialog team={team.data ?? []} />
        </div>
      }
    >
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Stethoscope className="size-4 text-primary" />
          Leads are added here automatically whenever the name or business name contains “Dr”,
          “Dr.”, “DR” or “Doctor” — no matter which source they came from.
        </p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
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
                  {LEAD_SOURCE_LABELS[s] ?? s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Date added</th>
              <th className="px-4 py-3">Assigned rep</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((lead) => (
              <tr key={lead.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <Link
                    to="/crm/lead/$id"
                    params={{ id: lead.id }}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {lead.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{lead.company || "—"}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {lead.source.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">
                    {(stages.data ?? []).find((s) => s.key === lead.status)?.label ?? lead.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{nameFor(lead.assigned_to)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {leads.isLoading ? "Loading doctor leads…" : "No doctor leads match these filters yet."}
          </p>
        ) : null}
      </div>
      {session.data?.canViewAll ? null : (
        <p className="mt-4 text-xs text-muted-foreground">
          You are viewing only the doctor leads assigned to you.
        </p>
      )}
    </CrmShell>
  );
}
