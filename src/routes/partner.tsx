import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal, SectionHeading } from "@/components/landing/reveal";
import {
  ArrowRight,
  BadgeCheck,
  Handshake,
  Loader2,
  Rocket,
  Wallet,
  X,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Google Form embed URLs for the partner application.
// Replace with the real published Google Form embed links
// (Google Forms → Send → Embed HTML <iframe> → copy the src ending in
// "?embedded=true"). If Affiliate and Prime Plus use the SAME form, point both
// constants at that URL and append a pre-filled entry param, e.g.
// `${PARTNER_FORM_URL}&entry.XXXXXXX=Affiliate`.
// ─────────────────────────────────────────────────────────────────────────────
const AFFILIATE_FORM_URL =
  "https://docs.google.com/forms/d/e/REPLACE_WITH_AFFILIATE_FORM_ID/viewform?embedded=true";
const PRIME_PLUS_FORM_URL =
  "https://docs.google.com/forms/d/e/REPLACE_WITH_PRIME_PLUS_FORM_ID/viewform?embedded=true";

type Program = "affiliate" | "prime-plus";

const title = "Partner with Vizogen — Affiliate & Prime Plus Programs";
const description =
  "Join the Vizogen partner program. Earn recurring commissions as an Affiliate Partner or unlock exclusive growth benefits with Prime Plus.";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartnerPage,
});

function PartnerFormModal({
  program,
  onClose,
}: {
  program: Program | null;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!program) return;
    setLoaded(false);
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [program, handleKey]);

  const formUrl = program === "prime-plus" ? PRIME_PLUS_FORM_URL : AFFILIATE_FORM_URL;

  return (
    <AnimatePresence>
      {program ? (
        <motion.div
          key="partner-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Partner Application"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[95vh] w-[95vw] flex-col overflow-hidden rounded-2xl bg-card shadow-lift sm:h-[720px] sm:w-[640px]"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <p className="text-sm font-bold text-foreground">
                Partner Application
                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {program === "prime-plus" ? "Prime Plus" : "Affiliate"}
                </span>
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close application form"
                className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="relative flex-1">
              {!loaded ? (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="size-7 animate-spin text-primary" />
                    <p className="text-sm font-medium">Loading application form…</p>
                  </div>
                </div>
              ) : null}
              <iframe
                key={program}
                src={formUrl}
                title="Partner Application Form"
                className="h-full w-full border-0"
                onLoad={() => setLoaded(true)}
              >
                Loading…
              </iframe>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const ctaClass =
  "group inline-flex items-center justify-center gap-2 rounded-xl gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]";

function PartnerPage() {
  const [program, setProgram] = useState<Program | null>(null);
  const open = (p: Program) => () => setProgram(p);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-40">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[520px] rounded-full bg-brand/12 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-32 left-0 h-[360px] w-[460px] rounded-full bg-brand-2/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Partner Program
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Grow With Vizogen.{" "}
                <span className="text-gradient">Earn With Vizogen.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Join our partner network and earn recurring revenue by bringing
                AI-powered Google Business Profile automation to local
                businesses in your network.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={open("affiliate")} className={ctaClass}>
                  Become a Partner Today
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Program cards */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Two Ways to Partner"
              title="Choose the program that fits you"
              subtitle="Whether you refer occasionally or run a full agency, there's a Vizogen partner track built for your goals."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
              {/* Affiliate */}
              <Reveal>
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift sm:p-9">
                  <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Handshake className="size-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-foreground">
                    Affiliate Partner
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Refer businesses to Vizogen and earn commission on every
                    subscription. No targets, no commitments — just share your
                    link and get paid.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-foreground">
                    {[
                      "Recurring commission on every referral",
                      "Ready-made creatives & referral dashboard",
                      "Monthly payouts, no minimum threshold",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-success" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={open("affiliate")}
                    className={`${ctaClass} mt-8 w-full sm:w-auto`}
                  >
                    Become an Affiliate Partner
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </Reveal>

              {/* Prime Plus */}
              <Reveal delay={0.12}>
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/30 bg-card p-7 shadow-glow sm:p-9">
                  <span className="absolute right-5 top-5 rounded-full gradient-brand px-3 py-1 text-xs font-bold text-primary-foreground">
                    Exclusive
                  </span>
                  <div className="grid size-12 place-items-center rounded-xl gradient-brand text-primary-foreground">
                    <Rocket className="size-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-foreground">
                    Prime Plus Partner
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    For agencies, consultants and resellers managing multiple
                    clients. Get white-glove onboarding, priority support and
                    the highest revenue share.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-foreground">
                    {[
                      "Highest-tier revenue share & bonuses",
                      "Dedicated partner success manager",
                      "Co-branded marketing & priority roadmap input",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-success" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={open("prime-plus")}
                    className={`${ctaClass} mt-8 w-full sm:w-auto`}
                  >
                    Apply for Prime Plus
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Final CTA band */}
        <section className="pb-20 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl gradient-brand px-6 py-12 text-primary-foreground sm:px-12 sm:py-16 lg:px-16">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                />
                <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                  <div className="max-w-xl">
                    <h3 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
                      <Wallet className="size-7 shrink-0" />
                      Ready to build a new revenue stream?
                    </h3>
                    <p className="mt-3 text-primary-foreground/80">
                      Apply in under 2 minutes — our team reviews every
                      application and gets back within 48 hours.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={open("affiliate")}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-navy shadow-soft transition-transform hover:scale-[1.02]"
                  >
                    Become Partner Today
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <PartnerFormModal program={program} onClose={() => setProgram(null)} />
    </div>
  );
}
