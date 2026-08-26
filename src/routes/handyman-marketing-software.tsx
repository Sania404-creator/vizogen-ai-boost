import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { handymanConfig } from "@/components/landing/industry-configs";

export const Route = createFileRoute("/handyman-marketing-software")({
  head: () => ({
    meta: [
      { title: handymanConfig.seoTitle },
      { name: "description", content: handymanConfig.seoDescription },
      { property: "og:title", content: handymanConfig.seoTitle },
      { property: "og:description", content: handymanConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HandymanMarketingPage,
});

function HandymanMarketingPage() {
  return <IndustryLandingPage config={handymanConfig} />;
}
