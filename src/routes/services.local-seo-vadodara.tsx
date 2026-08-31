import { createFileRoute } from "@tanstack/react-router";
import { LocationSeoPage } from "@/components/landing/location-seo-page";
import { locationBySlug } from "@/components/landing/location-configs";

const config = locationBySlug["vadodara"]!;
const url = "https://seo.vizogen.in/services/local-seo-vadodara";

export const Route = createFileRoute("/services/local-seo-vadodara")({
  head: () => ({
    meta: [
      { title: config.metaTitle },
      { name: "description", content: config.metaDescription },
      { name: "keywords", content: config.keywords.join(", ") },
      { property: "og:title", content: config.metaTitle },
      { property: "og:description", content: config.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: config.metaTitle },
      { name: "twitter:description", content: config.metaDescription },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Local SEO and Google Business Profile Management",
          name: config.metaTitle,
          description: config.metaDescription,
          areaServed: { "@type": "Place", name: config.city + ", " + config.region },
          provider: {
            "@type": "Organization",
            name: "Vizogen",
            alternateName: "NG Marketing Solution",
            url: "https://vizogen.in",
          },
        }),
      },
    ],
  }),
  component: () => <LocationSeoPage config={config} />,
});
