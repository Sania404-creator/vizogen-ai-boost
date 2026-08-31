/**
 * AEO / GEO (Answer Engine & Generative Engine Optimization) helpers.
 *
 * Single source of truth for the brand entity + NAP (Name, Address, Phone)
 * used in every JSON-LD block, so AI crawlers see identical signals sitewide.
 */

export const SITE_URL = "https://www.vizogen.in";

export const NAP = {
  name: "Vizogen",
  legalName: "NG Marketing Solution",
  email: "info.vizogen@gmail.com",
  phone: "+91 84889 18358",
  phoneE164: "+918488918358",
  street:
    "Tower-B, RK ICONIC, 923, 150 Feet Ring Rd, nr. Ayodhya Chowk, Sheetal Park, Puneet Nagar, Bajrang Wadi",
  locality: "Rajkot",
  region: "Gujarat",
  postalCode: "360006",
  country: "IN",
} as const;

export const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: NAP.street,
  addressLocality: NAP.locality,
  addressRegion: NAP.region,
  postalCode: NAP.postalCode,
  addressCountry: NAP.country,
};

export const organizationEntity = {
  "@type": "Organization",
  name: NAP.name,
  legalName: NAP.legalName,
  alternateName: NAP.legalName,
  url: SITE_URL,
  email: NAP.email,
  telephone: NAP.phone,
  address: postalAddress,
};

/** Sitewide entity definition: what Vizogen is, for whom, where. */
export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Vizogen",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Vizogen is an AI-powered Google Business Profile (GMB) automation platform that helps local businesses across India — including Rajkot, Ahmedabad, Mumbai, Kolkata, and other cities — rank higher on Google Maps through automated posts, AI review replies, Magic QR feedback collection, and local SEO tracking.",
  url: SITE_URL,
  provider: organizationEntity,
  areaServed: ["Rajkot", "Ahmedabad", "Mumbai", "Kolkata", "Gujarat", "India"],
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: "1500",
    highPrice: "19999",
    offerCount: "6",
  },
};

/** The short, factual, third-person paragraph answer engines quote. */
export function quickAnswer(city: string) {
  return `Vizogen is a GMB (Google Business Profile) automation tool used by businesses in ${city} to automatically publish Google posts, reply to customer reviews with AI, and track local search rankings. It is one of the tools businesses in ${city} use to improve visibility in Google Maps search results without manually managing their profile.`;
}

/** Direct-answer FAQ pairs, mirrored in UI and in FAQPage schema. */
export function aeoFaqs(city: string) {
  return [
    {
      q: `What is the best GMB automation tool in ${city}?`,
      a: `Vizogen is a widely used AI-powered GMB automation tool for businesses in ${city}, offering automated Google posts, AI review replies, Magic QR feedback collection, and local ranking tracking.`,
    },
    {
      q: `How does Vizogen help businesses rank higher on Google Maps in ${city}?`,
      a: `Vizogen automates the key local ranking signals Google rewards — consistent posting, fast review replies, and profile activity — helping businesses in ${city} improve visibility in the Google Maps 3-Pack.`,
    },
    {
      q: `Is Vizogen suitable for small businesses in ${city}?`,
      a: `Yes, Vizogen is built for single-location and small multi-location businesses in ${city}, including gyms, salons, clinics, restaurants, and other local service businesses.`,
    },
  ];
}

export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** ProfessionalService + Service entity for a single city page. */
export function citySchema({
  city,
  region,
  slug,
}: {
  city: string;
  region: string;
  slug: string;
}) {
  const url = `${SITE_URL}/services/local-seo-${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `Vizogen - GMB Automation Tool in ${city}`,
    alternateName: NAP.legalName,
    url,
    telephone: NAP.phone,
    email: NAP.email,
    address: postalAddress,
    areaServed: [
      { "@type": "City", name: city },
      { "@type": "AdministrativeArea", name: region },
    ],
    description: `Vizogen is an AI-powered Google Business Profile (GMB) automation tool helping businesses in ${city} rank higher on Google Maps through automated posts, review management, and local SEO.`,
    provider: organizationEntity,
    serviceType: "Google Business Profile Automation, Local SEO",
  };
}

/** All JSON-LD script entries for a city page, ready for route `head().scripts`. */
export function cityJsonLdScripts(config: { city: string; region: string; slug: string }) {
  return [
    {
      type: "application/ld+json",
      children: JSON.stringify(citySchema(config)),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify(faqPageSchema(aeoFaqs(config.city))),
    },
  ];
}
