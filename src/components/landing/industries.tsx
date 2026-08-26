import {
  Building2,
  Car,
  Croissant,
  Dumbbell,
  GraduationCap,
  Hammer,
  HeartPulse,
  Plane,
  Scissors,
  Bug,
  UtensilsCrossed,
  Flower2,
} from "lucide-react";
import { Reveal, SectionHeading } from "./reveal";

const industries: { label: string; icon: typeof Dumbbell; to?: string }[] = [
  { label: "Gyms", icon: Dumbbell, to: "/gym-marketing-software" },
  { label: "Clinics", icon: HeartPulse },
  { label: "Bakeries", icon: Croissant },
  { label: "Salons", icon: Scissors },
  { label: "Restaurants", icon: UtensilsCrossed },
  { label: "Pest Control", icon: Bug },
  { label: "Garages", icon: Car },
  { label: "Travel", icon: Plane },
  { label: "Yoga", icon: Flower2 },
  { label: "Handyman", icon: Hammer },
  { label: "Education", icon: GraduationCap },
  { label: "Real Estate", icon: Building2 },
];


export function Industries() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Industries"
          title="Built for Small Business Owners"
          subtitle="Whatever you run locally, Vizogen writes, schedules and replies like a full marketing team — tuned to your category."
        />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {industries.map((item, i) => (
            <Reveal key={item.label} delay={(i % 4) * 0.06}>
              <div className="gradient-border group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-primary transition-colors group-hover:gradient-brand group-hover:text-primary-foreground">
                  <item.icon className="size-5" />
                </span>
                <span className="min-w-0 truncate text-sm font-semibold text-foreground sm:text-base">
                  {item.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
