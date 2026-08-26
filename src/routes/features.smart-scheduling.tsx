import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/landing/feature-page";
import { smartScheduling } from "@/components/landing/feature-configs";

const title = "Smart Scheduling for Google Business Profile Posts — Vizogen";
const description =
  "Plan and auto-publish Google Business Profile posts at peak local hours with Vizogen Smart Scheduling — visual calendar, recurring campaigns and multi-location queues.";

export const Route = createFileRoute("/features/smart-scheduling")({
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
  component: () => <FeaturePage config={smartScheduling} />,
});
