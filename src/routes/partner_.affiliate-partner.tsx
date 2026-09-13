import { createFileRoute } from "@tanstack/react-router";
import { PartnerProgramPage } from "@/components/landing/partner-program-page";
import { partnerProgramBySlug, partnerProgramJsonLdScripts } from "@/lib/aeo";

const program = partnerProgramBySlug("affiliate-partner");
const title = "Vizogen Affiliate Partner Program — 20% Recurring Commission in India";
const description =
  "Join the Vizogen Affiliate Partner program: 20% recurring commission on every Google Business Profile automation referral, ₹999 minimum payout, no joining fee. Apply in minutes.";
const canonical = "https://www.vizogen.in/partner/affiliate-partner";

export const Route = createFileRoute("/partner_/affiliate-partner")({
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
      h1="Vizogen Affiliate Partner Program — Earn 20% Recurring Commission"
    />
  ),
});
