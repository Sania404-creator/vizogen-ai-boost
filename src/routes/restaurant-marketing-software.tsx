import { createFileRoute } from "@tanstack/react-router";
import { IndustryLandingPage } from "@/components/landing/industry-landing-page";
import { restaurantConfig } from "@/components/landing/industry-configs";

export const Route = createFileRoute("/restaurant-marketing-software")({
  head: () => ({
    meta: [
      { title: restaurantConfig.seoTitle },
      { name: "description", content: restaurantConfig.seoDescription },
      { property: "og:title", content: restaurantConfig.seoTitle },
      { property: "og:description", content: restaurantConfig.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RestaurantMarketingPage,
});

function RestaurantMarketingPage() {
  return <IndustryLandingPage config={restaurantConfig} />;
}
