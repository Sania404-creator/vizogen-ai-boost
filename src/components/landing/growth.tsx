import { motion } from "motion/react";
import { Reveal, SectionHeading } from "./reveal";

const cards = [
  { label: "Profile Views", before: "1,240", now: "6,930", delta: "+459%", bar: 92 },
  { label: "Search Impressions", before: "8,410", now: "39,220", delta: "+366%", bar: 84 },
  { label: "Customer Calls", before: "68", now: "412", delta: "+506%", bar: 96 },
  { label: "New Reviews", before: "11", now: "127", delta: "+1054%", bar: 78 },
];

export function Growth() {
  return (
    <section className="bg-card/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Growth data"
          title="Real User GMB Profile Growth — Last 3 Months"
          subtitle="Averaged across active Vizogen profiles running daily posts and review automation."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <p className="min-w-0 text-sm font-semibold text-muted-foreground">
                    {c.label}
                  </p>
                  <span className="shrink-0 rounded-full bg-success/12 px-2.5 py-1 text-xs font-bold text-success">
                    {c.delta}
                  </span>
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
                  Before
                </p>
                <p className="text-lg font-semibold text-muted-foreground">{c.before}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-widest text-primary">
                  Now
                </p>
                <p className="text-4xl font-bold tracking-tight text-foreground font-display">
                  {c.now}
                </p>
                <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-accent">
                  <motion.div
                    className="h-full rounded-full gradient-brand"
                    initial={{ width: "8%" }}
                    whileInView={{ width: `${c.bar}%` }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
