import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal } from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";
import { NAP, organizationEntity } from "@/lib/aeo";
import { WHATSAPP_URL, openFreeDemo } from "@/lib/site-contact";

const TITLE = "Contact Vizogen | Talk to Our Local SEO & GMB Automation Team";
const DESCRIPTION =
  "Get in touch with Vizogen for Google Business Profile automation and local SEO help — call, WhatsApp or email our Rajkot-based team.";
const URL = "https://www.vizogen.in/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: TITLE,
          description: DESCRIPTION,
          url: URL,
          mainEntity: organizationEntity,
        }),
      },
    ],
  }),
  component: ContactPage,
});

const cards = [
  {
    icon: Phone,
    label: "Call us",
    value: NAP.phone,
    href: `tel:${NAP.phoneE164}`,
  },
  {
    icon: Mail,
    label: "Email us",
    value: NAP.email,
    href: `mailto:${NAP.email}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with our team",
    href: WHATSAPP_URL,
  },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl gradient-brand"
          />
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Contact
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground font-display sm:text-5xl">
                Talk to the Vizogen team
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Questions about Google Business Profile automation, local SEO or pricing? Reach out
                and a real person will get back to you — usually the same day.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button size="lg" onClick={openFreeDemo} className="gradient-brand text-white">
                  Book a free demo
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-5 sm:grid-cols-3">
              {cards.map((card, index) => (
                <Reveal key={card.label} delay={index * 0.08} className="h-full">
                  <a
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl gradient-brand text-white">
                      <card.icon className="size-5" />
                    </span>
                    <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {card.label}
                    </span>
                    <span className="text-base font-semibold text-foreground">{card.value}</span>
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft sm:flex-row sm:items-start">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl gradient-brand text-white">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-foreground font-display">Visit our office</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {NAP.name} ({NAP.legalName})
                    <br />
                    {NAP.street}
                    <br />
                    {NAP.locality}, {NAP.region} {NAP.postalCode}, India
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
