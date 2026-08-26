import { createFileRoute } from "@tanstack/react-router";
import { GuidePlaceholder, guideHead } from "@/components/landing/guide-placeholder";

export const Route = createFileRoute("/how-to-create-post")({
  head: guideHead(
    "How to Create an AI Post — Vizogen",
    "Learn how Vizogen generates on-brand AI posts for your Google Business Profile in seconds.",
  ),
  component: () => (
    <GuidePlaceholder
      eyebrow="AI Post Guide"
      title="Create AI Post"
      description="This walkthrough is being written. In the meantime, connect your Google Business Profile and Vizogen will start drafting daily posts for you automatically."
    />
  ),
});
