import { createFileRoute } from "@tanstack/react-router";
import { WALegalPage, PRIVACY } from "@/components/whatsapp-crm/legal";

const TITLE = "Privacy Policy | Vizogen.ai WhatsApp Marketing";
const DESC = "Privacy Policy for Vizogen.ai WhatsApp Marketing by NG Marketing Solution, Rajkot. How we collect, use and protect your data.";
const URL = "https://www.vizogen.in/whatsapp-crm/privacy-policy";

export const Route = createFileRoute("/whatsapp-crm_/privacy-policy")({
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
  component: () => <WALegalPage title="Privacy Policy" updated="16 November 2026" sections={PRIVACY} />,
});
