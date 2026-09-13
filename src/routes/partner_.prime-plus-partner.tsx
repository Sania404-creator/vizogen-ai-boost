import { createFileRoute } from "@tanstack/react-router";
import { PartnerProgramPage } from "@/components/landing/partner-program-page";
import { partnerProgramBySlug, partnerProgramJsonLdScripts } from "@/lib/aeo";

const program = partnerProgramBySlug("prime-plus-partner");
const title = "Vizogen Prime Plus Partner Program — Up to 30% Commission & City Exclusivity";
const description =
  "Prime Plus Partners earn up to 30% recurring commission across all revenue streams, plus agency co-branding, a dedicated Partner Growth Manager, inbound leads and exclusive rights in your city.";
const canonical = "https://www.vizogen.in/partner/prime-plus-partner";

export const Route = createFileRoute("/partner_/prime-plus-partner")({
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
      h1="Vizogen Prime Plus Partner Program — Up to 30% Commission with City Exclusivity"
    />
  ),
});
