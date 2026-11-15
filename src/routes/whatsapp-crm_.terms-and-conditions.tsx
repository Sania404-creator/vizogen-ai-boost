import { createFileRoute } from "@tanstack/react-router";
import { WALegalPage, TERMS } from "@/components/whatsapp-crm/legal";

const TITLE = "Terms & Conditions | Vizogen.ai WhatsApp Marketing";
const DESC = "Terms & Conditions for Vizogen.ai WhatsApp Marketing by NG Marketing Solution, Rajkot. All payments are non-refundable.";
const URL = "https://www.vizogen.in/whatsapp-crm/terms-and-conditions";

export const Route = createFileRoute("/whatsapp-crm_/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: () => <WALegalPage title="Terms & Conditions" updated="16 November 2026" sections={TERMS} />,
});
