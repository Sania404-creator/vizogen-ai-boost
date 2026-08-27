import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
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
        <section id="pricing" className="relative overflow-hidden py-20 sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[520px] rounded-full bg-brand-2/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Simple, Transparent Pricing"
              title="Plans that grow with your business"
              subtitle="Pick a plan that scales with your business — prices shown in INR by default."
            />
            <SubscriptionPlans />
          </div>
        </section>
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
