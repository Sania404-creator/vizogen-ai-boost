import { createFileRoute } from "@tanstack/react-router";
import { ApiShell, ApiCard, API_PRODUCTS } from "@/components/apis/api-page";
const title = "Vizogen APIs — WhatsApp API & Google Review API";
const description = "Buy Vizogen WhatsApp API and Google Review API with instant UPI payment.";
export const Route = createFileRoute("/apis/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => (<ApiShell title="Vizogen APIs"><div className="grid gap-6 md:grid-cols-2">{API_PRODUCTS.map((p) => <ApiCard key={p.slug} p={p} />)}</div></ApiShell>),
});
