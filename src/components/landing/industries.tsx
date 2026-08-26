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
import { Link } from "@tanstack/react-router";
import { Reveal, SectionHeading } from "./reveal";


const industries: { label: string; icon: typeof Dumbbell; to?: string }[] = [
  { label: "Gym & Fitness Centres", icon: Dumbbell, to: "/gym-marketing-software" },
  { label: "Doctors & Health Clinics", icon: HeartPulse, to: "/clinic-marketing-software" },
  { label: "Bakers & Cake Shops", icon: Croissant, to: "/bakery-marketing-software" },
  { label: "Salon Owners", icon: Scissors, to: "/salon-marketing-software" },
  { label: "Restaurants & Bars", icon: UtensilsCrossed, to: "/restaurant-marketing-software" },
  { label: "Pest Control Businesses", icon: Bug, to: "/pest-control-marketing-software" },
  { label: "Car Garages & Mechanics", icon: Car, to: "/car-garage-marketing-software" },
  { label: "Tours & Travels", icon: Plane, to: "/tour-travel-marketing-software" },
  { label: "Yoga & Wellness", icon: Flower2, to: "/yoga-wellness-marketing-software" },
  { label: "Handyman Services", icon: Hammer, to: "/handyman-marketing-software" },
  { label: "Education & Coaching", icon: GraduationCap, to: "/education-marketing-software" },
  { label: "Real Estate Agents", icon: Building2, to: "/realestate-marketing-software" },
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
          {industries.map((item, i) => {
            const card = (
              <div className="gradient-border group flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-primary transition-colors group-hover:gradient-brand group-hover:text-primary-foreground">
                  <item.icon className="size-5" />
                </span>
                <span className="min-w-0 truncate text-sm font-semibold text-foreground sm:text-base">
                  {item.label}
                </span>
              </div>
            );
            return (
              <Reveal key={item.label} delay={(i % 4) * 0.06}>
                {item.to ? (
                  <Link to={item.to} className="block h-full">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </Reveal>
            );
          })}

        </div>
      </div>
    </section>
  );
}
