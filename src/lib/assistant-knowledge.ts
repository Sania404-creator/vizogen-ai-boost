// Knowledge base for the Vizogen Assistant, built from the same content the
// website and AEO/GEO schemas use, so chatbot answers match the site.
import { NAP, SITE_URL, PARTNER_PROGRAMS, partnerQuickAnswer, partnerFaqs } from "./aeo";

const PAGES: { path: string; summary: string }[] = [
  { path: "/", summary: "Homepage: Vizogen automates Google Business Profile (GMB) — AI posts, smart scheduling, AI review replies, Magic QR reviews and local SEO rank tracking for Indian local businesses." },
  { path: "/pricing", summary: "Pricing: Starter ₹14,999/yr or ₹3,999/quarter; Growth ₹24,999/yr or ₹6,999/quarter (most popular); Pro ₹44,999/yr or ₹11,999/quarter. All plans are non-refundable; agreeing to Terms is required." },
  { path: "/features/ai-post-generation", summary: "AI Post Generation: writes GBP posts with images in your brand voice, with 10 industry examples." },
  { path: "/features/smart-scheduling", summary: "Smart Scheduling: content calendar that auto-publishes GBP posts at the best times." },
  { path: "/features/review-management", summary: "Review Management: monitors Google reviews and drafts instant AI replies in brand voice." },
  { path: "/features/magic-qr", summary: "Magic QR: a QR code customers scan to rate; 4–5 star customers get keyword suggestions and are sent to Google to post reviews." },
  { path: "/services/local-seo", summary: "Local SEO service: GBP optimisation, citations, Google Maps keyword ranking and reporting. City pages exist for Ahmedabad, Rajkot, Surat, Vadodara, Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Jaipur, Udaipur, Lucknow, Noida, Gurgaon, Chandigarh, Bhuj and Gujarat." },
  { path: "/how-to-connect-gbp", summary: "8-step guide to connecting a Google Business Profile to Vizogen." },
  { path: "/how-to-post-on-gbp", summary: "5-step guide to posting on Google Business Profile." },
  { path: "/partner", summary: "Partner program overview: Affiliate, Prime Plus and White-Labelled partnerships, plus free trainings, trips and events." },
  { path: "/partner-application", summary: "Apply to become a partner; you get a reference code to track status live." },
  { path: "/demo", summary: "Book a free live demo with the Vizogen team." },
  { path: "/blog", summary: "Blog on local SEO and Google Business Profile tips." },
  { path: "/contact", summary: "Contact details: email, phone/WhatsApp and Rajkot office address." },
  { path: "/terms-and-conditions", summary: "Terms: payments are NON-REFUNDABLE; jurisdiction Rajkot courts." },
  { path: "/privacy-policy", summary: "Privacy policy for data Vizogen collects." },
];

const INDUSTRIES = "clinics/hospitals, restaurants, salons, gyms, real estate, education, bakeries, car garages, handyman, pest control, tour & travel, yoga & wellness";

export function pageSummary(path?: string) {
  if (!path) return undefined;
  const clean = (path.split("?")[0] ?? "").replace(/\/$/, "") || "/";
  const match = PAGES.find((p) => p.path === clean);
  if (match) return match.summary;
  if (clean.endsWith("-marketing-software")) {
    return `Industry page for ${clean.slice(1).replace("-marketing-software", "").replace(/-/g, " ")} businesses: how Vizogen's AI posts, reviews and Magic QR help this industry rank on Google Maps, with 10 sample AI posts.`;
  }
  if (clean.startsWith("/services/local-seo-")) {
    const city = clean.replace("/services/local-seo-", "").replace(/-/g, " ");
    return `City page: Best Local SEO Agency in ${city} — Vizogen's GBP automation and local SEO services for businesses in ${city}.`;
  }
  if (clean.startsWith("/blog/")) return "A Vizogen blog article about local SEO / Google Business Profile.";
  return undefined;
}

export function buildSystemPrompt(currentPath?: string) {
  const programs = PARTNER_PROGRAMS.map((p) => `- ${p.name}: ${p.commission}.`).join("\n");
  const faqs = partnerFaqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n");
  const pages = PAGES.map((p) => `- ${SITE_URL}${p.path === "/" ? "" : p.path} — ${p.summary}`).join("\n");
  const here = pageSummary(currentPath);

  return `You are the Vizogen Assistant — the official AI guide for Vizogen (${SITE_URL}), run by ${NAP.legalName ?? "NG Marketing Solution"}. Vizogen is a web-only AI platform that automates Google Business Profiles (GBP / GMB / Google Maps listings) for local businesses in India. There is no mobile app and no token/coin system.

## Core facts
- Features: AI Post Generation, Smart Scheduling, AI Review Management, Magic QR review collection, Local SEO rank tracking, GMB Audit Report.
- Industries served: ${INDUSTRIES}.
- Pricing (INR, billed in INR, non-refundable): Starter ₹14,999/year or ₹3,999/quarter; Growth ₹24,999/year or ₹6,999/quarter (most popular); Pro ₹44,999/year or ₹11,999/quarter. One-time: GMB Assistance & Update ₹1,500; GMB Creation & Management ₹3,000 + 18% GST.
- Free trial / sign in: https://login.vizogen.in/sign-in. Magic QR: https://login.vizogen.in/magic-qr.
- Contact: ${NAP.email}, ${NAP.phone} (WhatsApp), Tower-B, RK ICONIC, 923, 150 Feet Ring Rd, nr. Ayodhya Chowk, Sheetal Park, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006.

## Partner programs
${partnerQuickAnswer}
${programs}
${faqs}

## Website pages (use these for links)
${pages}
${here ? `\n## The visitor is currently on ${currentPath}\n${here}\nIf they ask to "summarise this page" or "what is this", summarise this page.\n` : ""}
## Answer format (AEO/GEO style)
1. Start with a one-sentence direct answer that fully answers the question on its own (quotable by Google/ChatGPT).
2. Then up to 4 short bullet points with specifics (prices, steps, numbers).
3. End with one relevant page link from the list above, e.g. "Learn more: ${SITE_URL}/pricing".
- For "summary"/"summarise" requests, give a 3–5 bullet summary.
- Plain markdown, under 120 words. Reply in the visitor's language (English, Hindi or Gujarati).
- Use only the facts above; never invent features, discounts, integrations or guarantees. If unsure, say so and offer WhatsApp ${NAP.phone} or a free demo at ${SITE_URL}/demo.`;
}
