import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Reveal, SectionHeading } from "./reveal";
import { locations } from "./location-configs";

const featured = ["ahmedabad", "gujarat", "rajkot"];

const ordered = [
  ...featured.map((s) => locations.find((l) => l.slug === s)!),
  ...locations.filter((l) => !featured.includes(l.slug)),
];

export function ServiceAreas({ activeSlug }: { activeSlug?: string }) {
  return (
    <section id="service-areas" className="py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Service Areas"
          title="Local SEO by City & Region"
          subtitle="Trusted by businesses across Ahmedabad, Gujarat and India. Pick your city for localized ranking strategies."
        />
        <Reveal className="mt-10">
          <div className="flex flex-wrap justify-center gap-3">
            {ordered.map((loc) => {
              const isFeatured = featured.includes(loc.slug);
              const active = loc.slug === activeSlug;
              return (
                <Link
                  key={loc.slug}
                  to={`/services/local-seo-${loc.slug}` as "/services/local-seo-ahmedabad"}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lift ${
                    active
                      ? "border-brand/60 bg-brand/10 text-brand"
                      : isFeatured
                        ? "border-brand/40 bg-card text-foreground"
                        : "border-border/70 bg-card text-foreground hover:text-brand"
                  }`}
                >
                  <MapPin className="size-4 text-brand" />
                  {loc.city}
                  {isFeatured ? (
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                      Featured
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
