import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { salonConfig } from "@/components/landing/industry-configs";

export const Route = createFileRoute("/salon-marketing-software")({
  head: () => ({
    meta: [
      { title: salonConfig.seoTitle },
      { name: "description", content: salonConfig.seoDescription },
      { property: "og:title", content: salonConfig.seoTitle },
      { property: "og:description", content: salonConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SalonMarketingPage,
});

function SalonMarketingPage() {
  return <IndustryLandingPage config={salonConfig} />;
}
