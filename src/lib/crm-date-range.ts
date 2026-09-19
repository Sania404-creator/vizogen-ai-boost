/** IST-anchored date range helpers shared by the CRM lead views. */
const IST_MS = 5.5 * 60 * 60 * 1000;

export type RangePresetKey =
  | "all"
  | "today"
  | "last7"
  | "last30"
  | "this_month"
  | "last_month"
  | "this_year"
  | "custom";

export const RANGE_PRESETS: { key: RangePresetKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "last7", label: "Last 7 Days" },
  { key: "last30", label: "Last 30 Days" },
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "this_year", label: "This Year" },
  { key: "all", label: "All Time" },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function ymd(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function istNow() {
  const shifted = new Date(Date.now() + IST_MS);
  return {
    y: shifted.getUTCFullYear(),
    m: shifted.getUTCMonth(),
    d: shifted.getUTCDate(),
  };
}

/** Civil IST date string (YYYY-MM-DD) offset by a number of days from today. */
export function istDayOffset(days: number) {
  const { y, m, d } = istNow();
  const shifted = new Date(Date.UTC(y, m, d + days));
  return ymd(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate());
}

export function istToday() {
  return istDayOffset(0);
}

/** Inclusive civil-date range (IST) for a preset. Empty strings mean "no bound". */
export function rangeForPreset(preset: RangePresetKey): { from: string; to: string } {
  const { y, m } = istNow();
  switch (preset) {
    case "today":
      return { from: istToday(), to: istToday() };
    case "last7":
      return { from: istDayOffset(-6), to: istToday() };
    case "last30":
      return { from: istDayOffset(-29), to: istToday() };
    case "this_month":
      return { from: ymd(y, m, 1), to: istToday() };
    case "last_month": {
      const start = new Date(Date.UTC(y, m - 1, 1));
      const end = new Date(Date.UTC(y, m, 0));
      return {
        from: ymd(start.getUTCFullYear(), start.getUTCMonth(), 1),
        to: ymd(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()),
      };
    }
    case "this_year":
      return { from: ymd(y, 0, 1), to: istToday() };
    default:
      return { from: "", to: "" };
  }
}

/** Which preset (if any) matches a from/to pair, so the right pill highlights. */
export function presetForRange(from: string, to: string): RangePresetKey {
  if (!from && !to) return "all";
  for (const p of RANGE_PRESETS) {
    if (p.key === "all") continue;
    const r = rangeForPreset(p.key);
    if (r.from === from && r.to === to) return p.key;
  }
  return "custom";
}

/** Start of an IST civil day as a UTC ISO timestamp. */
export function istStartIso(day: string) {
  return new Date(`${day}T00:00:00.000+05:30`).toISOString();
}

/** End of an IST civil day as a UTC ISO timestamp. */
export function istEndIso(day: string) {
  return new Date(`${day}T23:59:59.999+05:30`).toISOString();
}

export function rangeToIsoFilters(from: string, to: string) {
  return {
    ...(from ? { createdFrom: istStartIso(from) } : {}),
    ...(to ? { createdTo: istEndIso(to) } : {}),
  };
}

export function rangeLabel(from: string, to: string) {
  const preset = presetForRange(from, to);
  if (preset === "all") return "All time";
  if (preset !== "custom") return RANGE_PRESETS.find((p) => p.key === preset)!.label;
  if (from && to) return `${from} → ${to}`;
  return from ? `From ${from}` : `Until ${to}`;
}
