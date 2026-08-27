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
        <section id="pricing" className="py-16 text-center sm:py-20">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Plans that grow with your business
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Subscription plans plus one-time Google Business Profile services — all on our
              pricing page.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-7 rounded-full gradient-brand shadow-soft transition-transform hover:scale-[1.03] hover:opacity-95"
            >
              <Link to="/pricing">See Pricing →</Link>
            </Button>
          </div>
        </section>
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
