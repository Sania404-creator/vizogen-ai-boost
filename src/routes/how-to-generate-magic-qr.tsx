import { createFileRoute } from "@tanstack/react-router";
import { GuidePlaceholder, guideHead } from "@/components/landing/guide-placeholder";

export const Route = createFileRoute("/how-to-generate-magic-qr")({
  head: guideHead(
    "How to Generate a Magic QR — Vizogen",
    "Generate a Magic QR code that sends walk-in customers straight to your Google review form.",
  ),
  component: () => (
    <GuidePlaceholder
      eyebrow="Magic QR Guide"
      title="Generate Magic QR"
      description="This walkthrough is being written. Magic QR turns any counter, receipt or table tent into a one-tap path to a fresh 5-star Google review."
    />
  ),
});
