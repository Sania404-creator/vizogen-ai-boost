export const USD_RATE = 83;

export type BillingCycle = "yearly" | "quarterly";
export type Currency = "INR" | "USD";

export type Plan = {
  name: string;
  tagline: string;
  yearly: number;
  quarterly: number;
  popular?: boolean;
  cta: string;
  features: string[];
};

export const plans: Plan[] = [
  {
    name: "Starter",
    tagline: "For solo owners just getting started with GBP automation.",
    yearly: 9999,
    quarterly: 3499,
    cta: "Get Started",
    features: [
      "1 Business Location",
      "AI Post Generation (up to 15 posts/month)",
      "Basic Review Auto-Reply",
      "1 Magic QR Code",
      "Email Support",
    ],
  },
  {
    name: "Growth",
    tagline: "For growing businesses that need daily automation and insights.",
    yearly: 14999,
    quarterly: 4499,
    popular: true,
    cta: "Start Free Trial",
    features: [
      "Up to 3 Business Locations",
      "Unlimited AI Post Generation",
      "Smart Review Auto-Reply + Review Shield",
      "3 Magic QR Codes",
      "Local Ranking Tracker",
      "Priority Chat Support",
    ],
  },
  {
    name: "Pro",
    tagline: "For multi-location businesses and agencies managing several profiles.",
    yearly: 19999,
    quarterly: 5999,
    cta: "Get Started",
    features: [
      "Up to 10 Business Locations",
      "Unlimited AI Post Generation + Multi-language Posts",
      "Smart Review Auto-Reply + Review Shield",
      "Unlimited Magic QR Codes",
      "Local Ranking Tracker + Competitor Insights",
      "Dedicated Account Manager",
      "API Access",
    ],
  },
];

export const comparisonRows: {
  label: string;
  values: [string | boolean, string | boolean, string | boolean];
}[] = [
  { label: "Business Locations", values: ["1", "Up to 3", "Up to 10"] },
  { label: "AI Post Generation", values: ["15 / month", "Unlimited", "Unlimited"] },
  { label: "Multi-language Posts", values: [false, false, true] },
  { label: "Review Auto-Reply", values: ["Basic", "Smart", "Smart"] },
  { label: "Review Shield", values: [false, true, true] },
  { label: "Magic QR Codes", values: ["1", "3", "Unlimited"] },
  { label: "Local Ranking Tracker", values: [false, true, true] },
  { label: "Competitor Insights", values: [false, false, true] },
  { label: "Dedicated Account Manager", values: [false, false, true] },
  { label: "API Access", values: [false, false, true] },
  { label: "Support", values: ["Email", "Priority Chat", "24/7 Priority"] },
];

export const pricingFaqs = [
  {
    q: "Can I switch plans later?",
    a: "Yes. Upgrade or downgrade any time from your dashboard — we prorate the difference against your remaining billing period.",
  },
  {
    q: "What happens if I exceed my location limit?",
    a: "We'll prompt you to add extra locations or move to the next plan. Nothing stops working and no location is deleted.",
  },
  {
    q: "Do you offer refunds?",
    a: "If Vizogen isn't the right fit, tell us within 7 days of your first payment and we'll refund it in full.",
  },
  {
    q: "Is there a setup fee?",
    a: "No. Onboarding, Google Business Profile connection and brand-tone setup are included in every plan.",
  },
];

export function convert(amountInr: number, currency: Currency) {
  return currency === "INR" ? amountInr : Math.round(amountInr / USD_RATE);
}

export function formatPrice(amountInr: number, currency: Currency) {
  const value = convert(amountInr, currency);
  return currency === "INR"
    ? `₹${value.toLocaleString("en-IN")}`
    : `$${value.toLocaleString("en-US")}`;
}
