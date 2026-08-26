import { createFileRoute } from "@tanstack/react-router";
import { GuidePlaceholder, guideHead } from "@/components/landing/guide-placeholder";

export const Route = createFileRoute("/how-to-reply-review")({
  head: guideHead(
    "How to Reply to Reviews — Vizogen",
    "See how Vizogen auto-replies to Google reviews with personalised, on-brand responses within minutes.",
  ),
  component: () => (
    <GuidePlaceholder
      eyebrow="Review Guide"
      title="Reply to Reviews"
      description="This walkthrough is being written. Once your profile is connected, Vizogen drafts and posts review replies for you — you stay in control of tone and approvals."
    />
  ),
});
