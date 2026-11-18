import { createFileRoute } from "@tanstack/react-router";
import { ApiShell, ApiCard, API_PRODUCTS } from "@/components/apis/api-page";
const title = "Google Review API | Vizogen";
const description = "Buy Vizogen Google Review API to fetch and auto-reply to reviews, pay via UPI.";
export const Route = createFileRoute("/google-review-api")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => (<ApiShell title="Google Review API"><ApiCard p={API_PRODUCTS[1]!} detail /></ApiShell>),
});
