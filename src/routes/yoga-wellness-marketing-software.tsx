import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { yogaConfig } from "@/components/landing/industry-configs";

export const Route = createFileRoute("/yoga-wellness-marketing-software")({
  head: () => ({
    meta: [
      { title: yogaConfig.seoTitle },
      { name: "description", content: yogaConfig.seoDescription },
      { property: "og:title", content: yogaConfig.seoTitle },
      { property: "og:description", content: yogaConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: YogaWellnessMarketingPage,
});

function YogaWellnessMarketingPage() {
  return <IndustryLandingPage config={yogaConfig} />;
}
