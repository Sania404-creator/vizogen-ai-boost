import { createFileRoute } from "@tanstack/react-router";
import { WhatsAppCrmPage } from "@/components/whatsapp-crm/page";
import { WA } from "@/components/whatsapp-crm/config";

const TITLE = "Vizogen.ai | Unified WhatsApp & Instagram CRM & Chatbot Automation";
const DESC =
  "Vizogen.ai is the unified inbox for WhatsApp, Instagram and Messenger. Build no-code chatbots, send broadcast campaigns and scale your brand effortlessly.";
const URL = "https://www.vizogen.in/whatsapp-crm";

export const Route = createFileRoute("/whatsapp-crm")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "WhatsApp CRM, Instagram DM automation, WhatsApp chatbot, unified inbox, WhatsApp Business API, customer support automation, Vizogen" },
      { name: "theme-color", content: "#000000" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "product" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: WA.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }),
      },
    ],
  }),
  component: WhatsAppCrmPage,
});
