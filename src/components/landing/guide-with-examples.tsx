import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal, SectionHeading } from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";

export type GuideStep = { title: string; desc: string };
export type GuideExample = {
  icon: LucideIcon;
  title: string;
  label: string;
  sample: string;
};

export type GuideWithExamplesProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  steps: GuideStep[];
  examplesTitle: string;
  examplesSubtitle: string;
  examples: GuideExample[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaTo?: string;
  ctaLabel?: string;
  heroImage?: string;
  heroImageAlt?: string;
};


export function GuideWithExamples({
  eyebrow,
  title,
  highlight,
  subtitle,
  steps,
  examplesTitle,
  examplesSubtitle,
  examples,
  ctaTitle,
  ctaSubtitle,
  ctaTo = "/demo",
  ctaLabel = "Start Free Demo",
  heroImage,
  heroImageAlt,
}: GuideWithExamplesProps) {

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Header */}
        <section className="relative overflow-hidden pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-[360px] max-w-3xl rounded-full bg-brand/25 opacity-60 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                {eyebrow}
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:leading-[1.1] font-display">
                {title} <span className="text-gradient">{highlight}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Hero image */}
        {heroImage ? (
          <section className="pb-8 sm:pb-12">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lift">
                  <img
                    src={heroImage}
                    alt={heroImageAlt || ""}
                    className="w-full object-cover"
                    width={1024}
                    height={768}
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
          </section>
        ) : null}

        {/* Steps */}

        <section className="pb-20 sm:pb-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                How it works
              </p>
            </Reveal>
            <div className="relative mt-8">
              <div
                aria-hidden
                className="absolute bottom-10 left-9 top-10 w-px bg-border sm:left-11"
              />
              <div className="space-y-5">
                {steps.map((s, i) => (
                  <Reveal key={s.title} delay={i * 0.04}>
                    <div className="flex flex-col gap-5 rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:flex-row sm:items-start sm:gap-7 sm:p-7">
                      <span className="shrink-0 font-mono text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl font-display">
                          {s.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 10 Examples */}
        <section className="bg-card/60 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="10 Examples"
              title={examplesTitle}
              subtitle={examplesSubtitle}
            />
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {examples.map((ex, i) => (
                <Reveal key={ex.title} delay={(i % 3) * 0.08}>
                  <div className="gradient-border flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand dark:text-brand">
                        <ex.icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-primary">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <h3 className="truncate text-base font-bold text-foreground font-display">
                          {ex.title}
                        </h3>
                      </div>
                    </div>
                    <span className="mt-4 inline-flex w-fit items-center rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand dark:text-brand">
                      {ex.label}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      “{ex.sample}”
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="gradient-brand py-16 text-primary-foreground sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl font-display">
                {ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                {ctaSubtitle}
              </p>
              <div className="mt-8">
                {ctaTo?.startsWith("http") ? (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full gradient-brand px-8 text-primary-foreground shadow-lift transition-transform hover:scale-[1.03] hover:opacity-95"
                  >
                    <a href={ctaTo} target="_blank" rel="noopener noreferrer">
                      {ctaLabel} <ArrowRight className="size-4" />
                    </a>
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full gradient-brand px-8 text-primary-foreground shadow-lift transition-transform hover:scale-[1.03] hover:opacity-95"
                  >
                    <Link to={ctaTo}>
                      {ctaLabel} <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
