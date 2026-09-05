import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeading } from "./reveal";
import { locations } from "./location-configs";

const cities = locations.filter((l) => l.slug !== "gujarat");

function CityChip({ city, slug }: { city: string; slug: string }) {
  return (
    <Link
      to={`/services/local-seo-${slug}` as "/services/local-seo-ahmedabad"}
      aria-label={`Local SEO in ${city}`}
      className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border/70 bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-lift"
    >
      <MapPin className="size-4 text-primary" />
      {city}
    </Link>
  );
}

function Marquee({ reverse = false, duration = 34 }: { reverse?: boolean; duration?: number }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex w-max gap-3"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {[...cities, ...cities].map((loc, i) => (
          <CityChip key={`${loc.slug}-${i}`} city={loc.city} slug={loc.slug} />
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

export function Locations() {
  return (
    <section className="pb-20 sm:pb-28" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Serving Local Businesses Across India"
          subtitle="Local intent, local language, local ranking wins — city by city. Tap a city to see its plan."
        />
      </div>
      <div className="mt-10 space-y-3">
        <Marquee />
        <Marquee reverse duration={40} />
      </div>
    </section>
  );
}
