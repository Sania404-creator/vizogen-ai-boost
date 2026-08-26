import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/landing/feature-page";
import { aiPostGeneration } from "@/components/landing/feature-configs";

const title = "AI Post Generation for Google Business Profile — Vizogen";
const description =
  "Generate on-brand Google Business Profile posts in seconds with Vizogen AI — local keywords, matching visuals, multi-language output and bulk monthly content.";

export const Route = createFileRoute("/features/ai-post-generation")({
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
  component: () => <FeaturePage config={aiPostGeneration} />,
});
