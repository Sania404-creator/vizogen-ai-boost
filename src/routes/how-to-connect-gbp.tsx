import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal } from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";
import { BrowserMock, MockBar } from "@/components/landing/browser-mock";

const title = "How to Connect Your Google Business Profile — Vizogen";
const description =
  "Step-by-step guide to securely connect your Google Business Profile to Vizogen and unlock AI-driven posts, review replies and local ranking automation.";

export const Route = createFileRoute("/how-to-connect-gbp")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowToConnectGbp,
});

type Step = {
  n: string;
  title: string;
  desc: string;
  cta?: { label: string; to?: string; href?: string };
  callout?: { tone: "amber" | "red"; text: string };
  url: string;
  mock: React.ReactNode;
};

const steps: Step[] = [
  {
    n: "01",
    title: "Log into Vizogen",
    desc: "Go to the Vizogen portal and log into your account using your credentials to access your personalized workspace.",
    cta: { label: "Go to Login Page", to: "/login" },
    url: "login.vizogen.in/sign-in",
    mock: (
      <div className="mx-auto max-w-xs space-y-3 py-4">
        <div className="mx-auto size-10 rounded-xl gradient-brand" />
        <MockBar w="55%" tall />
        <div className="space-y-2 pt-2">
          <div className="h-9 rounded-xl border border-border bg-muted/40" />
          <div className="h-9 rounded-xl border border-border bg-muted/40" />
          <div className="h-9 rounded-xl gradient-brand" />
        </div>
      </div>
    ),
  },
  {
    n: "02",
    title: "Click the Plus (+) Icon on Dashboard",
    desc: "Once logged in, navigate to your main Dashboard. Look for the 'Add Google Account' section and click the Plus (+) icon to start the connection.",
    cta: { label: "Go to Dashboard", to: "/login" },
    url: "app.vizogen.in/dashboard",
    mock: (
      <div className="space-y-3">
        <MockBar w="40%" tall />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 rounded-xl bg-muted/60" />
          <div className="h-16 rounded-xl bg-muted/60" />
          <div className="grid h-16 place-items-center rounded-xl border-2 border-dashed border-primary/40 text-2xl font-bold text-primary">
            +
          </div>
        </div>
        <MockBar w="70%" />
        <MockBar w="55%" />
      </div>
    ),
  },
  {
    n: "03",
    title: "Log into your Google Account",
    desc: "A secure Google window will open. Sign in with the exact Gmail address that manages your Google Business Profile so Vizogen can find the right listings.",
    cta: { label: "Open Google.com", href: "https://accounts.google.com" },
    callout: {
      tone: "red",
      text: "Crucial Step: Must be the admin/owner email of the GBP profile.",
    },
    url: "accounts.google.com/signin",
    mock: (
      <div className="mx-auto max-w-xs space-y-3 py-4 text-center">
        <div className="mx-auto size-8 rounded-full bg-muted" />
        <MockBar w="60%" />
        <div className="h-9 rounded-md border border-border bg-muted/40" />
        <div className="flex justify-end">
          <div className="h-8 w-20 rounded-full bg-primary/80" />
        </div>
      </div>
    ),
  },
  {
    n: "04",
    title: "Choose an Account",
    desc: "The 'Choose an account' screen will show every Google account signed into this browser. Pick the one connected to your business.",
    url: "accounts.google.com/chooser",
    mock: (
      <div className="mx-auto max-w-xs space-y-2 py-2">
        <MockBar w="50%" tall />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <div className="size-8 shrink-0 rounded-full bg-muted" />
            <div className="flex-1 space-y-1.5">
              <MockBar w="60%" />
              <MockBar w="85%" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "05",
    title: "Select the Account that Manages your GBP",
    desc: "Click the exact email address that owns or manages your Google Business Profile. Picking the wrong account will show zero or incorrect listings.",
    url: "accounts.google.com/chooser",
    mock: (
      <div className="mx-auto max-w-xs space-y-2 py-2">
        <div className="flex items-center gap-3 rounded-xl border-2 border-primary bg-primary/5 p-3">
          <div className="size-8 shrink-0 rounded-full gradient-brand" />
          <div className="flex-1 space-y-1.5">
            <MockBar w="65%" />
            <MockBar w="90%" />
          </div>
          <CheckCircle2 className="size-5 text-primary" />
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border p-3 opacity-60">
          <div className="size-8 shrink-0 rounded-full bg-muted" />
          <div className="flex-1 space-y-1.5">
            <MockBar w="45%" />
            <MockBar w="70%" />
          </div>
        </div>
      </div>
    ),
  },
  {
    n: "06",
    title: "Review & Click Continue",
    desc: "Google will show what Vizogen can access — your name, profile picture, and email address. Review the details and click 'Continue' to proceed.",
    url: "accounts.google.com/oauth/consent",
    mock: (
      <div className="mx-auto max-w-xs space-y-3 py-2">
        <MockBar w="70%" tall />
        <MockBar w="100%" />
        <MockBar w="85%" />
        <div className="rounded-xl border border-border p-3 space-y-2">
          <MockBar w="55%" />
          <MockBar w="75%" />
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-8 w-16 rounded-full bg-muted" />
          <div className="h-8 w-20 rounded-full gradient-brand" />
        </div>
      </div>
    ),
  },
  {
    n: "07",
    title: "Allow Business Listing Permissions",
    desc: "On the permissions screen, tick the checkbox for 'See, edit, create and delete your Google business listings', then click 'Continue'.",
    callout: {
      tone: "amber",
      text: "Do not skip: the checkbox must be ticked before clicking Continue.",
    },
    url: "accounts.google.com/oauth/scopes",
    mock: (
      <div className="mx-auto max-w-xs space-y-3 py-2">
        <MockBar w="65%" tall />
        <div className="flex items-start gap-3 rounded-xl border-2 border-primary bg-primary/5 p-3">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded gradient-brand text-primary-foreground">
            <CheckCircle2 className="size-3.5" />
          </span>
          <div className="flex-1 space-y-1.5">
            <MockBar w="90%" />
            <MockBar w="70%" />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="h-8 w-20 rounded-full gradient-brand" />
        </div>
      </div>
    ),
  },
  {
    n: "08",
    title: "Your GBP Profiles are Connected",
    desc: "Done! All your business listings now appear in the GBP Profile section of your dashboard with verified/unverified status. Use 'Manage' or 'Insights' on any location to start automating.",
    cta: { label: "Go to Dashboard", to: "/login" },
    url: "app.vizogen.in/gbp-profiles",
    mock: (
      <div className="space-y-3">
        <MockBar w="45%" tall />
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <div className="size-9 shrink-0 rounded-lg bg-muted" />
            <div className="flex-1 space-y-1.5">
              <MockBar w="55%" />
              <MockBar w="35%" />
            </div>
            <span className="rounded-full bg-success/10 px-2 py-1 text-[10px] font-semibold text-success">
              Verified
            </span>
          </div>
        ))}
      </div>
    ),
  },
];

