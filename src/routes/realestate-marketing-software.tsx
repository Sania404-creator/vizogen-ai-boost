import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { realEstateConfig } from "@/components/landing/industry-configs";

export const Route = createFileRoute("/realestate-marketing-software")({
  head: () => ({
    meta: [
      { title: realEstateConfig.seoTitle },
      { name: "description", content: realEstateConfig.seoDescription },
      { property: "og:title", content: realEstateConfig.seoTitle },
      { property: "og:description", content: realEstateConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RealEstateMarketingPage,
});

function RealEstateMarketingPage() {
  return <IndustryLandingPage config={realEstateConfig} />;
}
