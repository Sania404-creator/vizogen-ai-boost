import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  MapPin,
  MessageSquare,
  Sparkles,
  Star,
  TrendingUp,
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
import type { LocationConfig } from "@/components/landing/location-configs";

const pillars = [
  {
    icon: MapPin,
    title: "Proximity",
    body: "Service areas, locality keywords and map-pin accuracy tuned to where your customers actually search from.",
  },
  {
    icon: Sparkles,
    title: "Relevance",
    body: "Categories, services and daily AI posts matched to real local search language, refreshed every 24 hours.",
  },
  {
    icon: Star,
    title: "Prominence",
    body: "Steady authentic review growth via Magic QR plus instant AI review replies that keep sentiment strong.",
  },
];

export function LocationSeoPage({ config }: { config: LocationConfig }) {
  const auditLink = whatsappLink(
    `Hi Vizogen, I'd like a free local SEO audit for my business in ${config.city}.`,
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-4xl rounded-full opacity-20 blur-3xl gradient-brand"
          />
          <div className="relative mx-auto max-w-4xl text-center">
            <Link
              to="/services/local-seo"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-primary shadow-soft"
            >
              <MapPin className="size-3.5" /> Local SEO · {config.region}
            </Link>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl">
              {config.headline}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {config.intro}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full rounded-full gradient-brand px-7 shadow-glow sm:w-auto"
              >
                <a href="https://login.vizogen.in/sign-in">Start Free Trial</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full rounded-full sm:w-auto">
                <a href={auditLink} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="size-4" /> Free {config.city} SEO audit
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* QUICK ANSWER (AEO/GEO direct-answer block) */}
        <section className="px-4 pb-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold text-primary">
                <BadgeCheck className="size-3.5" /> Quick answer
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-foreground sm:text-2xl">
                What is Vizogen in {config.city}?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {quickAnswer(config.city)}
              </p>
              <dl className="mt-6 space-y-4 border-t border-border pt-6">
                {aeoFaqs(config.city).map((f) => (
                  <div key={f.q}>
                    <dt className="text-sm font-semibold text-foreground">{f.q}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>



        {/* RANKING PILLARS */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="How we rank you"
              title={`What moves the map pack in ${config.city}`}
              subtitle="Google weighs three local signals. Vizogen automates all three, every day."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-glow">
                    <span className="grid size-11 place-items-center rounded-xl gradient-brand text-primary-foreground">
                      <p.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* AREAS + INDUSTRIES */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            <Reveal className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Areas we cover in {config.city}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {config.localInsight}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {config.neighbourhoods.map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                    >
                      <MapPin className="size-3.5 text-brand" />
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Businesses we work with
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {config.searchBehaviour}
                </p>
                <ul className="mt-6 space-y-3">
                  {config.industries.map((ind) => (
                    <li key={ind} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full gradient-brand">
                        <Check className="size-3 text-primary-foreground" strokeWidth={3} />
                      </span>
                      {ind}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="What's included"
              title={`Your ${config.city} local SEO workflow`}
              subtitle="Everything runs from one dashboard — no agency retainers, no manual posting."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Sparkles,
                  t: "Daily AI posts",
                  d: `Locally worded updates, offers and events published to your Google Business Profile automatically.`,
                },
                {
                  icon: Star,
                  t: "Review engine",
                  d: "Magic QR collects authentic reviews in-store, and AI replies to every review within minutes.",
                },
                {
                  icon: TrendingUp,
                  t: "Rank tracking",
                  d: `Track keyword positions and map visibility for ${config.city} searches week over week.`,
                },
                {
                  icon: BadgeCheck,
                  t: "Profile optimisation",
                  d: "Categories, services, attributes, hours, Q&A and photos kept complete and current.",
                },
              ].map((f, i) => (
                <Reveal key={f.t} delay={i * 0.07} className="h-full">
                  <div className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                      <f.icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">{f.t}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="FAQ"
              title={`${config.city} local SEO questions`}
              subtitle="Straight answers before you start."
            />
            <Reveal className="mt-10">
              <Accordion type="single" collapsible className="w-full">
                {config.faqs.map((f, i) => (
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

        <ServiceAreas activeSlug={config.slug} />

        {/* FINAL CTA */}
        <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
          <Reveal className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy to-primary/60 px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/20 blur-3xl"
              />
              <div className="relative">
                <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-navy-foreground sm:text-4xl">
                  Rank higher in {config.city}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-navy-foreground/75">
                  Vizogen is operated by NG Marketing Solution, Rajkot — serving businesses across{" "}
                  {config.region} and India.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild size="lg" className="rounded-full">
                    <a href="https://login.vizogen.in/sign-in">
                      Start Free Trial <ArrowRight className="size-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full">
                    <Link to="/pricing">View pricing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
