import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { pestControlConfig } from "@/components/landing/industry-configs";

export const Route = createFileRoute("/pest-control-marketing-software")({
  head: () => ({
    meta: [
      { title: pestControlConfig.seoTitle },
      { name: "description", content: pestControlConfig.seoDescription },
      { property: "og:title", content: pestControlConfig.seoTitle },
      { property: "og:description", content: pestControlConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PestControlMarketingPage,
});

function PestControlMarketingPage() {
  return <IndustryLandingPage config={pestControlConfig} />;
}
