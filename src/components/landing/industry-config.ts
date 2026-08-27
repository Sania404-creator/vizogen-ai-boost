import { Dumbbell, MessageSquareHeart, ShieldCheck, Sparkles, Star, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buildIndustryTestimonials, type IndustryTestimonial } from "./industry-testimonials";
import gymHero from "@/assets/industry-gym.jpg";
import dashboard from "@/assets/dashboard.jpg";
import p1 from "@/assets/post-1.jpg";
import p2 from "@/assets/post-2.jpg";
import p3 from "@/assets/post-3.jpg";
import p4 from "@/assets/post-4.jpg";
import p5 from "@/assets/post-5.jpg";
import p6 from "@/assets/post-6.jpg";

export type IndustryConfig = {
  /** e.g. "Gyms & Fitness Centres" — used in eyebrow + headings */
  industryName: string;
  /** singular, e.g. "Gym" */
  industrySingular: string;
  /** plural, e.g. "Gyms" */
  industryPlural: string;
  /** the metric that grows, e.g. "Memberships" */
  growthMetric: string;
  slug: string;
  heroHeadline: string;
  heroSubtext: string;
  heroImage: string;
  heroImageAlt: string;
  mockupImage: string;
  mockupImageAlt: string;
  trustLine: string;
  revenueParagraph: string;
  benefits: { icon: LucideIcon; title: string; description: string }[];
  timelineSteps: { title: string; description: string }[];
  oldWay: string[];
  newWay: string[];
  galleryPosts: { src: string; alt: string; title: string }[];
  faqs: { question: string; answer: string }[];
  /** 10 industry-specific customer testimonials */
  testimonials: IndustryTestimonial[];
  whatsappMessage: string;
  seoTitle: string;
  seoDescription: string;
};

