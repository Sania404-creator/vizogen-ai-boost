import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  RANGE_PRESETS,
  presetForRange,
  rangeForPreset,
  type RangePresetKey,
} from "@/lib/crm-date-range";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Summary = {
  total: number;
  doctor: number;
  bySource: { source: string; label: string; count: number }[];
};

export function LeadDateFilter({
  from,
  to,
  onChange,
  summary,
  loading,
}: {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
  summary: Summary | undefined;
  loading?: boolean;
}) {
  const active = presetForRange(from, to);
  const [open, setOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);

  useEffect(() => {
    setDraftFrom(from);
    setDraftTo(to);
  }, [from, to]);

  const pick = (key: RangePresetKey) => onChange(rangeForPreset(key));

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        {RANGE_PRESETS.map((p) => (
          <Button
            key={p.key}
            type="button"
            size="sm"
            variant={active === p.key ? "default" : "outline"}
            onClick={() => pick(p.key)}
            className={cn(
              "rounded-full",
              active === p.key &&
                "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90",
            )}
          >
            {p.label}
          </Button>
        ))}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant={active === "custom" ? "default" : "outline"}
              className={cn(
                "rounded-full",
                active === "custom" &&
                  "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90",
              )}
            >
              Custom Range
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 space-y-3 p-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Start date</Label>
              <Input
                type="date"
                value={draftFrom}
                onChange={(e) => setDraftFrom(e.target.value)}
                className="pointer-events-auto"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">End date</Label>
              <Input
                type="date"
                value={draftTo}
                onChange={(e) => setDraftTo(e.target.value)}
                className="pointer-events-auto"
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
              onClick={() => {
                onChange({ from: draftFrom, to: draftTo });
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </PopoverContent>
        </Popover>

        {active !== "all" ? (
          <button
            type="button"
            onClick={() => onChange({ from: "", to: "" })}
            className="ml-1 inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            <X className="size-3" /> Clear filter
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(2,minmax(0,180px))_1fr]">
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total leads</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-foreground">
            {loading ? "…" : summary?.total ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Doctor leads</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-foreground">
            {loading ? "…" : summary?.doctor ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">By source</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(summary?.bySource ?? []).map((s) => (
              <span
                key={s.source}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground"
              >
                {s.label}: <span className="font-mono font-semibold">{s.count}</span>
              </span>
            ))}
            {!loading && (summary?.bySource ?? []).length === 0 ? (
              <span className="text-xs text-muted-foreground">No leads in this range.</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
