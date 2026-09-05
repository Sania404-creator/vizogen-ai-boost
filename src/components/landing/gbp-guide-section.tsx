import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/landing/reveal";
import { gbpGuideLinks } from "@/components/landing/gbp-guide-menu";

export function GbpGuideSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="GBP Guide"
          title="Free step-by-step Google Business Profile guides"
          subtitle="Everything you need to connect, post, reply and collect reviews the right way."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gbpGuideLinks.map((g, i) => (
            <Reveal key={g.to} delay={i * 0.06} className="h-full">
              <Link
                to={g.to}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-glow"
              >
                <span className="grid size-11 place-items-center rounded-xl gradient-brand text-primary-foreground">
                  <g.icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-foreground">{g.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {g.subtitle ?? "Read the full walkthrough with real examples."}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  Read guide
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
