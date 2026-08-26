import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { clinicConfig } from "@/components/landing/industry-configs";

export const Route = createFileRoute("/clinic-marketing-software")({
  head: () => ({
    meta: [
      { title: clinicConfig.seoTitle },
      { name: "description", content: clinicConfig.seoDescription },
      { property: "og:title", content: clinicConfig.seoTitle },
      { property: "og:description", content: clinicConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClinicMarketingPage,
});

function ClinicMarketingPage() {
  return <IndustryLandingPage config={clinicConfig} />;
}
