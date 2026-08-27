export type BillingCycle = "yearly" | "quarterly";
export type Currency = "INR" | "USD";

export type PlanFeature = { label: string; included: boolean };

export type Plan = {
  name: string;
  tagline: string;
  inrYearly: number;
  inrQuarterly: number;
  usdYearly: number;
  popular?: boolean;
  cta: string;
  features: PlanFeature[];
};

const f = (label: string, included = true): PlanFeature => ({ label, included });

export const plans: Plan[] = [
  {
    name: "Starter",
    tagline: "For solo owners getting started with GBP automation.",
    inrYearly: 9999,
    inrQuarterly: 3499,
    usdYearly: 100,
    cta: "Start Free Trial",
    features: [
      f("Magic QR – (Feedback Collection QR)"),
      f("GMB AI Agent"),
      f("Performance Analysis"),
      f("GMB Profile Optimization"),
      f("AI Review Reply Automation"),
      f("15 Media / Post Publishing"),
      f("Content Scheduler"),
      f("Keyword Ranking Tracker", false),
      f("Citation", false),
      f("AI Google Posts & Media Generation", false),
      f("Instant Free Website", false),
      f("Connect Domain", false),
      f("Feature Support"),
    ],
  },
  {
    name: "Growth",
    tagline: "For growing businesses that need daily automation and insights.",
    inrYearly: 14999,
    inrQuarterly: 4499,
    usdYearly: 150,
    popular: true,
    cta: "Start Free Trial",
    features: [
      f("Magic QR – (Feedback Collection QR)"),
      f("Feedback Collection"),
      f("GMB AI Agent"),
      f("Performance Analysis"),
      f("Profile Optimization"),
      f("AI Review Reply Automation"),
      f("30 Media / Post Publishing"),
      f("Content Scheduler"),
      f("Keyword Ranking Tracker"),
      f("Citation"),
      f("AI Google Posts & Media Generation"),
      f("Instant Free Website", false),
      f("Connect Domain", false),
      f("Feature Support"),
    ],
  },
  {
    name: "Pro",
    tagline: "For multi-location businesses and agencies.",
    inrYearly: 19999,
    inrQuarterly: 5999,
    usdYearly: 200,
    cta: "Start Free Trial",
    features: [
      f("Magic QR – (Feedback Collection QR)"),
      f("Feedback Collection"),
      f("GMB AI Agent"),
      f("Performance Analysis"),
      f("Profile Optimization"),
      f("AI Review Reply Automation"),
      f("45 Media / Post Publishing"),
      f("Content Scheduler"),
      f("Keyword Ranking Tracker"),
      f("Citation"),
      f("AI Google Posts & Media Generation"),
      f("Instant Free Website"),
      f("Connect Domain"),
      f("Feature Support"),
    ],
  },
];

export type OneTimeService = {
  name: string;
  price: number;
  priceNote?: string;
  items: string[];
  whatsappMessage: string;
};

export const WHATSAPP_NUMBER = "918488918358";

export const oneTimeServices: OneTimeService[] = [
  {
    name: "GMB Assistance & Update Plan",
    price: 1500,
    items: [
      "Google Business Profile Functionality Check",
      "Website URL Update",
      "Mobile Number Update",
      "Basic Profile Verification Check",
      "Minor Corrections",
      "1 Month Support",
    ],
    whatsappMessage: "Hi Vizogen, I want the GMB Assistance & Update Plan.",
  },
  {
    name: "GMB Creation & Management Plan (From Scratch)",
    price: 3000,
    priceNote: "+ 18% GST",
    items: [
      "GMB Creation From Scratch",
      "Address Verification Guidance",
      "Category Selection",
      "Product Listing Setup",
      "Service Management",
      "Business Optimization",
      "1 Month Support",
    ],
    whatsappMessage: "Hi Vizogen, I want the GMB Creation & Management Plan.",
  },
];

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function planPrice(plan: Plan, cycle: BillingCycle, currency: Currency) {
  if (currency === "INR") {
    const amount = cycle === "yearly" ? plan.inrYearly : plan.inrQuarterly;
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  const amount =
    cycle === "yearly"
      ? plan.usdYearly
      : Math.round(plan.usdYearly * (plan.inrQuarterly / plan.inrYearly));
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

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
