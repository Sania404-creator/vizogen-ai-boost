import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeading } from "./reveal";

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Gurgaon",
  "Kolkata",
  "Noida",
  "Chandigarh",
  "Jaipur",
  "Surat",
  "Rajkot",
  "Ahmedabad",
  "Pune",
  "Indore",
];

function CityChip({ city }: { city: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-full border border-border/70 bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-soft transition-colors duration-300 hover:border-primary/40">
      <MapPin className="size-4 text-primary" />
      {city}
    </div>
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
        {[...cities, ...cities].map((city, i) => (
          <CityChip key={`${city}-${i}`} city={city} />
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
          subtitle="Local intent, local language, local ranking wins — city by city."
        />
      </div>
      <div className="mt-10 space-y-3">
        <Marquee />
        <Marquee reverse duration={40} />
      </div>
    </section>
  );
}
