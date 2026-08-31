import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  MapPin,
  MessageSquare,
  PhoneCall,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal, SectionHeading } from "@/components/landing/reveal";
import { ServiceAreas } from "@/components/landing/service-areas";
import { whatsappLink } from "@/components/landing/industry-config";
import seoDashboard from "@/assets/seo-dashboard.jpg";
import stepRelevance from "@/assets/seo-step-relevance.jpg";
import stepFreshness from "@/assets/seo-step-freshness.jpg";
import stepTrust from "@/assets/seo-step-trust.jpg";

const title = "Local SEO Services — Rank Higher on Google | Vizogen";
const description =
  "AI-powered local SEO services: Google Business Profile optimization, local keyword ranking, review management and daily automated posts that push you into the Google Maps 3-Pack.";

export const Route = createFileRoute("/services/local-seo")({
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
  component: LocalSeoPage,
});

const auditLink = whatsappLink(
  "Hi Vizogen, I'd like a free local SEO audit for my business.",
);
const consultLink = whatsappLink(
  "Hi Vizogen, I'd like to book a free local SEO consultation.",
);

const explainerSteps = [
  {
    n: "01",
    title: "The Power of Relevance",
    concept:
      "Google ranks businesses based on how well their profile matches searches like \u201CBest Pizza Near Me\u201D or \u201CEmergency Plumber Near Me\u201D.",
    solution:
      "Our AI scans local search trends every 24 hours and automatically updates your business categories and keywords to match what customers are searching for right now.",
    image: stepRelevance,
  },
  {
    n: "02",
    title: "Signal of Freshness",
    concept:
      "Profiles that post regular updates, photos and offers are seen as \u201CActive\u201D and pushed to the top of Google Maps results.",
    solution:
      "You don't need to write a single word. Vizogen creates high-quality, SEO-optimized Google Posts daily, keeping your profile 100% active on autopilot.",
    image: stepFreshness,
  },
  {
    n: "03",
    title: "Building Trust & Authority",
    concept:
      "Google prioritizes businesses that respond to reviews quickly — it proves you're reliable and trusted with high customer engagement.",
    solution:
      "Our AI monitors your reviews 24/7. When a customer leaves feedback, Vizogen generates a professional, custom reply instantly — keeping your engagement score at the top of search results.",
    image: stepTrust,
  },
];

const included = [
  {
    icon: MapPin,
    title: "GBP Optimization",
    desc: "Optimize your business categories, keywords, services, photos and info for maximum visibility.",
  },
  {
    icon: Search,
    title: "Local Keyword Ranking",
    desc: "Rank for 'dentist near me' or 'best gym nearby' automatically with AI-driven keyword targeting.",
  },
  {
    icon: Star,
    title: "Reputation Management",
    desc: "Increase positive reviews and respond faster with AI automation.",
  },
  {
    icon: Sparkles,
    title: "AI Content & Posts",
    desc: "Automatically publish SEO-friendly Google posts and updates daily.",
  },
];

const simpleSteps = [
  {
    n: "01",
    title: "Connect Your Profile",
    desc: "Securely link your Google Business Profile with the Vizogen dashboard in one click.",
  },
  {
    n: "02",
    title: "AI Scan & Optimization",
    desc: "Our AI analyzes local competitors, fixes citation gaps and injects high-ranking keywords for your area.",
  },
  {
    n: "03",
    title: "Autopilot Growth",
    desc: "Vizogen starts publishing daily local posts and tracking your ranking metrics 24/7.",
  },
];

const comparison = [
  {
    label: "Review Response Time",
    vizogen: "Within seconds (AI)",
    agency: "24–48 hours",
    manual: "Days or forgotten",
  },
  {
    label: "Post Frequency",
    vizogen: "Daily / automated",
    agency: "Weekly or less",
    manual: "Rarely updated",
  },
  {
    label: "Keyword Optimization",
    vizogen: "Real-time AI scanning",
    agency: "Monthly reports",
    manual: "No tracking",
  },
  {
    label: "Multi-Location Control",
    vizogen: "Central dashboard",
    agency: "Extra retainer costs",
    manual: "Extremely difficult",
  },
];

