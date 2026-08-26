import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/landing/feature-page";
import { reviewManagement } from "@/components/landing/feature-configs";

const title = "AI Review Management for Google Reviews — Vizogen";
const description =
  "Reply to every Google review in minutes with Vizogen — one review inbox, AI-drafted personalised replies, negative-review alerts and rating analytics.";

export const Route = createFileRoute("/features/review-management")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <FeaturePage config={reviewManagement} />,
});