function HowToConnectGbp() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start center", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.4 });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pb-16 pt-20 sm:pt-28">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-25 blur-3xl gradient-brand"
          />
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Integration Guide
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:leading-[1.1] font-display">
                How to Connect Your <span className="text-gradient">Google Business Profile</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Follow these simple steps to securely link your Google Business Profile (GBP)
                account to Vizogen and unlock powerful AI-driven automation.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Steps */}
        <section className="pb-20">
          <div ref={railRef} className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* timeline rail */}
            <div
              aria-hidden
              className="absolute bottom-8 left-[26px] top-4 w-px bg-border sm:left-[30px] lg:left-1/2"
            >
              <motion.div
                className="h-full w-full origin-top gradient-brand"
                style={{ scaleY: progress }}
              />
            </div>

            <div className="space-y-14 sm:space-y-20">
              {steps.map((s, i) => {
                const flip = i % 2 === 1;
                return (
                  <div key={s.n} className="relative pl-16 sm:pl-20 lg:pl-0">
                    {/* node */}
                    <div className="absolute left-0 top-1 grid size-[52px] place-items-center rounded-2xl gradient-brand text-sm font-bold text-primary-foreground shadow-glow sm:size-[60px] sm:text-base lg:left-1/2 lg:-translate-x-1/2">
                      {s.n}
                    </div>

                    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                      {/* text */}
                      <motion.div
                        initial={{ opacity: 0, x: flip ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className={`relative ${flip ? "lg:order-2 lg:pl-14" : "lg:order-1 lg:pr-14"}`}
                      >
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -top-10 -left-2 select-none text-[5.5rem] font-bold leading-none text-foreground/[0.045] sm:text-[7rem] font-display"
                        >
                          {s.n}
                        </span>
                        <p className="relative text-xs font-semibold uppercase tracking-widest text-primary">
                          Step {s.n}
                        </p>
                        <h2 className="relative mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-display">
                          {s.title}
                        </h2>
                        <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {s.desc}
                        </p>

                        {s.callout ? (
                          <div
                            className={`relative mt-4 flex items-start gap-2.5 rounded-2xl border p-3.5 text-sm ${
                              s.callout.tone === "red"
                                ? "border-destructive/25 bg-destructive/5 text-destructive"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            }`}
                          >
                            {s.callout.tone === "red" ? (
                              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                            ) : (
                              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                            )}
                            <span className="font-medium">{s.callout.text}</span>
                          </div>
                        ) : null}

                        {s.cta ? (
                          <div className="relative mt-5">
                            {s.cta.to ? (
                              <Button asChild variant="outline" className="rounded-full">
                                <Link to={s.cta.to}>
                                  {s.cta.label} <ArrowRight className="size-4" />
                                </Link>
                              </Button>
                            ) : (
                              <Button asChild variant="outline" className="rounded-full">
                                <a href={s.cta.href} target="_blank" rel="noreferrer">
                                  {s.cta.label} <ArrowRight className="size-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        ) : null}
                      </motion.div>

                      {/* mock */}
                      <motion.div
                        initial={{ opacity: 0, x: flip ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className={`order-first ${flip ? "lg:order-1 lg:pr-14" : "lg:order-2 lg:pl-14"}`}
                      >
                        <BrowserMock url={s.url}>{s.mock}</BrowserMock>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="gradient-brand py-16 text-primary-foreground sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl font-display">
                Ready to Automate Your Business?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                Connect your Google Business Profile once — Vizogen handles posts, reviews and
                ranking growth from there.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-background px-8 text-foreground shadow-soft transition-transform hover:scale-[1.03] hover:bg-background/90"
                >
                  <Link to="/login">
                    Go to Dashboard <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
