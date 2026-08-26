import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { educationConfig } from "@/components/landing/industry-configs";

export const Route = createFileRoute("/education-marketing-software")({
  head: () => ({
    meta: [
      { title: educationConfig.seoTitle },
      { name: "description", content: educationConfig.seoDescription },
      { property: "og:title", content: educationConfig.seoTitle },
      { property: "og:description", content: educationConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EducationMarketingPage,
});

function EducationMarketingPage() {
  return <IndustryLandingPage config={educationConfig} />;
}
