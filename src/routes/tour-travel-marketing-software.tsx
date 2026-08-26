import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { travelConfig } from "@/components/landing/industry-configs";

export const Route = createFileRoute("/tour-travel-marketing-software")({
  head: () => ({
    meta: [
      { title: travelConfig.seoTitle },
      { name: "description", content: travelConfig.seoDescription },
      { property: "og:title", content: travelConfig.seoTitle },
      { property: "og:description", content: travelConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TourTravelMarketingPage,
});

function TourTravelMarketingPage() {
  return <IndustryLandingPage config={travelConfig} />;
}
