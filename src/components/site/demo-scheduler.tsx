import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, CheckCircle2, Clock, Loader2, X } from "lucide-react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDemoBooking } from "@/lib/bookings.functions";

const SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  businessName: z.string().trim().min(2, "Enter your business name").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Digits and + - ( ) only"),
  note: z.string().trim().max(600).optional(),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

function nextBusinessDays(count: number) {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    if (cursor.getDay() !== 0) days.push(new Date(cursor));
  }
  return days;
}

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function googleCalendarLink(slotDate: string, slotTime: string) {
  const [hourRaw, rest] = slotTime.split(":");
  const minutes = rest?.slice(0, 2) ?? "00";
  const isPm = slotTime.toUpperCase().includes("PM");
  let hour = Number(hourRaw);
  if (isPm && hour !== 12) hour += 12;
  if (!isPm && hour === 12) hour = 0;
  // IST (UTC+5:30) → UTC
  const start = new Date(`${slotDate}T${String(hour).padStart(2, "0")}:${minutes}:00+05:30`);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Vizogen Demo Call (30 min)",
    details: "Your Vizogen demo call — we'll review your Google Business Profile live.",
    dates: `${fmt(start)}/${fmt(end)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function DemoScheduler({ open, onClose }: { open: boolean; onClose: () => void }) {
  const days = useMemo(() => nextBusinessDays(8), []);
  const [date, setDate] = useState(() => toISO(days[0]!));
  const [time, setTime] = useState(SLOTS[0]!);
  const [values, setValues] = useState<Values>({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    note: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ slotLabel: string } | null>(null);
  const book = useServerFn(createDemoBooking);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const set = (key: keyof Values, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as keyof Values] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSubmitting(true);
    try {
      const result = await book({
        data: { ...parsed.data, note: parsed.data.note ?? "", slotDate: date, slotTime: time },
      });
      setDone({ slotLabel: result.slotLabel });
    } catch (error) {
      console.error(error);
      toast.error("Couldn't book that slot. Please try again or WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Book a Vizogen demo"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full max-w-3xl flex-col overflow-hidden bg-card shadow-glow sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:border sm:border-border"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  30-minute call
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">
                  Book your Vizogen demo
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              {done ? (
                <div className="py-6 text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                    className="mx-auto grid size-16 place-items-center rounded-full gradient-brand text-white shadow-glow"
                  >
                    <CheckCircle2 className="size-8" />
                  </motion.div>
                  <h3 className="mt-5 text-2xl font-bold text-foreground">You're all set!</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    We've sent a confirmation to your email. Your demo is scheduled for{" "}
                    <span className="font-semibold text-foreground">{done.slotLabel}</span>.
                  </p>
                  <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button asChild className="rounded-full gradient-brand px-6">
                      <a
                        href={googleCalendarLink(date, time)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Add to Calendar
                      </a>
                    </Button>
                    <Button variant="outline" className="rounded-full px-6" onClick={onClose}>
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-5">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <CalendarDays className="size-4 text-primary" /> Pick a date
                      </p>
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {days.map((d) => {
                          const iso = toISO(d);
                          const active = iso === date;
                          return (
                            <button
                              key={iso}
                              type="button"
                              onClick={() => setDate(iso)}
                              className={`rounded-xl border px-2 py-2 text-center transition-all ${
                                active
                                  ? "border-transparent gradient-brand text-white shadow-soft"
                                  : "border-border bg-card text-foreground hover:border-brand/50"
                              }`}
                            >
                              <span className="block text-[10px] font-semibold uppercase opacity-80">
                                {d.toLocaleDateString("en-IN", { weekday: "short" })}
                              </span>
                              <span className="block font-display text-base font-bold">
                                {d.getDate()}
                              </span>
                              <span className="block text-[10px] opacity-80">
                                {d.toLocaleDateString("en-IN", { month: "short" })}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Clock className="size-4 text-primary" /> Pick a time (IST)
                      </p>
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {SLOTS.map((slot) => {
                          const active = slot === time;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTime(slot)}
                              className={`rounded-xl border px-2 py-2 text-xs font-semibold transition-all ${
                                active
                                  ? "border-transparent gradient-brand text-white shadow-soft"
                                  : "border-border bg-card text-muted-foreground hover:border-brand/50 hover:text-foreground"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="ds-name">Full name</Label>
                      <Input
                        id="ds-name"
                        value={values.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Rahul Mehta"
                      />
                      {errors.name ? (
                        <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                      ) : null}
                    </div>
                    <div>
                      <Label htmlFor="ds-business">Business name</Label>
                      <Input
                        id="ds-business"
                        value={values.businessName}
                        onChange={(e) => set("businessName", e.target.value)}
                        placeholder="FitPeak Gym"
                      />
                      {errors.businessName ? (
                        <p className="mt-1 text-xs text-destructive">{errors.businessName}</p>
                      ) : null}
                    </div>
                    <div>
                      <Label htmlFor="ds-email">Email</Label>
                      <Input
                        id="ds-email"
                        type="email"
                        value={values.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="you@business.com"
                      />
                      {errors.email ? (
                        <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                      ) : null}
                    </div>
                    <div>
                      <Label htmlFor="ds-phone">Phone number</Label>
                      <Input
                        id="ds-phone"
                        value={values.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone ? (
                        <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                      ) : null}
                    </div>
                    <div>
                      <Label htmlFor="ds-note">Anything we should know? (optional)</Label>
                      <Textarea
                        id="ds-note"
                        rows={2}
                        value={values.note}
                        onChange={(e) => set("note", e.target.value)}
                        placeholder="City, category, current challenges…"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-full gradient-brand py-6 text-base shadow-glow transition-transform hover:scale-[1.02] hover:opacity-95"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Booking…
                        </>
                      ) : (
                        "Confirm my demo →"
                      )}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      You'll get an instant email confirmation. Our team is notified too.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
