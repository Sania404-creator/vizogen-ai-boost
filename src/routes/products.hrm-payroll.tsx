import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonProductPage } from "@/components/products/coming-soon-page";
import { productBySlug, SITE } from "@/components/products/site.config";

const p = productBySlug("hrm-payroll");
const URL = "https://www.vizogen.in/products/hrm-payroll";

export const Route = createFileRoute("/products/hrm-payroll")({
  head: () => ({
    meta: [
      { title: p.seoTitle },
      { name: "description", content: p.seoDescription },
      { property: "og:title", content: p.seoTitle },
      { property: "og:description", content: p.seoDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: SITE.productSchema ? [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: `Vizogen ${p.name}`, description: p.seoDescription, brand: { "@type": "Brand", name: "Vizogen" }, url: URL }) }] : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  return <ComingSoonProductPage p={p} />;
}
