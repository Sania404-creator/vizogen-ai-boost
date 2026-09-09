import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Clock, Handshake, Loader2, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  listPartnerApplications,
  PARTNER_STATUS_LABEL,
  PARTNER_STATUSES,
  updatePartnerApplication,
  type PartnerStatus,
} from "@/lib/partner.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export function PartnerApplicationsPanel({ enabled }: { enabled: boolean }) {
  const queryClient = useQueryClient();
  const fetchApps = useServerFn(listPartnerApplications);
  const patch = useServerFn(updatePartnerApplication);
  const [filter, setFilter] = useState<"all" | PartnerStatus>("all");
  const [busy, setBusy] = useState<string | null>(null);

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

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground font-display">
            <Handshake className="size-4" /> Partner applications
            {apps.isFetching ? <Loader2 className="size-3.5 animate-spin text-muted-foreground" /> : null}
          </h2>
          <p className="text-sm text-muted-foreground">
            Live status board — refreshes automatically every 15 seconds.
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
          rows.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {a.full_name}{" "}
                  <span className="font-mono text-xs text-muted-foreground">
                    {a.reference_code ?? ""}
                  </span>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {a.business_name} · {a.program} · {a.business_count} ·{" "}
                  {new Date(a.created_at).toLocaleDateString()}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {a.email} · {a.phone}
                  {a.website ? ` · ${a.website}` : ""}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[a.status]}>{PARTNER_STATUS_LABEL[a.status]}</Badge>
              <Select
                value={a.status}
                onValueChange={(v) => void setStatus(a.id, v as PartnerStatus)}
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
              <Button size="sm" variant="outline" asChild disabled={busy === a.id}>
                <a href={`mailto:${a.email}`}>Email</a>
              </Button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
