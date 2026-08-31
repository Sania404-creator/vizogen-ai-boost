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

const title = "Vizogen.ai - GMB Automation Tool";
const socialTitle = "Vizogen.ai - GMB Automation Tool";
const description =
  "Vizogen is a trusted local SEO and Google Business Profile automation platform serving businesses across Ahmedabad, Gujarat, and India. Rank higher on Google Maps with AI-powered posts, reviews, and local SEO tools. Owned and operated by NG Marketing Solution.";
const socialDescription =
  "AI-powered local SEO and Google Business Profile automation trusted by businesses across Ahmedabad, Gujarat, and India.";
const keywords =
  "best SEO agency Ahmedabad, best SEO agency Gujarat, best SEO agency India, local SEO services Ahmedabad, Google Business Profile management, GMB automation, local SEO software, Google Maps ranking Ahmedabad";
const siteUrl = "https://www.vizogen.in";

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
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: socialTitle },
      { name: "twitter:description", content: socialDescription },
    ],
    links: [{ rel: "canonical", href: siteUrl }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Vizogen",
          alternateName: "NG Marketing Solution",
          url: "https://vizogen.in",
          logo: "https://vizogen.in/logo.png",
          description:
            "AI-powered local SEO and Google Business Profile automation platform serving businesses across Ahmedabad, Gujarat, and India.",
          areaServed: ["Ahmedabad", "Gujarat", "India"],
          email: "info.vizogen@gmail.com",
          telephone: "+91-84889-18358",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Tower-B, RK ICONIC, 923, 150 Feet Ring Rd, nr. Ayodhya Chowk, Sheetal Park",
            addressLocality: "Rajkot",
            addressRegion: "Gujarat",
            postalCode: "360006",
            addressCountry: "IN",
          },
        }),
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
