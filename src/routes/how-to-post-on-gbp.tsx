import { createFileRoute } from "@tanstack/react-router";
import { GuidePlaceholder, guideHead } from "@/components/landing/guide-placeholder";

export const Route = createFileRoute("/how-to-post-on-gbp")({
  head: guideHead(
    "How to Post on GBP — Vizogen",
    "Publish and schedule posts to your Google Business Profile from Vizogen in a few clicks.",
  ),
  component: () => (
    <GuidePlaceholder
      eyebrow="Publishing Guide"
      title="Post on GBP"
      description="This walkthrough is being written. Vizogen schedules and publishes posts to every connected location, so your listings never go quiet."
    />
  ),
});
