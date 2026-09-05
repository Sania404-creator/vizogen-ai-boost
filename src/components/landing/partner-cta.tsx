import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Handshake, IndianRupee, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/landing/reveal";

const perks = [
  {
    icon: IndianRupee,
    title: "Recurring Commission",
    body: "Earn on every client you bring — for as long as they stay subscribed to Vizogen.",
  },
  {
    icon: Users,
    title: "Ready-Made Sales Kit",
    body: "Branded proposals, demo scripts and pricing decks so you can start pitching from day one.",
  },
  {
    icon: BadgeCheck,
    title: "Official Partner Badge",
    body: "Get listed as a verified Vizogen partner and use the badge across your own marketing.",
  },
];

export function PartnerCta() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Partner Program"
          title="Grow your agency with Vizogen"
          subtitle="Agencies, freelancers and consultants resell Vizogen to their local clients and earn recurring income."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {perks.map((p, i) => (
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
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full rounded-full gradient-brand px-7 shadow-glow sm:w-auto">
            <Link to="/partner">
              <Handshake className="size-4" /> Become a Partner
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full rounded-full sm:w-auto">
            <Link to="/official-partner">
              Official Partner Program <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
