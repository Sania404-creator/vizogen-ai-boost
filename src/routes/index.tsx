import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Industries } from "@/components/landing/industries";
import { Locations } from "@/components/landing/locations";
import { PostGallery } from "@/components/landing/post-gallery";
import { Features } from "@/components/landing/features";
import { Growth } from "@/components/landing/growth";
import { Testimonials } from "@/components/landing/testimonials";
import { AppDownload } from "@/components/landing/app-download";
import { OldVsNew } from "@/components/landing/old-vs-new";
import { Faq } from "@/components/landing/faq";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";

const title = "Vizogen — AI Google Business Profile Automation";
const description =
  "Automate your Google Business Profile with Vizogen AI: daily AI posts, authentic 5-star reviews, instant review replies and local rank tracking.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Industries />
        <Locations />
        <PostGallery />
        <Features />
        <Growth />
        <Testimonials />
        <AppDownload />
        <OldVsNew />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
