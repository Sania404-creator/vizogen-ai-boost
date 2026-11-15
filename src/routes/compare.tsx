import { createFileRoute } from "@tanstack/react-router";
import { ComparePage } from "@/components/whatsapp-crm/compare-page";
import { WA } from "@/components/whatsapp-crm/config";

const TITLE = "Compare Plans | Vizogen.ai WhatsApp CRM – Starter, Business, Pro";
const DESC = "Compare Vizogen.ai Starter, Business and Pro plans side by side: contacts, audience segments, chatbots, Shopify, unified inbox and AI Studio, monthly or yearly.";
const URL = "https://www.vizogen.in/compare";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: WA.pricing.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }],
  }),
  component: ComparePage,
});
