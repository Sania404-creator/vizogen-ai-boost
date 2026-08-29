import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Check, Loader2, X } from "lucide-react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPartnerApplication } from "@/lib/partner.functions";
import { WHATSAPP_URL, setOverlayOpen } from "@/lib/site-contact";

export type PartnerProgram = "Affiliate Partner" | "Prime Plus Partnership";

const PROGRAMS: PartnerProgram[] = ["Affiliate Partner", "Prime Plus Partnership"];
const BUSINESS_COUNTS = ["Just starting out", "1-5", "6-20", "20+"] as const;

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{8,20}$/, "Enter a valid phone number")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a 10-digit phone number"),
  businessName: z.string().trim().min(2, "Enter your agency or business name").max(120),
  website: z.string().trim().max(200).optional(),
  program: z.enum(["Affiliate Partner", "Prime Plus Partnership"]),
  businessCount: z.enum(BUSINESS_COUNTS, { message: "Select an option" }),
  about: z.string().trim().max(1000).optional(),
});

type Values = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  website: string;
  program: PartnerProgram;
  businessCount: string;
  about: string;
};
type Errors = Partial<Record<keyof Values, string>>;

const emptyValues = (program: PartnerProgram): Values => ({
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  website: "",
  program,
  businessCount: "",
  about: "",
});

export function PartnerApplicationModal({
  isOpen,
  onClose,
  initialProgram = "Affiliate Partner",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialProgram?: PartnerProgram;
}) {
  const submit = useServerFn(createPartnerApplication);
  const [values, setValues] = useState<Values>(() => emptyValues(initialProgram));
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset per-open and pre-select the program that triggered the modal.
  useEffect(() => {
    if (!isOpen) return;
    setValues(emptyValues(initialProgram));
    setErrors({});
    setServerError(null);
    setDone(false);
    setSubmitting(false);
  }, [isOpen, initialProgram]);

  useEffect(() => {
    if (!isOpen) return;
    setOverlayOpen(true);
    document.body.style.overflow = "hidden";
    return () => {
      setOverlayOpen(false);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape to close + focus trap.
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("input,select,textarea,button")
        ?.focus();
    }, 60);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
    };
  }, [isOpen, onKeyDown]);

  const setField = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateField = (key: keyof Values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors((e) => ({ ...e, [key]: undefined }));
      return;
    }
    const issue = result.error.issues.find((i) => i.path[0] === key);
    setErrors((e) => ({ ...e, [key]: issue?.message }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const result = schema.safeParse(values);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof Values;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSubmitting(true);
    try {
      await submit({ data: result.data });
      setDone(true);
    } catch (err) {
      console.error(err);
      setServerError(
        "Something went wrong. Please try again or reach us directly on WhatsApp.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const errorText = (key: keyof Values) =>
    errors[key] ? (
      <p className="mt-1.5 text-xs font-medium text-destructive">{errors[key]}</p>
    ) : null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="partner-application"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-navy/60 p-3 backdrop-blur-sm sm:p-6"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="partner-application-title"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[95vh] w-[95vw] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-lift sm:w-[520px] sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close partner application"
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>

            {done ? (
              <div className="py-8 text-center">
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  className="mx-auto grid size-16 place-items-center rounded-full gradient-brand text-primary-foreground shadow-glow"
                >
                  <Check className="size-8" strokeWidth={3} />
                </motion.div>
                <h3
                  id="partner-application-title"
                  className="mt-5 font-display text-2xl font-bold text-foreground"
                >
                  Application Received! 🎉
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Our partnerships team will review your application and reach out within 2
                  business days.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-7 inline-flex items-center justify-center rounded-xl gradient-brand px-8 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3
                  id="partner-application-title"
                  className="pr-8 font-display text-2xl font-bold text-foreground"
                >
                  Partner Application
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Tell us a bit about yourself and we'll get back to you within 2 business
                  days.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                  <div>
                    <Label htmlFor="pa-name">Full Name</Label>
                    <Input
                      id="pa-name"
                      value={values.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      onBlur={() => validateField("fullName")}
                      placeholder="Rahul Sharma"
                      aria-invalid={!!errors.fullName}
                      className="mt-1.5"
                    />
                    {errorText("fullName")}
                  </div>

                  <div>
                    <Label htmlFor="pa-email">Email Address</Label>
                    <Input
                      id="pa-email"
                      type="email"
                      value={values.email}
                      onChange={(e) => setField("email", e.target.value)}
                      onBlur={() => validateField("email")}
                      placeholder="you@agency.com"
                      aria-invalid={!!errors.email}
                      className="mt-1.5"
                    />
                    {errorText("email")}
                  </div>

                  <div>
                    <Label htmlFor="pa-phone">Phone Number</Label>
                    <Input
                      id="pa-phone"
                      type="tel"
                      value={values.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      onBlur={() => validateField("phone")}
                      placeholder="+91 84889 18358"
                      aria-invalid={!!errors.phone}
                      className="mt-1.5 font-mono"
                    />
                    {errorText("phone")}
                  </div>

                  <div>
                    <Label htmlFor="pa-business">Agency / Business Name</Label>
                    <Input
                      id="pa-business"
                      value={values.businessName}
                      onChange={(e) => setField("businessName", e.target.value)}
                      onBlur={() => validateField("businessName")}
                      placeholder="Sharma Digital"
                      aria-invalid={!!errors.businessName}
                      className="mt-1.5"
                    />
                    {errorText("businessName")}
                  </div>

                  <div>
                    <Label htmlFor="pa-website">
                      Website / Social Profile{" "}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="pa-website"
                      value={values.website}
                      onChange={(e) => setField("website", e.target.value)}
                      placeholder="instagram.com/yourhandle"
                      className="mt-1.5"
                    />
                    {errorText("website")}
                  </div>

                  <fieldset>
                    <legend className="text-sm font-medium text-foreground">
                      Which Program?
                    </legend>
                    <div
                      role="radiogroup"
                      aria-label="Which Program?"
                      className="mt-2 grid gap-2 sm:grid-cols-2"
                    >
                      {PROGRAMS.map((p) => {
                        const active = values.program === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setField("program", p)}
                            className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                              active
                                ? "gradient-brand border-transparent text-primary-foreground shadow-soft"
                                : "border-border bg-background text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                    {errorText("program")}
                  </fieldset>

                  <div>
                    <Label htmlFor="pa-count">
                      How many businesses do you currently work with?
                    </Label>
                    <select
                      id="pa-count"
                      value={values.businessCount}
                      onChange={(e) => setField("businessCount", e.target.value)}
                      onBlur={() => validateField("businessCount")}
                      aria-invalid={!!errors.businessCount}
                      className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select an option</option>
                      {BUSINESS_COUNTS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errorText("businessCount")}
                  </div>

                  <div>
                    <Label htmlFor="pa-about">
                      Tell us about yourself{" "}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </Label>
                    <Textarea
                      id="pa-about"
                      rows={3}
                      value={values.about}
                      onChange={(e) => setField("about", e.target.value)}
                      placeholder="Anything you'd like us to know — your audience, experience, or how you plan to refer businesses to Vizogen."
                      className="mt-1.5"
                    />
                    {errorText("about")}
                  </div>

                  {serverError ? (
                    <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      <p>
                        {serverError}{" "}
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold underline"
                        >
                          Message us on WhatsApp
                        </a>
                      </p>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Submit Application →"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
