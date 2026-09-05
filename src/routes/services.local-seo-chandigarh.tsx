import { createFileRoute } from "@tanstack/react-router";
import { LocationSeoPage } from "@/components/landing/location-seo-page";
import { locationBySlug } from "@/components/landing/location-configs";
import { cityJsonLdScripts } from "@/lib/aeo";

const config = locationBySlug["chandigarh"]!;
const url = "https://www.vizogen.in/services/local-seo-chandigarh";

export const Route = createFileRoute("/services/local-seo-chandigarh")({
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
    scripts: cityJsonLdScripts(config),
  }),
  component: () => <LocationSeoPage config={config} />,
});
