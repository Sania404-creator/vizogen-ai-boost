import { createFileRoute } from "@tanstack/react-router";
import { ApiShell, ApiCard, API_PRODUCTS } from "@/components/apis/api-page";
const title = "WhatsApp API | Vizogen";
const description = "Buy the official WhatsApp Business API from Vizogen and pay instantly via UPI.";
export const Route = createFileRoute("/whatsapp-api")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => (<ApiShell title="WhatsApp API" green><ApiCard p={API_PRODUCTS[0]!} detail /></ApiShell>),
});
