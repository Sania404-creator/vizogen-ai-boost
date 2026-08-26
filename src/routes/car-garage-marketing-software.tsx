import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { garageConfig } from "@/components/landing/industry-configs";

export const Route = createFileRoute("/car-garage-marketing-software")({
  head: () => ({
    meta: [
      { title: garageConfig.seoTitle },
      { name: "description", content: garageConfig.seoDescription },
      { property: "og:title", content: garageConfig.seoTitle },
      { property: "og:description", content: garageConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CarGarageMarketingPage,
});

function CarGarageMarketingPage() {
  return <IndustryLandingPage config={garageConfig} />;
}