export const WHATSAPP_NUMBER = "918488918358";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const gymConfig: IndustryConfig = {
  industryName: "Gyms & Fitness Centres",
  industrySingular: "Gym",
  industryPlural: "Gyms",
  growthMetric: "Memberships",
  slug: "gym-marketing-software",
  heroHeadline: "Grow Your Gym Memberships on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star reviews, auto-publish workout posts, and dominate local searches while you focus on training.",
  heroImage: gymHero,
  heroImageAlt: "Members training inside a bright modern gym",
  mockupImage: dashboard,
  mockupImageAlt: "Vizogen dashboard showing Google Business Profile growth for a gym",
  trustLine: "Trusted by 1k+ Gyms",
  revenueParagraph:
    "Did you know that for Gyms, over 85% of discovery happens directly on Google Maps? If you aren't in the Top 3, you're invisible. Vizogen doesn't just manage your profile — it aggressively pushes you to the top. Our users typically see a 3x increase in phone calls and direction requests within the first 90 days.",
  benefits: [
    {
      icon: Dumbbell,
      title: "Get More Members",
      description:
        "Show up in the Top 3 for “gym near me” searches so walk-in enquiries and trial sign-ups land in your inbox daily.",
    },
    {
      icon: Sparkles,
      title: "Automate Gym Posts",
      description:
        "AI writes and designs workout tips, class timings and transformation offers — published to your profile every single day.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Rating",
      description:
        "Magic QR routes happy members to Google and unhappy feedback to a private form, while AI replies to every review in your tone.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Gym Profile",
      description:
        "One secure Google login links your gym's Business Profile to Vizogen. No agency onboarding, no paperwork.",
    },
    {
      title: "AI Generates Gym-specific Content",
      description:
        "Vizogen learns your classes, trainers and offers, then builds a daily posting calendar around them.",
    },
    {
      title: "Capture Post-Visit Reviews",
      description:
        "Place a Magic QR at reception. Members scan after a session and your 5-star reviews start compounding.",
    },
    {
      title: "Smart Review Replies",
      description:
        "Every review gets a fast, on-brand reply — a ranking signal Google rewards and members notice.",
    },
    {
      title: "Watch Memberships Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing week over week inside your dashboard.",
    },
  ],
  oldWay: [
    "Posting to Google only when you remember",
    "Paying an agency ₹25,000+ every month",
    "Member reviews sitting unanswered for weeks",
    "Angry feedback landing straight on your profile",
    "No idea where your gym ranks locally",
    "Hiring a designer for every offer creative",
  ],
  newWay: [
    "Daily AI gym posts published automatically",
    "Agency-level output at a fraction of the cost",
    "Instant AI review replies in your tone",
    "Magic QR routes unhappy members privately",
    "Live local rank tracking by keyword & city",
    "Class and offer creatives designed in seconds",
  ],
  galleryPosts: [
    { src: p1, alt: "AI generated gym promotion post", title: "Free Trial Week" },
    { src: p6, alt: "AI generated fitness class post", title: "Morning HIIT Batch" },
    { src: p3, alt: "AI generated fitness health post", title: "Body Composition Check" },
    { src: p4, alt: "AI generated personal training post", title: "PT Slots Open" },
    { src: p5, alt: "AI generated nutrition post", title: "Diet Plan Add-on" },
    { src: p2, alt: "AI generated membership offer post", title: "Annual Membership Offer" },
  ],
  faqs: [
    {
      question: "Will Vizogen actually help my gym rank higher on Google Maps?",
      answer:
        "Yes. Daily posts, fresh reviews and fast replies are three of the strongest local ranking signals. Vizogen automates all three and tracks your position for your keywords and city so you can see the movement.",
    },
    {
      question: "Is connecting my Google Business Profile safe?",
      answer:
        "Completely. You connect through Google's official secure OAuth screen, we never see your password, and you can disconnect Vizogen from your Google account at any time.",
    },
    {
      question: "Will the AI content sound like a real gym, not a robot?",
      answer:
        "Vizogen is trained on your classes, trainers, offers and tone. Every post is designed and written for fitness audiences, and you can review or edit anything before it goes live.",
    },
    {
      question: "How does Magic QR get more 5-star reviews?",
      answer:
        "Members scan a QR at reception and rate their session. Happy members are routed straight to your Google review page; unhappy ones go to a private feedback form so you can fix it first.",
    },
    {
      question: "How soon will I see results?",
      answer:
        "Most gyms see measurable growth in profile views and calls within the first 30 days, with Top 3 map movement typically inside 90 days of consistent posting and review activity.",
    },
  ],
  testimonials: buildIndustryTestimonials({
    industrySingular: "Gym",
    industryPlural: "Gyms",
    customerNoun: "members",
    contentNoun: "workout and offer posts",
    brandSuffix: "Fitness",
    searchTerm: "gym near me",
    seed: 1,
  }),
  whatsappMessage: "Hi Vizogen, I want to grow my Gym business.",
  seoTitle: "Gym Marketing Software — Grow Gym Memberships | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for gyms: daily AI workout posts, 5-star member reviews, smart replies and Top 3 local map rankings.",
};

/**
 * Example: adding another industry is config-only — no component changes.
 * Duplicate this shape into a new file/entry and register it in `industryConfigs`.
 *
 * export const salonConfig: IndustryConfig = {
 *   industryName: "Salons & Spas",
 *   industrySingular: "Salon",
 *   industryPlural: "Salons",
 *   growthMetric: "Bookings",
 *   slug: "salon-marketing-software",
 *   heroHeadline: "Grow Your Salon Bookings on Autopilot",
 *   heroSubtext: "Get more 5-star client reviews, auto-publish styling posts, and own local beauty searches.",
 *   heroImage: salonHero,
 *   benefits: [{ icon: Scissors, title: "Get More Clients", description: "..." }, ...],
 *   timelineSteps: [{ title: "Connect Your Salon Profile", description: "..." }, ...],
 *   faqs: [{ question: "...", answer: "..." }, ...],
 *   whatsappMessage: "Hi Vizogen, I want to grow my Salon business.",
 *   ... // remaining fields as above
 * };
 */

/** Registry of live industry pages, keyed by the label used in the homepage grid. */
export const industryConfigs: Record<string, IndustryConfig> = {
  Gyms: gymConfig,
};

export const sharedStatCards = [
  { value: 300, suffix: "%", label: "Avg. Reach Boost", icon: TrendingUp },
  { value: 20, suffix: "+ hrs", label: "Saved Per Month", icon: MessageSquareHeart },
];

export const trustBadges = ["No Credit Card Required", "Secure", "Instant", "Support"];

export const heroBadgeIcon = Star;
