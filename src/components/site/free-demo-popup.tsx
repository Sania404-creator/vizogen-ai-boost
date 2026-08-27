import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Check, Loader2, X } from "lucide-react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDemoLead } from "@/lib/bookings.functions";
import { WHATSAPP_URL, openDemoScheduler } from "@/lib/site-contact";

const INDUSTRIES = [
  "Gym & Fitness",
  "Salon",
  "Clinic",
  "Bakery",
  "Restaurant",
  "Pest Control",
  "Car Garage",
  "Tours & Travel",
  "Yoga & Wellness",
  "Handyman",
  "Education",
  "Real Estate",
  "Other",
];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  businessName: z.string().trim().min(2, "Enter your business name").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{8,20}$/, "Enter a valid phone number")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a 10-digit phone number"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  industry: z.string().trim().min(2, "Select your industry"),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

const PITCH = [
  "See how Vizogen automates your GBP",
  "Get a free ranking audit",
  "No commitment required",
];

export function FreeDemoPopup({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}) {
  const [values, setValues] = useState<Values>({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    industry: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const submit = useServerFn(createDemoLead);

  const set = (key: keyof Values, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("input")?.focus();
    }, 260);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      window.clearTimeout(timer);
    };
  }, [open, handleKeyDown]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFailed(false);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Values] = issue.message;
      setErrors(next);
      return;
    }
    setSubmitting(true);
    try {
      await submit({ data: parsed.data });
      setDone(true);
      onSubmitted?.();
    } catch (error) {
      console.error(error);
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Get your free Vizogen demo"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-glow"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close demo popup"
              className="absolute right-3 top-3 z-20 grid size-10 place-items-center rounded-xl bg-card/80 text-muted-foreground backdrop-blur transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="grid flex-1 overflow-y-auto md:grid-cols-[0.85fr_1fr] md:overflow-hidden">
              {/* Pitch panel */}
              <div className="gradient-brand px-6 py-6 text-white md:flex md:flex-col md:justify-center md:px-8 md:py-10">
                <h2 className="font-display text-xl font-bold sm:text-2xl">Get Your Free Demo</h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {PITCH.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 opacity-90" />
                      <span className="opacity-95">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
                  Trusted by 1000+ local businesses
                </p>
              </div>

              {/* Form panel */}
              <div className="bg-card px-6 py-6 md:overflow-y-auto md:px-8 md:py-10">
                {done ? (
                  <div className="py-4 text-center">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 16 }}
                      className="mx-auto grid size-16 place-items-center rounded-full gradient-brand text-white shadow-glow"
                    >
                      <CheckCircle2 className="size-8" />
                    </motion.div>
                    <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                      Thank You! 🎉
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                      Our team will reach out to you shortly. In the meantime, feel free to explore
                      our features.
                    </p>
                    <Button onClick={onClose} className="mt-6 rounded-full gradient-brand px-6">
                      Continue Browsing
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-3" noValidate>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">
                        Book Your Free Demo
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Fill in your details and our team will reach out within 24 hours.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="fd-name">Full Name</Label>
                      <Input
                        id="fd-name"
                        value={values.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Rahul Mehta"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name ? (
                        <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                      ) : null}
                    </div>

                    <div>
                      <Label htmlFor="fd-business">Business Name</Label>
                      <Input
                        id="fd-business"
                        value={values.businessName}
                        onChange={(e) => set("businessName", e.target.value)}
                        placeholder="FitPeak Gym"
                        aria-invalid={!!errors.businessName}
                      />
                      {errors.businessName ? (
                        <p className="mt-1 text-xs text-destructive">{errors.businessName}</p>
                      ) : null}
                    </div>

                    <div>
                      <Label htmlFor="fd-phone">Phone Number</Label>
                      <Input
                        id="fd-phone"
                        type="tel"
                        value={values.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone ? (
                        <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                      ) : null}
                    </div>

                    <div>
                      <Label htmlFor="fd-email">Email Address</Label>
                      <Input
                        id="fd-email"
                        type="email"
                        value={values.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="you@business.com"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email ? (
                        <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                      ) : null}
                    </div>

                    <div>
                      <Label htmlFor="fd-industry">Industry</Label>
                      <select
                        id="fd-industry"
                        value={values.industry}
                        onChange={(e) => set("industry", e.target.value)}
                        aria-invalid={!!errors.industry}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select your industry</option>
                        {INDUSTRIES.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                      {errors.industry ? (
                        <p className="mt-1 text-xs text-destructive">{errors.industry}</p>
                      ) : null}
                    </div>

                    {failed ? (
                      <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                        Something went wrong, please try again or{" "}
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold underline"
                        >
                          WhatsApp us directly
                        </a>
                        .
                      </p>
                    ) : null}

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-full gradient-brand py-6 text-base shadow-glow transition-transform hover:scale-[1.02] hover:opacity-95"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Sending…
                        </>
                      ) : (
                        "Get My Free Demo →"
                      )}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      We respect your privacy. No spam, ever.
                    </p>
                    <p className="text-center text-xs text-muted-foreground">
                      Prefer to pick a time?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openDemoScheduler();
                        }}
                        className="font-semibold text-primary hover:underline"
                      >
                        Choose a slot
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
