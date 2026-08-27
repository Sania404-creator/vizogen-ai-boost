import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal } from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";
import {
  BrowserFrame,
  BusinessBanner,
  DashboardShell,
  GoogleChooserMock,
  GoogleConsentMock,
  PerformanceGrid,
  QuickConnectRow,
} from "@/components/landing/dashboard-mock";

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
  mock: ReactNode;
};

const steps: Step[] = [
  {
    n: "01",
    title: "Log into Vizogen",
    desc: "Go to login.vizogen.in and sign in with your Vizogen credentials to access your dashboard.",
    cta: { label: "Go to Login Page", to: "/login" },
    url: "app.vizogen.ai/dashboard",
    mock: (
      <DashboardShell>
        <BusinessBanner />
        <QuickConnectRow />
      </DashboardShell>
    ),
  },
  {
    n: "02",
    title: "Open Google Business from Quick Connect",
    desc: "On your Dashboard, scroll to the 'Quick Connect' section and click 'MANAGE' on the 'Google Business' card.",
    cta: { label: "Go to Dashboard", to: "/login" },
    url: "app.vizogen.ai/dashboard",
    mock: (
      <DashboardShell>
        <QuickConnectRow highlightGoogle />
      </DashboardShell>
    ),
  },
  {
    n: "03",
    title: "Sign in with Your Google Account",
    desc: "A secure Google window will open. Sign in with the exact Gmail address that manages your Google Business Profile so Vizogen can find the right listing.",
    callout: {
      tone: "amber",
      text: "Crucial Step: Must be the admin/owner email of the GBP profile.",
    },
    url: "accounts.google.com/signin",
    mock: <GoogleChooserMock />,
  },
  {
    n: "04",
    title: "Review & Allow Permissions",
    desc: "Google will show what Vizogen can access. Tick the checkbox for 'See, edit, create and delete your Google business listings' and click Continue.",
    callout: {
      tone: "amber",
      text: "Do not skip: the checkbox must be ticked before clicking Continue.",
    },
    url: "accounts.google.com/o/oauth2/consent",
    mock: <GoogleConsentMock />,
  },
  {
    n: "05",
    title: "Your Profile Appears as 'Connected'",
    desc: "Back in Vizogen, your business card banner will now show a green 'Connected' status pill next to your business name, with the address and Google 'G' logo displayed.",
    url: "app.vizogen.ai/dashboard",
    mock: (
      <DashboardShell>
        <BusinessBanner highlight />
      </DashboardShell>
    ),
  },
  {
    n: "06",
    title: "Explore Your Dashboard",
    desc: "All your business listings now sync automatically. Scroll down to see your 'Performance' stats — Map Impressions, Call Clicks, Website Clicks, Directions, Reviews and Avg. Rating — updating in real time.",
    cta: { label: "Go to Dashboard", to: "/login" },
    url: "app.vizogen.ai/dashboard",
    mock: (
      <DashboardShell>
        <PerformanceGrid />
      </DashboardShell>
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
        {/* Header block */}
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
                How to Connect Your{" "}
                <span className="text-gradient">Google Business Profile</span> to Vizogen
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Follow these simple steps to securely link your Google Business Profile (GBP) to
                your Vizogen dashboard and unlock AI-powered automation.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Steps */}
        <section className="pb-20">
          <div ref={railRef} className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
                    <div className="absolute left-0 top-1 grid size-[52px] place-items-center rounded-2xl gradient-brand font-mono text-sm font-bold text-primary-foreground shadow-glow sm:size-[60px] sm:text-base lg:left-1/2 lg:-translate-x-1/2">
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
                          className="pointer-events-none absolute -left-2 -top-10 select-none font-mono text-[5.5rem] font-bold leading-none text-foreground/[0.045] sm:text-[7rem]"
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
                                : "border-[oklch(0.75_0.15_75)]/40 bg-[oklch(0.75_0.15_75)]/10 text-[oklch(0.52_0.13_65)]"
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
                            <Button asChild variant="outline" className="rounded-full">
                              {s.cta.to ? (
                                <Link to={s.cta.to}>
                                  {s.cta.label} <ArrowRight className="size-4" />
                                </Link>
                              ) : (
                                <a href={s.cta.href} target="_blank" rel="noreferrer">
                                  {s.cta.label} <ArrowRight className="size-4" />
                                </a>
                              )}
                            </Button>
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
                        <BrowserFrame url={s.url}>{s.mock}</BrowserFrame>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-navy via-navy to-brand-2/40 py-16 text-navy-foreground sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl font-display">
                Ready to Automate Your Business?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-navy-foreground/70 sm:text-base">
                Connect your Google Business Profile once — Vizogen handles posts, reviews and
                ranking growth from there.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full gradient-brand px-8 shadow-glow transition-transform hover:scale-[1.03]"
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
