import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal, SectionHeading } from "@/components/landing/reveal";
import { ArrowRight, Shield, Zap, RefreshCw, BrainCircuit } from "lucide-react";
import openaiAsset from "@/assets/openai-logo.jpg.asset.json";
import googleAsset from "@/assets/google-g.png.asset.json";

const title = "Official Partner Integrations — Vizogen";
const description =
  "Vizogen is powered by Google's official Business Profile API and OpenAI's language models, giving you secure, real-time, AI-driven local marketing automation.";

const partners = [
  {
    name: "Google Business Profile API",
    logo: googleAsset.url,
    alt: "Google logo",
    headline: "Built on Google's official API",
    body: "Read, manage and publish to your Google Business Profile in real time through Google's secure, authorized Business Profile API.",
    href: "https://developers.google.com/my-business",
  },
  {
    name: "OpenAI",
    logo: openaiAsset.url,
    alt: "OpenAI logo",
    headline: "Powered by OpenAI",
    body: "Generate daily posts, review replies and local SEO copy with OpenAI's language models — tuned for your industry and brand voice.",
    href: "https://openai.com",
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Secure OAuth access",
    text: "Your Google account connection uses official OAuth 2.0 flows — we never store your Google password.",
  },
  {
    icon: RefreshCw,
    title: "Real-time profile sync",
    text: "Posts, photos, hours and review responses sync directly with Google so your profile stays accurate and up to date.",
  },
  {
    icon: BrainCircuit,
    title: "AI content you control",
    text: "OpenAI-generated drafts are customized by industry, tone and keywords. Review and edit everything before it goes live.",
  },
  {
    icon: Zap,
    title: "Enterprise-grade reliability",
    text: "Built on the same APIs trusted by thousands of businesses, with rate-aware queues and retry logic built in.",
  },
];

export const Route = createFileRoute("/official-partner")({
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
  component: OfficialPartnerPage,
});

function OfficialPartnerPage() {
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
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Trusted Technology
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Built on{" "}
                <span className="text-gradient">Official APIs</span> You Can
                Trust
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Vizogen is powered by Google's official Business Profile API and
                OpenAI's language models — giving you secure, real-time,
                AI-driven local marketing automation.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/demo"
                  className="group inline-flex items-center gap-2 rounded-xl gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
                >
                  Start Free Trial
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  View Pricing
                </Link>
              </div>
            </Reveal>

            {/* Partner cards */}
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
              {partners.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.12}>
                  <motion.a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -4 }}
                    className="group flex h-full flex-col items-start rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift"
                  >
                    <div className="flex w-full items-center justify-between gap-4">
                      <img
                        src={p.logo}
                        alt={p.alt}
                        className="h-10 w-auto max-w-[150px] object-contain grayscale transition duration-300 group-hover:grayscale-0"
                        loading="lazy"
                      />
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        Official API
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-foreground">
                      {p.headline}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                    <span className="mt-auto pt-5 text-sm font-semibold text-primary">
                      Learn more{" "}
                      <ArrowRight className="ml-1 inline size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </motion.a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Why It Matters"
              title="Security, speed and AI — by design"
              subtitle="We use the official APIs so your data stays safe, your profile stays fresh, and your content keeps converting."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                    <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <b.icon className="size-5" />
                    </div>
                    <h4 className="mt-4 text-base font-bold text-foreground">
                      {b.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {b.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
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
                    <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      Start automating with official APIs today
                    </h3>
                    <p className="mt-3 text-primary-foreground/80">
                      Join businesses using Vizogen to rank higher, win local
                      customers and save hours every week.
                    </p>
                  </div>
                  <Link
                    to="/demo"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-navy shadow-soft transition-transform hover:scale-[1.02]"
                  >
                    Book a Free Demo
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
