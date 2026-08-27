import { CalendarClock, MessageSquareHeart, QrCode, Wand2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal, SectionHeading } from "./reveal";

const features = [
  {
    n: "01",
    icon: Wand2,
    title: "AI Post Generation",
    href: "/features/ai-post-generation",
    copy: "Create engaging posts instantly with AI.",
  },
  {
    n: "02",
    icon: CalendarClock,
    title: "Smart Scheduling",
    href: "/features/smart-scheduling",
    copy: "Auto-schedule posts at optimal times.",
  },
  {
    n: "03",
    icon: MessageSquareHeart,
    title: "Review Management",
    href: "/features/review-management",
    copy: "Respond to reviews with AI-powered suggestions.",
  },
  {
    n: "04",
    icon: QrCode,
    title: "Magic QR",
    href: "https://login.vizogen.in/magic-qr",
    external: true,
    copy: "Filter negative reviews with smart QR technology.",
  },
];

function FeatureCard({
  f,
  i,
}: {
  f: (typeof features)[number];
  i: number;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-primary transition-colors group-hover:gradient-brand group-hover:text-primary-foreground">
          <f.icon className="size-5" />
        </span>
        <span className="text-sm font-bold tracking-widest text-muted-foreground/60 font-display">
          {f.n}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {f.copy}
      </p>
      <span className="mt-5 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
        Explore →
      </span>
    </>
  );

  return (
    <Reveal delay={i * 0.08}>
      {f.external ? (
        <a
          href={f.href}
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-border group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-lift"
        >
          {body}
        </a>
      ) : (
        <Link
          to={f.href}
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-border group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-lift"
        >
          {body}
        </Link>
      )}
    </Reveal>
  );
}

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Core features"
          title={
            <>
              Built to <span className="text-gradient">dominate.</span>
            </>
          }
          subtitle="Four systems working together to keep your profile active, reviewed and ranking."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <FeatureCard key={f.n} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
