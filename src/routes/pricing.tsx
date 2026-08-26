import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Pricing } from "@/components/landing/pricing";

const title = "Vizogen Pricing — Plans That Grow With Your Business";
const description =
  "Transparent Vizogen pricing in INR or USD: Starter, Growth and Pro plans for AI Google Business Profile posts, review replies, Magic QR and rank tracking.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