const whyBullets = [
  "AI-powered 24/7 profile optimization",
  "Multi-location support from one dashboard",
  "Faster Google Maps growth",
  "Automated posting & review replies",
  "Easy-to-use analytics dashboard",
];

const trustStats = [
  { value: 500, suffix: "+", label: "Businesses managed" },
  { value: 10, suffix: "K+", label: "AI posts published" },
  { value: 2, suffix: "M+", label: "Search impressions" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "Average rating" },
];

const benefits = [
  {
    icon: Users,
    title: "More Leads",
    desc: "Connect with customers who are ready to buy right now, in your service area.",
  },
  {
    icon: TrendingUp,
    title: "Higher Visibility",
    desc: "Dominate the Local 3-Pack on Google Maps for the searches that matter.",
  },
  {
    icon: PhoneCall,
    title: "Increased Calls",
    desc: "Convert digital views into real visits, direction requests and phone calls.",
  },
];

const faqs = [
  {
    q: "What is the Google 3-Pack and why does it matter?",
    a: "The 3-Pack is the group of three businesses Google shows at the top of local results and Maps. Those three listings capture the majority of clicks, calls and direction requests, so moving into the 3-Pack usually has a bigger impact than any website change.",
  },
  {
    q: "How long does it take to see ranking improvements?",
    a: "Most profiles show measurable movement in impressions and map views within 2–4 weeks of daily posting and review activity. Competitive categories and dense city areas typically take 60–90 days for stable 3-Pack positions.",
  },
  {
    q: "Is it safe to automate my Google Profile posts using AI?",
    a: "Yes. Vizogen publishes through the official Google Business Profile API using your authorised connection, follows Google's content policies, and every post can be reviewed or edited before it goes live.",
  },
  {
    q: "Can I monitor multiple locations from one place?",
    a: "Yes. Add unlimited locations, each with its own keywords, posting schedule and review workflows, and compare their performance side by side in one dashboard.",
  },
  {
    q: "How does automated review management help my business?",
    a: "Fast, consistent replies increase engagement signals Google uses for ranking, and they reassure customers reading your profile. Vizogen drafts a tailored reply instantly and routes unhappy feedback privately so you can fix issues first.",
  },
  {
    q: "What local ranking signals do you optimize for?",
    a: "The three pillars of local ranking: Proximity (how close you are to the searcher, improved with service areas and location data), Relevance (categories, services, keywords and post content), and Prominence (reviews, engagement, activity and citations).",
  },
];

