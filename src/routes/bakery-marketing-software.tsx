import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { bakeryConfig } from "@/components/landing/industry-configs";

export const Route = createFileRoute("/bakery-marketing-software")({
  head: () => ({
    meta: [
      { title: bakeryConfig.seoTitle },
      { name: "description", content: bakeryConfig.seoDescription },
      { property: "og:title", content: bakeryConfig.seoTitle },
      { property: "og:description", content: bakeryConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BakeryMarketingPage,
});

function BakeryMarketingPage() {
  return <IndustryLandingPage config={bakeryConfig} />;
}
