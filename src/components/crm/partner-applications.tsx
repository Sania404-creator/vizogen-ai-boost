import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Handshake,
  Loader2,
  Mail,
  Phone,
  Search,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  listPartnerApplications,
  PARTNER_STATUS_LABEL,
  PARTNER_STATUSES,
  updatePartnerApplication,
  type PartnerApplicationRow,
  type PartnerStatus,
} from "@/lib/partner.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_ICON: Record<PartnerStatus, typeof Clock> = {
  new: Clock,
  reviewing: Search,
  approved: CheckCircle2,
  rejected: XCircle,
};

const STATUS_VARIANT: Record<PartnerStatus, "default" | "secondary" | "outline" | "destructive"> = {
  new: "secondary",
  reviewing: "outline",
  approved: "default",
  rejected: "destructive",
};

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm text-foreground">{children}</div>
    </div>
  );
}

export function PartnerApplicationsPanel({ enabled }: { enabled: boolean }) {
  const queryClient = useQueryClient();
  const fetchApps = useServerFn(listPartnerApplications);
  const patch = useServerFn(updatePartnerApplication);
  const [filter, setFilter] = useState<"all" | PartnerStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const apps = useQuery({
    queryKey: ["crm-partner-applications"],
    queryFn: () => fetchApps(),
    enabled,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  const rows = (apps.data ?? []).filter((a) => filter === "all" || a.status === filter);
  const counts = PARTNER_STATUSES.map((s) => ({
    status: s,
    count: (apps.data ?? []).filter((a) => a.status === s).length,
  }));

  const setStatus = async (id: string, status: PartnerStatus) => {
    setBusy(id);
    try {
      await patch({ data: { id, status } });
      await queryClient.invalidateQueries({ queryKey: ["crm-partner-applications"] });
      toast.success(`Marked as ${PARTNER_STATUS_LABEL[status]}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update application.");
    } finally {
      setBusy(null);
    }
  };

  const saveNotes = async (a: PartnerApplicationRow) => {
    const text = notes[a.id];
    if (text === undefined) return;
    setBusy(a.id);
    try {
      await patch({ data: { id: a.id, adminNotes: text } });
      await queryClient.invalidateQueries({ queryKey: ["crm-partner-applications"] });
      toast.success("Admin notes saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save notes.");
    } finally {
      setBusy(null);
    }
  };

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground font-display">
            <Handshake className="size-4" /> Partner applications
            {apps.isFetching ? <Loader2 className="size-3.5 animate-spin text-muted-foreground" /> : null}
          </h2>
          <p className="text-sm text-muted-foreground">
            Live status board — refreshes automatically every 15 seconds. Click a row to see full details.
          </p>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as "all" | PartnerStatus)}>
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({(apps.data ?? []).length})</SelectItem>
            {counts.map((c) => (
              <SelectItem key={c.status} value={c.status}>
                {PARTNER_STATUS_LABEL[c.status]} ({c.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {counts.map((c) => {
          const Icon = STATUS_ICON[c.status];
          return (
            <div key={c.status} className="rounded-xl border border-border bg-background p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="size-3.5" /> {PARTNER_STATUS_LABEL[c.status]}
              </p>
              <p className="mt-1 text-xl font-bold text-foreground font-display">{c.count}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 divide-y divide-border">
        {apps.isLoading ? (
          <p className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading applications…
          </p>
        ) : rows.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">No applications in this view yet.</p>
        ) : (
          rows.map((a) => {
            const isOpen = openId === a.id;
            return (
              <div key={a.id} className="py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggle(a.id)}
                    className="min-w-0 flex-1 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {a.full_name}{" "}
                        <span className="font-mono text-xs text-muted-foreground">
                          {a.reference_code ?? ""}
                        </span>
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        <span className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 font-medium text-secondary-foreground">
                          {a.program}
                        </span>
                        {" · "}
                        {a.business_name} · {a.business_count} ·{" "}
                        {new Date(a.created_at).toLocaleDateString()}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {a.email} · {a.phone}
                        {a.website ? ` · ${a.website}` : ""}
                      </p>
                    </div>
                  </button>
                  <Badge variant={STATUS_VARIANT[a.status]}>{PARTNER_STATUS_LABEL[a.status]}</Badge>
                  <Select
                    value={a.status}
                    onValueChange={(v) => void setStatus(a.id, v as PartnerStatus)}
                    disabled={busy === a.id}
                  >
                    <SelectTrigger className="h-9 w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PARTNER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {PARTNER_STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant={isOpen ? "default" : "outline"}
                    onClick={() => toggle(a.id)}
                    disabled={busy === a.id}
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="mr-1.5 size-3.5" /> Close
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-1.5 size-3.5" /> Details
                      </>
                    )}
                  </Button>
                </div>

                {isOpen ? (
                  <div className="mt-3 rounded-xl border border-border bg-background p-4 space-y-4">
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Building2 className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-foreground">{a.full_name}</p>
                        <p className="text-sm text-muted-foreground">{a.business_name}</p>
                      </div>
                      <Badge variant="default" className="shrink-0">
                        {a.program}
                      </Badge>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Detail label="Email">
                        <a
                          href={`mailto:${a.email}`}
                          className="inline-flex items-center gap-1.5 text-primary hover:underline"
                        >
                          <Mail className="size-3.5" /> {a.email}
                        </a>
                      </Detail>
                      <Detail label="Phone">
                        <a
                          href={`tel:${a.phone.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1.5 text-primary hover:underline"
                        >
                          <Phone className="size-3.5" /> {a.phone}
                        </a>
                      </Detail>
                      <Detail label="Reference code">
                        <span className="font-mono">{a.reference_code ?? "—"}</span>
                      </Detail>
                      <Detail label="Business size">{a.business_count}</Detail>
                      <Detail label="Website">
                        {a.website ? (
                          <a
                            href={a.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline"
                          >
                            {a.website}
                          </a>
                        ) : (
                          "—"
                        )}
                      </Detail>
                      <Detail label="Submitted">
                        {new Date(a.created_at).toLocaleString()}
                      </Detail>
                      <Detail label="Last updated">
                        {new Date(a.updated_at).toLocaleString()}
                      </Detail>
                      <Detail label="Reviewed at">
                        {a.reviewed_at ? new Date(a.reviewed_at).toLocaleString() : "—"}
                      </Detail>
                    </div>

                    {a.about ? (
                      <div>
                        <Label className="text-xs text-muted-foreground">About / why they applied</Label>
                        <p className="mt-1.5 whitespace-pre-wrap text-sm text-foreground">{a.about}</p>
                      </div>
                    ) : null}

                    <div className="space-y-2 border-t border-border pt-4">
                      <Label htmlFor={`notes-${a.id}`} className="text-xs text-muted-foreground">
                        Admin notes
                      </Label>
                      <Input
                        id={`notes-${a.id}`}
                        value={notes[a.id] ?? a.admin_notes ?? ""}
                        onChange={(e) => setNotes((prev) => ({ ...prev, [a.id]: e.target.value }))}
                        placeholder="Add private notes about this application…"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy === a.id || notes[a.id] === undefined}
                        onClick={() => void saveNotes(a)}
                      >
                        {busy === a.id ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : null}
                        Save notes
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