function Counter({
  to,
  decimals = 0,
  suffix,
  active,
}: {
  to: number;
  decimals?: number;
  suffix: string;
  active: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1600;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to]);

  return (
    <span className="font-mono">
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function LocalSeoPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* 1. HERO */}
        <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand/25 opacity-70 blur-3xl"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Local SEO Services
              </span>
              <h1 className="mt-5 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
                Local SEO Services That Help Your Business{" "}
                <span className="text-gradient">Rank Higher on Google</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Get more customers with AI-powered local SEO, Google Business Profile
                optimization, review management and location-based ranking strategies.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <a href={auditLink} target="_blank" rel="noreferrer">
                    Get Free SEO Audit <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="ghost" className="rounded-full">
                  <Link to="/demo">Watch Demo →</Link>
                </Button>
              </div>
              <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <BadgeCheck className="size-4 text-success" />
                Trusted by 500+ local businesses
              </p>
            </Reveal>

            <Reveal delay={0.12} className="relative">
              <div className="relative rounded-2xl border border-border/70 bg-card p-2.5 shadow-lift">
                <img
                  src={seoDashboard}
                  alt="Vizogen local SEO dashboard showing Google Maps ranking growth"
                  width={1280}
                  height={960}
                  className="w-full rounded-xl"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="absolute -bottom-5 -left-3 rounded-2xl border border-success/30 bg-card px-4 py-3 shadow-lift sm:-left-6"
              >
                <p className="font-mono text-xl font-bold text-success">+145%</p>
                <p className="text-xs font-medium text-muted-foreground">
                  Traffic — Google Maps
                </p>
              </motion.div>
            </Reveal>
          </div>
        </section>

        {/* 2. EXPLAINER ZIGZAG */}
        <section className="bg-card/60 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The Logic of Local"
              title="How Local SEO Works & How Vizogen Solves It"
              subtitle="Mastering the Google Maps algorithm doesn't have to be hard. Here's the logic behind local rankings and how we automate it for you."
            />

            <div className="mt-14 space-y-14 sm:space-y-20">
              {explainerSteps.map((s, i) => (
                <div
                  key={s.n}
                  className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
                >
                  <Reveal
                    className={i % 2 === 1 ? "lg:order-2" : ""}
                    delay={0.05}
                  >
                    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift sm:p-8">
                      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                        Step {s.n}
                      </p>
                      <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        {s.title}
                      </h3>
                      <div className="mt-6 space-y-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Local SEO Concept:
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {s.concept}
                          </p>
                        </div>
                        <div className="rounded-xl border border-brand/25 bg-brand/[0.07] p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-brand dark:text-brand">
                            Vizogen Solution:
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                            {s.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal
                    className={i % 2 === 1 ? "lg:order-1" : ""}
                    delay={0.12}
                  >
                    <div className="rounded-2xl border border-border/70 bg-card p-2 shadow-soft">
                      <img
                        src={s.image}
                        alt={`${s.title} — Vizogen local SEO automation`}
                        loading="lazy"
                        width={1200}
                        height={900}
                        className="w-full rounded-xl"
                      />
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. WHAT'S INCLUDED */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="What's Included"
              title="What's Included in Our Local SEO Service"
              subtitle="Everything your business needs to dominate local search results."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {included.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.07}>
                  <div className="h-full rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <span className="grid size-11 place-items-center rounded-xl bg-brand/15 text-brand dark:text-brand">
                      <f.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                      {f.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. 3 SIMPLE STEPS */}
        <section className="bg-card/60 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Getting Started"
              title="3 Simple Steps to Dominate Your Market"
              subtitle="Here's how we sync Vizogen with your business profile to start pushing you to the top of Google Maps."
            />
            <div className="relative mt-14">
              <div
                aria-hidden
                className="absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-primary/10 via-primary/60 to-primary/10 lg:block"
              />
              <div className="relative grid gap-6 lg:grid-cols-3">
                {simpleSteps.map((s, i) => (
                  <Reveal key={s.n} delay={i * 0.1}>
                    <div className="h-full rounded-2xl border border-border/70 bg-card p-7 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                      <span className="mx-auto grid size-14 place-items-center rounded-full bg-gradient-to-br from-primary to-violet-500 font-mono text-lg font-bold text-primary-foreground shadow-lift">
                        {s.n}
                      </span>
                      <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                        {s.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                        {s.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. COMPARISON TABLE */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Comparison"
              title="Why Businesses Choose Vizogen Over Traditional Agencies"
              subtitle="See how our automation stack saves time and keeps your profile updated 24/7."
            />
            <Reveal className="mt-12">
              <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card shadow-soft">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border/70">
                      <th className="p-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Capability
                      </th>
                      <th className="border-x border-brand/30 bg-brand/10 p-5 font-display text-base font-bold text-brand dark:text-brand">
                        Vizogen
                      </th>
                      <th className="p-5 font-display text-base font-bold text-foreground">
                        Traditional Agencies
                      </th>
                      <th className="p-5 font-display text-base font-bold text-foreground">
                        Manual Management
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="p-5 text-sm font-semibold text-foreground">
                          {row.label}
                        </td>
                        <td className="border-x border-brand/30 bg-brand/[0.07] p-5 text-sm font-semibold text-foreground">
                          <span className="flex items-center gap-2">
                            <Check className="size-4 shrink-0 text-success" />
                            {row.vizogen}
                          </span>
                        </td>
                        <td className="p-5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <X className="size-4 shrink-0 text-destructive/70" />
                            {row.agency}
                          </span>
                        </td>
                        <td className="p-5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <X className="size-4 shrink-0 text-destructive/70" />
                            {row.manual}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 6. LONG-FORM EXPLAINER */}
        <section className="bg-card/60 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Understanding Local SEO
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How Local SEO Works & Vizogen Makes You Unstoppable
              </h2>
            </Reveal>
            <div className="mt-7 max-w-[65ch] space-y-5 text-base leading-relaxed text-muted-foreground">
              <Reveal delay={0.05}>
                <p>
                  Local SEO is the work of making your business the obvious answer when
                  someone nearby searches for what you sell. Google decides that answer
                  from your business profile, not your website: your categories, services,
                  photos, hours, reviews and recent activity all feed the ranking that puts
                  you in — or out of — the Local 3-Pack on Maps.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>
                  Most businesses fail at this for one boring reason: nobody updates the
                  profile. It gets set up once, then sits untouched for months. Reviews go
                  unanswered for days, no posts go out, keywords drift away from what people
                  actually type, and competitors who post every week quietly take the top
                  three spots. It isn't a strategy problem — it's a consistency problem.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p>
                  Vizogen fixes the consistency. Our AI watches local search trends, keeps
                  your categories and keywords aligned with real demand, publishes an
                  SEO-optimized Google post every day, and drafts a professional reply the
                  moment a review lands. You get the daily discipline agencies charge a
                  retainer for, running automatically, with the ranking and engagement
                  numbers visible in one dashboard.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="mt-10">
              <h3 className="font-display text-lg font-bold text-foreground">
                Why Businesses Choose Vizogen for Local SEO
              </h3>
              <ul className="mt-4 space-y-3">
                {whyBullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-foreground/85">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* 7. TRUST STATS BAND */}
        <section className="bg-navy py-16 sm:py-20">
          <div
            ref={statsRef}
            className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8"
          >
            {trustStats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="text-center">
                <p className="font-display text-4xl font-bold text-brand sm:text-5xl">
                  <Counter
                    to={s.value}
                    decimals={s.decimals ?? 0}
                    suffix={s.suffix}
                    active={statsInView}
                  />
                </p>
                <p className="mt-2 text-sm font-medium text-navy-foreground/70">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 8. KEY BENEFITS */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Key Benefits"
              title="Key Benefits of Local SEO"
              subtitle="We help your business appear in Google Maps rankings and local search results when nearby customers search for your services."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <span className="grid size-11 place-items-center rounded-xl bg-brand/15 text-brand dark:text-brand">
                      <b.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                      {b.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {b.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FAQ */}
        <section className="bg-card/60 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="FAQ"
              title="Local SEO & Google Maps FAQ"
              subtitle="Everything businesses need to know about optimizing their Google Business Profile and ranking higher in local search."
            />
            <Reveal className="mt-10">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`}>
                    <AccordionTrigger className="text-left text-base font-semibold">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        <ServiceAreas />

        {/* 11. FINAL CTA */}
        <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
          <Reveal className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy to-primary/60 px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/20 blur-3xl"
              />
              <div className="relative">
                <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-navy-foreground sm:text-4xl">
                  Ready to Grow Your Business?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-navy-foreground/75">
                  Let Vizogen automate your local SEO and help your business rank higher on
                  Google Maps. No long-term contracts.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild size="lg" className="rounded-full">
                    <a href="https://login.vizogen.in/sign-in">
                      Start Free Trial <ArrowRight className="size-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-navy-foreground/25 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
                  >
                    <a href={consultLink} target="_blank" rel="noreferrer">
                      <MessageSquare className="size-4" /> Book Free Consultation
                    </a>
                  </Button>
                </div>
                <p className="mt-6 flex items-center justify-center gap-2 text-sm text-navy-foreground/70">
                  <Star className="size-4 fill-brand text-brand" /> Rated 4.9/5 by
                  small business owners
                </p>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
