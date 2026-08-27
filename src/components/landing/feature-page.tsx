import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal, SectionHeading } from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FeaturePageConfig = {
  slug: string;
  eyebrow: string;
  title: string;
  headline: React.ReactNode;
  subtitle: string;
  image: string;
  imageAlt: string;
  heroBadge: { value: string; label: string };
  stats: { value: string; label: string }[];
  how: { n: string; title: string; desc: string }[];
  capabilities: { icon: LucideIcon; title: string; desc: string }[];
  without: string[];
  withVizogen: string[];
  faqs: { q: string; a: string }[];
  ctaHeading: string;
  ctaText: string;
  ctaHref?: string;
};

function CtaButton({
  href,
  children,
  variant = "primary",
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  const isExternal = href?.startsWith("http");
  const className =
    variant === "primary"
      ? "rounded-xl"
      : "rounded-xl border-navy-foreground/20 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground";

  if (isExternal) {
    return (
      <Button asChild size="lg" variant={variant === "primary" ? "default" : "outline"} className={className}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" variant={variant === "primary" ? "default" : "outline"} className={className}>
      <Link to={href ?? "/demo"}>{children}</Link>
    </Button>
  );
}

export function FeaturePage({ config }: { config: FeaturePageConfig }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-24 size-[28rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              {config.eyebrow}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
              {config.headline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {config.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaButton href={config.ctaHref}>
                Start Free Demo <ArrowRight className="ml-1 size-4" />
              </CtaButton>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {config.stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
                  <dt className="font-mono text-xl font-bold text-foreground">{s.value}</dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.12} className="relative">
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lift">
              <img
                src={config.image}
                alt={config.imageAlt}
                width={1280}
                height={960}
                className="h-auto w-full"
              />
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl border border-border/70 bg-card p-4 shadow-lift sm:left-6">
              <p className="font-mono text-2xl font-bold text-gradient">{config.heroBadge.value}</p>
              <p className="text-xs font-medium text-muted-foreground">{config.heroBadge.label}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                From idea to <span className="text-gradient">live in minutes.</span>
              </>
            }
            subtitle="A simple flow your team can run every single week without training."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {config.how.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <span className="font-mono text-3xl font-bold text-primary/30">{s.n}</span>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="bg-accent/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What you get"
            title={
              <>
                Everything inside <span className="text-gradient">{config.title}</span>
              </>
            }
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {config.capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary">
                    <c.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Old way vs Vizogen"
            title={
              <>
                Stop doing it <span className="text-gradient">the hard way.</span>
              </>
            }
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Doing it manually
                </p>
                <ul className="mt-5 space-y-3">
                  {config.without.map((w) => (
                    <li key={w} className="flex gap-3 text-sm text-muted-foreground">
                      <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-primary/30 bg-card p-6 shadow-lift">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                  With Vizogen
                </p>
                <ul className="mt-5 space-y-3">
                  {config.withVizogen.map((w) => (
                    <li key={w} className="flex gap-3 text-sm text-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-accent/40 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Questions, answered." />
          <Reveal className="mt-10">
            <Accordion type="single" collapsible className="space-y-3">
              {config.faqs.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${i}`}
                  className="rounded-2xl border border-border/70 bg-card px-5 shadow-soft"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline sm:text-base">
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

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-navy p-10 text-center shadow-lift sm:p-16">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/25 blur-3xl"
              />
              <h2 className="relative text-balance text-3xl font-bold tracking-tight text-navy-foreground sm:text-4xl">
                {config.ctaHeading}
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-navy-foreground/70 sm:text-base">
                {config.ctaText}
              </p>
              <div className="relative mt-8 flex flex-wrap justify-center gap-3">
                <CtaButton href={config.ctaHref}>
                  Book your free demo <ArrowRight className="ml-1 size-4" />
                </CtaButton>
                <CtaButton href="/login" variant="outline">
                  Log in to Vizogen
                </CtaButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
