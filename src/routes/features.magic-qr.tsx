import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/landing/feature-page";
import { magicQr } from "@/components/landing/feature-configs";

const title = "Magic QR — Collect More 5-Star Google Reviews | Vizogen";
const description =
  "Vizogen Magic QR routes happy customers to your Google review page and unhappy ones to a private feedback form — branded codes, per-location tracking and scan analytics.";

export const Route = createFileRoute("/features/magic-qr")({
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
  component: () => <FeaturePage config={magicQr} />,
});
