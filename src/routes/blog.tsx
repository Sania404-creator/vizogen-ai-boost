import { createFileRoute } from "@tanstack/react-router";
import { GuidePlaceholder, guideHead } from "@/components/landing/guide-placeholder";

export const Route = createFileRoute("/blog")({
  head: guideHead(
    "Blog — Local SEO & GBP Growth Insights | Vizogen",
    "Playbooks, benchmarks and product updates on Google Business Profile automation and local ranking growth.",
  ),
  component: () => (
    <GuidePlaceholder
      eyebrow="Vizogen Blog"
      title="Local growth insights"
      description="Our first playbooks on Google Business Profile automation, review velocity and local ranking are on the way. Check back soon."
    />
  ),
});
