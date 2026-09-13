import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AlertCircle, BadgeCheck, Copy, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal } from "@/components/landing/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPartnerApplication } from "@/lib/partner.functions";
import { PartnerStatusTracker } from "@/components/site/partner-status-tracker";
import { WHATSAPP_URL } from "@/lib/site-contact";

const title = "Partner Application — Apply to Partner with Vizogen";
const description =
  "Apply to become a Vizogen partner and track your application status live with your reference code.";
const canonical = "https://www.vizogen.in/partner-application";

type ProgramOption = "Affiliate Partner" | "Prime Plus Partnership" | "White-Labelled Partner";

const validateSearch = (
  search: Record<string, unknown>,
): { program?: ProgramOption } => {
  const program = search['program'];
  if (
    program === "Prime Plus Partnership" ||
    program === "White-Labelled Partner" ||
    program === "Affiliate Partner"
  ) {
    return { program };
  }
  return {};
};

export const Route = createFileRoute("/partner-application")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
  validateSearch,
  component: PartnerApplicationPage,
});

const PROGRAMS = ["Affiliate Partner", "Prime Plus Partnership", "White-Labelled Partner"] as const;
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
  program: z.enum(PROGRAMS),
  businessCount: z.enum(BUSINESS_COUNTS, { message: "Select an option" }),
  about: z.string().trim().max(1000).optional(),
});

type Values = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  website: string;
  program: (typeof PROGRAMS)[number];
  businessCount: string;
  about: string;
};

const EMPTY: Values = {
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  website: "",
  program: "Affiliate Partner",
  businessCount: "",
  about: "",
};

function PartnerApplicationPage() {
  const { program: initialProgram } = Route.useSearch();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[520px] rounded-full bg-brand/12 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Partner Application
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Apply to partner with <span className="text-gradient">Vizogen</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Tell us about your business. You'll get a reference code straight away and can
                track your application status on this page at any time.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.25fr_1fr]">
            <ApplicationForm {...(initialProgram ? { initialProgram } : {})} />
            <div className="space-y-6">
              <PartnerStatusTracker />
              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <h2 className="font-display text-lg font-bold text-foreground">
                    What happens next
                  </h2>
                  <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {[
                      "We review your application within 2 business days.",
                      "A partnerships manager calls you to align on your clients and goals.",
                      "You get your commission plan, sales kit and partner badge.",
                    ].map((t, i) => (
                      <li key={t} className="flex gap-3">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full gradient-brand text-xs font-bold text-primary-foreground">
                          {i + 1}
                        </span>
                        {t}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="size-4 text-success" /> Your details stay private and
                    are used only to review this application.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ApplicationForm({ initialProgram }: { initialProgram?: (typeof PROGRAMS)[number] }) {
  const submit = useServerFn(createPartnerApplication);
  const [values, setValues] = useState<Values>({
    ...EMPTY,
    program: initialProgram ?? EMPTY.program,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const setField = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const result = schema.safeParse(values);
    if (!result.success) {
      const next: Partial<Record<keyof Values, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof Values;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSubmitting(true);
    try {
      const res = await submit({ data: result.data });
      setReference(res.referenceCode || null);
      setValues({ ...EMPTY, program: initialProgram ?? EMPTY.program });
    } catch (err) {
      console.error(err);
      setServerError("Something went wrong. Please try again or message us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const errorText = (key: keyof Values) =>
    errors[key] ? (
      <p className="mt-1.5 text-xs font-medium text-destructive">{errors[key]}</p>
    ) : null;

  if (reference) {
    return (
      <Reveal>
        <div className="rounded-2xl border border-border bg-card p-7 text-center shadow-soft sm:p-9">
          <div className="mx-auto grid size-16 place-items-center rounded-full gradient-brand text-primary-foreground shadow-glow">
            <BadgeCheck className="size-8" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold text-foreground">
            Application received
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Save your reference code — use it with your email to check your status any time.
          </p>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(reference);
              toast.success("Reference code copied.");
            }}
            className="mx-auto mt-5 flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 font-mono text-lg font-bold tracking-widest text-foreground"
          >
            {reference}
            <Copy className="size-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={() => setReference(null)}
            className="mt-6 text-sm font-semibold text-primary hover:underline"
          >
            Submit another application
          </button>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
      >
        <h2 className="font-display text-xl font-bold text-foreground">Your details</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="pf-name">Full name</Label>
            <Input
              id="pf-name"
              value={values.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              placeholder="Rahul Sharma"
              aria-invalid={!!errors.fullName}
              className="mt-1.5"
            />
            {errorText("fullName")}
          </div>
          <div>
            <Label htmlFor="pf-business">Agency / business name</Label>
            <Input
              id="pf-business"
              value={values.businessName}
              onChange={(e) => setField("businessName", e.target.value)}
              placeholder="Sharma Digital"
              aria-invalid={!!errors.businessName}
              className="mt-1.5"
            />
            {errorText("businessName")}
          </div>
          <div>
            <Label htmlFor="pf-email">Email address</Label>
            <Input
              id="pf-email"
              type="email"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="you@agency.com"
              aria-invalid={!!errors.email}
              className="mt-1.5"
            />
            {errorText("email")}
          </div>
          <div>
            <Label htmlFor="pf-phone">Phone number</Label>
            <Input
              id="pf-phone"
              type="tel"
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="+91 84889 18358"
              aria-invalid={!!errors.phone}
              className="mt-1.5 font-mono"
            />
            {errorText("phone")}
          </div>
        </div>

        <div>
          <Label htmlFor="pf-website">
            Website / social profile{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="pf-website"
            value={values.website}
            onChange={(e) => setField("website", e.target.value)}
            placeholder="instagram.com/yourhandle"
            className="mt-1.5"
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-foreground">Which program?</legend>
          <div role="radiogroup" aria-label="Which program?" className="mt-2 grid gap-2 sm:grid-cols-3">
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
        </fieldset>

        <div>
          <Label htmlFor="pf-count">How many businesses do you currently work with?</Label>
          <select
            id="pf-count"
            value={values.businessCount}
            onChange={(e) => setField("businessCount", e.target.value)}
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
          <Label htmlFor="pf-about">
            Tell us about your business{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="pf-about"
            rows={4}
            value={values.about}
            onChange={(e) => setField("about", e.target.value)}
            placeholder="Your clients, the cities you serve, and how you plan to introduce Vizogen."
            className="mt-1.5"
          />
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
              <Loader2 className="size-4 animate-spin" /> Submitting…
            </>
          ) : (
            "Submit application →"
          )}
        </button>
      </form>
    </Reveal>
  );
}
