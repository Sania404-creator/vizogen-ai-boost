import { createFileRoute } from "@tanstack/react-router";
import { PartnerProgramPage } from "@/components/landing/partner-program-page";
import { partnerProgramBySlug, partnerProgramJsonLdScripts } from "@/lib/aeo";

const program = partnerProgramBySlug("white-labelled-partner");
const title = "White-Label GMB Automation Software for Agencies | Vizogen Partner Program";
const description =
  "Resell Google Business Profile automation under your own brand: your domain, your logo, your pricing. Vizogen handles hosting, engineering, updates and API stability.";
const canonical = "https://www.vizogen.in/partner/white-labelled-partner";

export const Route = createFileRoute("/partner_/white-labelled-partner")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: partnerProgramJsonLdScripts(program),
  }),
  component: () => (
    <PartnerProgramPage
      program={program}
      h1="White-Labelled Partner Program — Sell Vizogen Under Your Own Brand"
    />
  ),
});
