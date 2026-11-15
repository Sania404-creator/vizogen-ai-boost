import { createFileRoute } from "@tanstack/react-router";
import { IndiaGrowthPage } from "@/components/whatsapp-crm/india-growth-page";

const TITLE = "3X Revenue with Official WhatsApp Marketing | Vizogen.ai India Growth Offer";
const DESC = "Official WhatsApp API with bulk broadcasting, retargeting, in-chat UPI payments, AI templates and free expert setup. Go live in 30 minutes. Cancel anytime.";
const URL = "https://www.vizogen.in/india-growth";

export const Route = createFileRoute("/india-growth")({
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
  }),
  component: IndiaGrowthPage,
});
