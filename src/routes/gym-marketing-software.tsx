import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { gymConfig } from "@/components/landing/industry-config";

export const Route = createFileRoute("/gym-marketing-software")({
  head: () => ({
    meta: [
      { title: gymConfig.seoTitle },
      { name: "description", content: gymConfig.seoDescription },
      { property: "og:title", content: gymConfig.seoTitle },
      { property: "og:description", content: gymConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GymMarketingPage,
});

function GymMarketingPage() {
  return <IndustryLandingPage config={gymConfig} />;
}
