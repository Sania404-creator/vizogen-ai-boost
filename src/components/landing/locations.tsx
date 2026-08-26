import { MapPin } from "lucide-react";
import { Reveal, SectionHeading } from "./reveal";

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
];

export function Locations() {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Serving Local Businesses Across India"
          subtitle="Local intent, local language, local ranking wins — city by city."
        />
        <Reveal className="mt-10">
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {cities.map((city) => (
              <div
                key={city}
                className="flex shrink-0 snap-start items-center gap-2 rounded-full border border-border/70 bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
              >
                <MapPin className="size-4 text-primary" />
                {city}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
