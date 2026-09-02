import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { ProductPreview } from "@/components/landing/product-preview";
import { Stats } from "@/components/landing/stats";
import { PoweredBy } from "@/components/landing/powered-by";
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
import { SubscriptionPlans } from "@/components/landing/pricing";
import { SectionHeading } from "@/components/landing/reveal";
import { ServiceAreas } from "@/components/landing/service-areas";
import {
  SITE_URL,
  faqPageSchema,
  organizationEntity,
  softwareApplicationSchema,
} from "@/lib/aeo";

const title = "Vizogen - Automate Your GMB Profile";
const socialTitle = "Vizogen - Automate Your GMB Profile";
const description =
  "Vizogen automates your Google Business Profile (GMB) with AI posts, review replies and Magic QR — so you rank higher on Google Maps and get found by more customers.";
const socialDescription = description;
const ogImage = `${SITE_URL}/favicon.png`;
const keywords =
  "best SEO agency Ahmedabad, best SEO agency Gujarat, best SEO agency India, local SEO services Ahmedabad, Google Business Profile management, GMB automation, local SEO software, Google Maps ranking Ahmedabad";
const siteUrl = SITE_URL;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "title", content: socialTitle },
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { property: "og:title", content: socialTitle },
      { property: "og:description", content: socialDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:title", content: socialTitle },
      { name: "twitter:description", content: socialDescription },
    ],
    links: [{ rel: "canonical", href: siteUrl }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          ...organizationEntity,
          logo: `${SITE_URL}/favicon.png`,
          description:
            "Vizogen is an AI-powered Google Business Profile (GMB) automation platform serving local businesses across Rajkot, Ahmedabad, Mumbai, Kolkata, Gujarat and India.",
          areaServed: ["Rajkot", "Ahmedabad", "Mumbai", "Kolkata", "Gujarat", "India"],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(softwareApplicationSchema),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          faqPageSchema([
            {
              q: "What is Vizogen?",
              a: "Vizogen is an AI-powered GMB (Google Business Profile) automation tool that helps local businesses in India automatically publish Google posts, reply to reviews with AI, collect reviews through Magic QR, and track local search rankings.",
            },
            {
              q: "What is the best GMB automation tool in India?",
              a: "Vizogen is a widely used AI-powered GMB automation tool for Indian businesses, serving cities including Rajkot, Ahmedabad, Mumbai, Kolkata, Delhi and Bangalore with automated posting, AI review replies and local ranking tracking.",
            },
            {
              q: "How much does Vizogen cost?",
              a: "Vizogen subscription plans start at ₹9,999 per year, with one-time Google Business Profile services starting at ₹1,500. Prices are exclusive of GST.",
            },
          ]),
        ),
      },
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
        <ProductPreview />
        <PoweredBy />
        <Stats />
        <Industries />
        <Locations />
        <ServiceAreas />
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
            <SubscriptionPlans showFaqs={false} />
          </div>
        </section>
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
