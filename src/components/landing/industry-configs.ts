import {
  Bug,
  Building2,
  Car,
  Croissant,
  Flower2,
  GraduationCap,
  Hammer,
  HeartPulse,
  Plane,
  Scissors,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IndustryConfig } from "./industry-config";
import { buildIndustryTestimonials } from "./industry-testimonials";
import { gymConfig } from "./industry-config";
import dashboard from "@/assets/dashboard.jpg";
import p1 from "@/assets/post-1.jpg";
import p2 from "@/assets/post-2.jpg";
import p3 from "@/assets/post-3.jpg";
import p4 from "@/assets/post-4.jpg";
import p5 from "@/assets/post-5.jpg";
import p6 from "@/assets/post-6.jpg";
import salonHero from "@/assets/industry-salon.jpg";
import clinicHero from "@/assets/industry-clinic.jpg";
import bakeryHero from "@/assets/industry-bakery.jpg";
import restaurantHero from "@/assets/industry-restaurant.jpg";
import pestHero from "@/assets/industry-pest.jpg";
import garageHero from "@/assets/industry-garage.jpg";
import travelHero from "@/assets/industry-travel.jpg";
import yogaHero from "@/assets/industry-yoga.jpg";
import handymanHero from "@/assets/industry-handyman.jpg";
import educationHero from "@/assets/industry-education.jpg";
import realestateHero from "@/assets/industry-realestate.jpg";

/**
 * Content spec for one industry. Everything else (old vs new lists, gallery,
 * FAQs) is derived from these tokens so every page stays structurally identical
 * to the gym page — config-only, no component changes.
 */
type IndustrySpec = {
  industryName: string;
  industrySingular: string;
  industryPlural: string;
  growthMetric: string;
  slug: string;
  heroHeadline: string;
  heroSubtext: string;
  heroImage: string;
  heroImageAlt: string;
  /** who leaves the reviews, e.g. "clients", "patients" */
  customerNoun: string;
  /** what the AI writes about, e.g. "styling content" */
  contentNoun: string;
  /** where the Magic QR lives, e.g. "at the reception desk" */
  qrPlace: string;
  revenueParagraph: string;
  benefits: { icon: LucideIcon; title: string; description: string }[];
  timelineSteps: { title: string; description: string }[];
  galleryTitles: [string, string, string, string, string, string];
  whatsappMessage: string;
  seoTitle: string;
  seoDescription: string;
};

const galleryImages = [p1, p6, p3, p4, p5, p2];

let seedCounter = 1;

function buildConfig(spec: IndustrySpec): IndustryConfig {
  const seed = ++seedCounter;
  const {
    industryName,
    industrySingular,
    industryPlural,
    customerNoun,
    contentNoun,
    qrPlace,
    growthMetric,
    galleryTitles,
    ...rest
  } = spec;

  return {
    industryName,
    industrySingular,
    industryPlural,
    growthMetric,
    ...rest,
    mockupImage: dashboard,
    mockupImageAlt: `Vizogen dashboard showing Google Business Profile growth for a ${industrySingular.toLowerCase()}`,
    trustLine: `Trusted by 1k+ ${industryPlural}`,
    oldWay: [
      "Posting to Google only when you remember",
      "Paying an agency ₹25,000+ every month",
      `${customerNoun.charAt(0).toUpperCase()}${customerNoun.slice(1)} reviews sitting unanswered for weeks`,
      "Angry feedback landing straight on your profile",
      `No idea where your ${industrySingular.toLowerCase()} ranks locally`,
      "Hiring a designer for every offer creative",
    ],
    newWay: [
      `Daily AI ${industrySingular.toLowerCase()} posts published automatically`,
      "Agency-level output at a fraction of the cost",
      "Instant AI review replies in your tone",
      `Magic QR routes unhappy ${customerNoun} privately`,
      "Live local rank tracking by keyword & city",
      "Offer and service creatives designed in seconds",
    ],
    testimonials: buildIndustryTestimonials({
      industrySingular: industrySingular,
      industryPlural: industryPlural,
      customerNoun,
      contentNoun,
      brandSuffix: industrySingular,
      seed,
    }),
    galleryPosts: galleryTitles.map((title, i) => ({
      src: galleryImages[i]!,
      alt: `AI generated ${industrySingular.toLowerCase()} post — ${title}`,
      title,
    })),
    faqs: [
      {
        question: `Will Vizogen actually help my ${industrySingular.toLowerCase()} rank higher on Google Maps?`,
        answer:
          "Yes. Daily posts, fresh reviews and fast replies are three of the strongest local ranking signals. Vizogen automates all three and tracks your position for your keywords and city so you can see the movement.",
      },
      {
        question: "Is connecting my Google Business Profile safe?",
        answer:
          "Completely. You connect through Google's official secure OAuth screen, we never see your password, and you can disconnect Vizogen from your Google account at any time.",
      },
      {
        question: `Will the AI content sound like a real ${industrySingular.toLowerCase()}, not a robot?`,
        answer: `Vizogen is trained on your services, offers and tone. Every post is written and designed as ${contentNoun} for your local audience, and you can review or edit anything before it goes live.`,
      },
      {
        question: "How does Magic QR get more 5-star reviews?",
        answer: `Place a Magic QR ${qrPlace}. ${customerNoun.charAt(0).toUpperCase()}${customerNoun.slice(1)} scan and rate — happy ones are routed straight to your Google review page, unhappy ones go to a private feedback form so you can fix it first.`,
      },
      {
        question: "How soon will I see results?",
        answer: `Most ${industryPlural.toLowerCase()} see measurable growth in profile views and calls within the first 30 days, with Top 3 map movement typically inside 90 days of consistent posting and review activity.`,
      },
    ],
  };
}

export const salonConfig = buildConfig({
  industryName: "Salon Owners",
  industrySingular: "Salon",
  industryPlural: "Salons",
  growthMetric: "Bookings",
  slug: "salon-marketing-software",
  heroHeadline: "Fill Your Salon Chairs on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star reviews, auto-publish styling posts, and dominate local searches while you focus on your clients.",
  heroImage: salonHero,
  heroImageAlt: "Stylist working with a client inside a bright modern salon",
  customerNoun: "clients",
  contentNoun: "styling content",
  qrPlace: "at the billing counter",
  revenueParagraph:
    "Did you know that for Salons, over 85% of discovery happens directly on Google Maps? If you aren't in the Top 3, you're invisible. Vizogen aggressively pushes you to the top — users typically see a 3x increase in phone calls and booking requests within 90 days.",
  benefits: [
    {
      icon: Scissors,
      title: "Get More Bookings",
      description:
        "Auto-collect 5-star reviews from happy clients so new customers pick your salon over the one down the street.",
    },
    {
      icon: Sparkles,
      title: "Automate Styling Posts",
      description:
        "AI-generated posts about services, offers and transformations — written, designed and published daily.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Rating",
      description:
        "Review Shield catches negative feedback privately before it lands on your public profile.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Salon Profile",
      description:
        "One secure Google login links your salon's Business Profile to Vizogen. No agency onboarding, no paperwork.",
    },
    {
      title: "AI Generates Styling Content",
      description:
        "Vizogen learns your services, stylists and offers, then builds a daily posting calendar around them.",
    },
    {
      title: "Capture Post-Appointment Reviews via Magic QR",
      description:
        "Clients scan at checkout and your 5-star reviews start compounding week after week.",
    },
    {
      title: "Smart Review Replies",
      description:
        "Every review gets a fast, on-brand reply — a ranking signal Google rewards and clients notice.",
    },
    {
      title: "Watch Bookings Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing inside your dashboard.",
    },
  ],
  galleryTitles: [
    "Weekend Offer",
    "Bridal Package",
    "Hair Spa Add-on",
    "New Stylist Joins",
    "Festive Glow Deal",
    "Membership Card",
  ],
  whatsappMessage: "Hi Vizogen, I want to grow my Salon business.",
  seoTitle: "Salon Marketing Software & Local SEO | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for salons: daily AI styling posts, 5-star client reviews, smart replies and Top 3 local map rankings.",
});

export const clinicConfig = buildConfig({
  industryName: "Doctors & Health Clinics",
  industrySingular: "Clinic",
  industryPlural: "Clinics",
  growthMetric: "Appointments",
  slug: "clinic-marketing-software",
  heroHeadline: "Fill Your Appointment Book on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star patient reviews, auto-publish health tips, and dominate local searches while you focus on patient care.",
  heroImage: clinicHero,
  heroImageAlt: "Doctor standing in a bright modern clinic reception",
  customerNoun: "patients",
  contentNoun: "health content",
  qrPlace: "at the front desk",
  revenueParagraph:
    "Over 85% of patients discover clinics through Google Maps. If you aren't in the Top 3, you're invisible. Vizogen's users see a 3x increase in appointment calls within 90 days.",
  benefits: [
    {
      icon: HeartPulse,
      title: "Get More Patients",
      description:
        "Auto-collect patient reviews so your clinic becomes the obvious choice in local search results.",
    },
    {
      icon: Sparkles,
      title: "Automate Health Content",
      description:
        "AI posts on services, health tips and clinic hours, published to your profile every day.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Reputation",
      description:
        "Review Shield filters negative feedback privately before it goes public.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Clinic Profile",
      description:
        "One secure Google login links your clinic's Business Profile to Vizogen. No paperwork.",
    },
    {
      title: "AI Generates Health Content",
      description:
        "Vizogen learns your specialities, doctors and timings, then builds a daily posting calendar.",
    },
    {
      title: "Capture Post-Visit Reviews via Magic QR",
      description:
        "Patients scan after a consultation and your 5-star reviews start compounding.",
    },
    {
      title: "Smart Review Replies",
      description:
        "Every review gets a fast, compliant, on-brand reply that Google rewards.",
    },
    {
      title: "Watch Appointments Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing inside your dashboard.",
    },
  ],
  galleryTitles: [
    "Health Checkup Camp",
    "Doctor Availability",
    "Preventive Care Tips",
    "New Speciality",
    "Vaccination Drive",
    "Evening OPD Hours",
  ],
  whatsappMessage: "Hi Vizogen, I want to grow my Clinic business.",
  seoTitle: "Clinic Marketing Software & Local SEO | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for clinics: daily AI health posts, 5-star patient reviews, smart replies and Top 3 local map rankings.",
});

export const bakeryConfig = buildConfig({
  industryName: "Bakers & Cake Shops",
  industrySingular: "Bakery",
  industryPlural: "Bakeries",
  growthMetric: "Orders",
  slug: "bakery-marketing-software",
  heroHeadline: "Sell Out Your Bakery on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star reviews, auto-publish daily specials, and dominate local searches while you focus on baking.",
  heroImage: bakeryHero,
  heroImageAlt: "Artisan bakery counter filled with fresh breads and cakes",
  customerNoun: "customers",
  contentNoun: "product content",
  qrPlace: "at the billing counter",
  revenueParagraph:
    "Over 85% of local bakery discovery happens on Google Maps. Vizogen pushes you to the top — users see a 3x increase in calls and orders within 90 days.",
  benefits: [
    {
      icon: Croissant,
      title: "Get More Orders",
      description:
        "Auto-collect reviews from happy customers so cake and party orders come straight to your phone.",
    },
    {
      icon: Sparkles,
      title: "Automate Daily Specials Posts",
      description:
        "AI posts showcasing fresh items and offers, designed and published every single day.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Rating",
      description:
        "Review Shield catches complaints privately instead of on your public profile.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Bakery Profile",
      description:
        "One secure Google login links your bakery's Business Profile to Vizogen.",
    },
    {
      title: "AI Generates Product Posts",
      description:
        "Vizogen learns your menu, bestsellers and offers, then builds a daily posting calendar.",
    },
    {
      title: "Capture In-Store Reviews via Magic QR",
      description:
        "Customers scan at the counter and your 5-star reviews start compounding.",
    },
    {
      title: "Smart Review Replies",
      description: "Every review gets a fast, on-brand reply that Google rewards.",
    },
    {
      title: "Watch Orders Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing inside your dashboard.",
    },
  ],
  galleryTitles: [
    "Fresh Out of Oven",
    "Birthday Cake Offer",
    "Eggless Range",
    "Festive Hampers",
    "Buy 1 Get 1",
    "Custom Cake Orders",
  ],
  whatsappMessage: "Hi Vizogen, I want to grow my Bakery business.",
  seoTitle: "Bakery Marketing Software & Local SEO | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for bakeries: daily AI specials posts, 5-star reviews, smart replies and Top 3 local map rankings.",
});

export const restaurantConfig = buildConfig({
  industryName: "Restaurants & Bars",
  industrySingular: "Restaurant",
  industryPlural: "Restaurants",
  growthMetric: "Reservations",
  slug: "restaurant-marketing-software",
  heroHeadline: "Fill Every Table on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star reviews, auto-publish menu posts, and dominate local searches while you focus on your kitchen.",
  heroImage: restaurantHero,
  heroImageAlt: "Stylish restaurant interior with set tables and warm lighting",
  customerNoun: "guests",
  contentNoun: "menu content",
  qrPlace: "on every table",
  revenueParagraph:
    "Over 85% of diners discover restaurants via Google Maps. Vizogen's users see a 3x increase in calls and table bookings within 90 days.",
  benefits: [
    {
      icon: UtensilsCrossed,
      title: "Get More Diners",
      description:
        "Auto-collect reviews from satisfied guests so hungry searchers choose your table first.",
    },
    {
      icon: Sparkles,
      title: "Automate Menu & Offer Posts",
      description:
        "AI posts on dishes, events and happy hours, published to your profile daily.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Rating",
      description:
        "Review Shield filters bad experiences privately before they hit your public profile.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Restaurant Profile",
      description:
        "One secure Google login links your restaurant's Business Profile to Vizogen.",
    },
    {
      title: "AI Generates Menu Content",
      description:
        "Vizogen learns your menu, events and offers, then builds a daily posting calendar.",
    },
    {
      title: "Capture Post-Meal Reviews via Magic QR",
      description:
        "Guests scan at the table and your 5-star reviews start compounding.",
    },
    {
      title: "Smart Review Replies",
      description: "Every review gets a fast, on-brand reply that Google rewards.",
    },
    {
      title: "Watch Reservations Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing inside your dashboard.",
    },
  ],
  galleryTitles: [
    "Chef's Special",
    "Weekend Brunch",
    "Happy Hours",
    "Live Music Night",
    "Family Combo",
    "New Menu Launch",
  ],
  whatsappMessage: "Hi Vizogen, I want to grow my Restaurant business.",
  seoTitle: "Restaurant Marketing Software & Local SEO | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for restaurants: daily AI menu posts, 5-star guest reviews, smart replies and Top 3 local map rankings.",
});

export const pestControlConfig = buildConfig({
  industryName: "Pest Control Businesses",
  industrySingular: "Pest Control Business",
  industryPlural: "Pest Control Businesses",
  growthMetric: "Bookings",
  slug: "pest-control-marketing-software",
  heroHeadline: "Book More Pest Control Jobs on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star reviews, auto-publish service posts, and dominate local searches while you focus on the job.",
  heroImage: pestHero,
  heroImageAlt: "Pest control technician with spray equipment at a home",
  customerNoun: "customers",
  contentNoun: "service content",
  qrPlace: "on your service invoice",
  revenueParagraph:
    "Over 85% of local service discovery happens on Google Maps. Vizogen's users see a 3x increase in service calls within 90 days.",
  benefits: [
    {
      icon: Bug,
      title: "Get More Service Calls",
      description:
        "Auto-collect reviews from satisfied customers so urgent searches ring your phone first.",
    },
    {
      icon: Sparkles,
      title: "Automate Service Posts",
      description:
        "AI posts on treatments and seasonal pest alerts, published to your profile daily.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Rating",
      description: "Review Shield filters complaints privately before they go public.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Business Profile",
      description: "One secure Google login links your Business Profile to Vizogen.",
    },
    {
      title: "AI Generates Service Content",
      description:
        "Vizogen learns your treatments, areas served and offers, then posts daily.",
    },
    {
      title: "Capture Post-Service Reviews via Magic QR",
      description:
        "Customers scan after a treatment and your 5-star reviews start compounding.",
    },
    {
      title: "Smart Review Replies",
      description: "Every review gets a fast, on-brand reply that Google rewards.",
    },
    {
      title: "Watch Bookings Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing inside your dashboard.",
    },
  ],
  galleryTitles: [
    "Termite Treatment",
    "Monsoon Pest Alert",
    "Cockroach Control",
    "Annual Contract",
    "Same-Day Service",
    "Herbal Safe Spray",
  ],
  whatsappMessage: "Hi Vizogen, I want to grow my Pest Control business.",
  seoTitle: "Pest Control Marketing Software & Local SEO | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for pest control businesses: daily AI service posts, 5-star reviews, smart replies and Top 3 map rankings.",
});

export const garageConfig = buildConfig({
  industryName: "Car Garages & Mechanics",
  industrySingular: "Garage",
  industryPlural: "Garages",
  growthMetric: "Bookings",
  slug: "car-garage-marketing-software",
  heroHeadline: "Fill Your Service Bays on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star reviews, auto-publish service posts, and dominate local searches while you focus on repairs.",
  heroImage: garageHero,
  heroImageAlt: "Mechanic servicing a car inside a clean modern garage",
  customerNoun: "drivers",
  contentNoun: "service content",
  qrPlace: "at the service desk",
  revenueParagraph:
    "Over 85% of drivers find garages through Google Maps. Vizogen's users see a 3x increase in calls and walk-ins within 90 days.",
  benefits: [
    {
      icon: Car,
      title: "Get More Customers",
      description:
        "Auto-collect reviews from happy drivers so nearby searches land in your bays.",
    },
    {
      icon: Sparkles,
      title: "Automate Service Posts",
      description:
        "AI posts on offers and maintenance tips, published to your profile every day.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Rating",
      description: "Review Shield filters negative feedback privately.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Garage Profile",
      description: "One secure Google login links your Business Profile to Vizogen.",
    },
    {
      title: "AI Generates Service Content",
      description:
        "Vizogen learns your services, brands handled and offers, then posts daily.",
    },
    {
      title: "Capture Post-Service Reviews via Magic QR",
      description:
        "Drivers scan at pickup and your 5-star reviews start compounding.",
    },
    {
      title: "Smart Review Replies",
      description: "Every review gets a fast, on-brand reply that Google rewards.",
    },
    {
      title: "Watch Bookings Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing inside your dashboard.",
    },
  ],
  galleryTitles: [
    "Free Car Checkup",
    "AC Service Offer",
    "Monsoon Care Tips",
    "Denting & Painting",
    "Doorstep Pickup",
    "Annual Service Pack",
  ],
  whatsappMessage: "Hi Vizogen, I want to grow my Car Garage business.",
  seoTitle: "Car Garage Marketing Software & Local SEO | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for car garages: daily AI service posts, 5-star reviews, smart replies and Top 3 local map rankings.",
});

export const travelConfig = buildConfig({
  industryName: "Tours & Travels",
  industrySingular: "Travel Business",
  industryPlural: "Travel Businesses",
  growthMetric: "Bookings",
  slug: "tour-travel-marketing-software",
  heroHeadline: "Book More Trips on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star reviews, auto-publish trip packages, and dominate local searches while you focus on your travelers.",
  heroImage: travelHero,
  heroImageAlt: "Travel agent planning a trip with customers at a bright office",
  customerNoun: "travelers",
  contentNoun: "travel content",
  qrPlace: "in your trip welcome kit",
  revenueParagraph:
    "Over 85% of travelers discover local tour operators via Google Maps. Vizogen's users see a 3x increase in inquiry calls within 90 days.",
  benefits: [
    {
      icon: Plane,
      title: "Get More Bookings",
      description:
        "Auto-collect reviews from happy travelers so new enquiries trust you instantly.",
    },
    {
      icon: Sparkles,
      title: "Automate Package Posts",
      description:
        "AI posts on trip packages and seasonal offers, published to your profile daily.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Rating",
      description: "Review Shield filters bad experiences privately.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Business Profile",
      description: "One secure Google login links your Business Profile to Vizogen.",
    },
    {
      title: "AI Generates Travel Content",
      description:
        "Vizogen learns your destinations, packages and pricing, then posts daily.",
    },
    {
      title: "Capture Post-Trip Reviews via Magic QR",
      description:
        "Travelers scan after their trip and your 5-star reviews start compounding.",
    },
    {
      title: "Smart Review Replies",
      description: "Every review gets a fast, on-brand reply that Google rewards.",
    },
    {
      title: "Watch Bookings Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing inside your dashboard.",
    },
  ],
  galleryTitles: [
    "Weekend Getaway",
    "Hill Station Package",
    "Group Tour Offer",
    "Visa Assistance",
    "Honeymoon Special",
    "Early Bird Deal",
  ],
  whatsappMessage: "Hi Vizogen, I want to grow my Tours & Travels business.",
  seoTitle: "Tour & Travel Marketing Software & Local SEO | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for tour operators: daily AI package posts, 5-star reviews, smart replies and Top 3 local map rankings.",
});

export const yogaConfig = buildConfig({
  industryName: "Yoga & Wellness",
  industrySingular: "Studio",
  industryPlural: "Studios",
  growthMetric: "Memberships",
  slug: "yoga-wellness-marketing-software",
  heroHeadline: "Fill Your Classes on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star reviews, auto-publish class schedules, and dominate local searches while you focus on your practice.",
  heroImage: yogaHero,
  heroImageAlt: "Yoga class practicing in a sunlit studio",
  customerNoun: "attendees",
  contentNoun: "wellness content",
  qrPlace: "at the studio entrance",
  revenueParagraph:
    "Over 85% of wellness seekers discover studios via Google Maps. Vizogen's users see a 3x increase in inquiry calls within 90 days.",
  benefits: [
    {
      icon: Flower2,
      title: "Get More Members",
      description:
        "Auto-collect reviews from happy attendees so trial sign-ups arrive every week.",
    },
    {
      icon: Sparkles,
      title: "Automate Class Posts",
      description:
        "AI posts on schedules and wellness tips, published to your profile daily.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Rating",
      description: "Review Shield filters complaints privately.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Studio Profile",
      description: "One secure Google login links your Business Profile to Vizogen.",
    },
    {
      title: "AI Generates Wellness Content",
      description:
        "Vizogen learns your classes, teachers and timings, then posts daily.",
    },
    {
      title: "Capture Post-Class Reviews via Magic QR",
      description:
        "Attendees scan after a class and your 5-star reviews start compounding.",
    },
    {
      title: "Smart Review Replies",
      description: "Every review gets a fast, on-brand reply that Google rewards.",
    },
    {
      title: "Watch Memberships Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing inside your dashboard.",
    },
  ],
  galleryTitles: [
    "Morning Batch Open",
    "Free Trial Class",
    "Meditation Workshop",
    "Prenatal Yoga",
    "Wellness Tip",
    "Monthly Membership",
  ],
  whatsappMessage: "Hi Vizogen, I want to grow my Yoga & Wellness business.",
  seoTitle: "Yoga & Wellness Marketing Software & Local SEO | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for yoga studios: daily AI class posts, 5-star reviews, smart replies and Top 3 local map rankings.",
});

export const handymanConfig = buildConfig({
  industryName: "Handyman Services",
  industrySingular: "Handyman Business",
  industryPlural: "Handyman Businesses",
  growthMetric: "Bookings",
  slug: "handyman-marketing-software",
  heroHeadline: "Book More Jobs on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star reviews, auto-publish service posts, and dominate local searches while you focus on the work.",
  heroImage: handymanHero,
  heroImageAlt: "Handyman repairing a cabinet in a bright home",
  customerNoun: "customers",
  contentNoun: "service content",
  qrPlace: "on your job completion slip",
  revenueParagraph:
    "Over 85% of homeowners find handyman services via Google Maps. Vizogen's users see a 3x increase in service calls within 90 days.",
  benefits: [
    {
      icon: Hammer,
      title: "Get More Jobs",
      description:
        "Auto-collect reviews from satisfied customers so nearby jobs come to you first.",
    },
    {
      icon: Sparkles,
      title: "Automate Service Posts",
      description:
        "AI posts showcasing completed work and offers, published to your profile daily.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Rating",
      description: "Review Shield filters complaints privately.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Business Profile",
      description: "One secure Google login links your Business Profile to Vizogen.",
    },
    {
      title: "AI Generates Service Content",
      description: "Vizogen learns your skills, areas served and rates, then posts daily.",
    },
    {
      title: "Capture Post-Job Reviews via Magic QR",
      description:
        "Customers scan after a job and your 5-star reviews start compounding.",
    },
    {
      title: "Smart Review Replies",
      description: "Every review gets a fast, on-brand reply that Google rewards.",
    },
    {
      title: "Watch Bookings Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing inside your dashboard.",
    },
  ],
  galleryTitles: [
    "Same-Day Repairs",
    "Kitchen Fix-Up",
    "Plumbing Service",
    "Electrical Work",
    "Furniture Assembly",
    "Home Maintenance Pack",
  ],
  whatsappMessage: "Hi Vizogen, I want to grow my Handyman business.",
  seoTitle: "Handyman Marketing Software & Local SEO | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for handyman services: daily AI service posts, 5-star reviews, smart replies and Top 3 map rankings.",
});

export const educationConfig = buildConfig({
  industryName: "Education & Coaching",
  industrySingular: "Institute",
  industryPlural: "Institutes",
  growthMetric: "Enrollments",
  slug: "education-marketing-software",
  heroHeadline: "Fill Your Batches on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star reviews, auto-publish course updates, and dominate local searches while you focus on teaching.",
  heroImage: educationHero,
  heroImageAlt: "Teacher taking a class in a bright modern coaching classroom",
  customerNoun: "students",
  contentNoun: "course content",
  qrPlace: "at the admissions desk",
  revenueParagraph:
    "Over 85% of parents and students discover coaching institutes via Google Maps. Vizogen's users see a 3x increase in inquiry calls within 90 days.",
  benefits: [
    {
      icon: GraduationCap,
      title: "Get More Enrollments",
      description:
        "Auto-collect reviews from happy students and parents so admission enquiries keep coming.",
    },
    {
      icon: Sparkles,
      title: "Automate Course Posts",
      description:
        "AI posts on batches, results and offers, published to your profile daily.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Rating",
      description: "Review Shield filters complaints privately.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Institute Profile",
      description: "One secure Google login links your Business Profile to Vizogen.",
    },
    {
      title: "AI Generates Course Content",
      description: "Vizogen learns your courses, faculty and results, then posts daily.",
    },
    {
      title: "Capture Reviews via Magic QR",
      description:
        "Students and parents scan on campus and your 5-star reviews start compounding.",
    },
    {
      title: "Smart Review Replies",
      description: "Every review gets a fast, on-brand reply that Google rewards.",
    },
    {
      title: "Watch Enrollments Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing inside your dashboard.",
    },
  ],
  galleryTitles: [
    "New Batch Starting",
    "Topper Results",
    "Demo Class Free",
    "Crash Course",
    "Scholarship Test",
    "Weekend Batch",
  ],
  whatsappMessage: "Hi Vizogen, I want to grow my Education business.",
  seoTitle: "Education & Coaching Marketing Software | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for coaching institutes: daily AI course posts, 5-star reviews, smart replies and Top 3 map rankings.",
});

export const realEstateConfig = buildConfig({
  industryName: "Real Estate Agents",
  industrySingular: "Real Estate Business",
  industryPlural: "Real Estate Agents",
  growthMetric: "Leads",
  slug: "realestate-marketing-software",
  heroHeadline: "Close More Deals on Autopilot",
  heroSubtext:
    "Stop worrying about marketing. Use Vizogen to get more 5-star reviews, auto-publish listing posts, and dominate local searches while you focus on clients.",
  heroImage: realestateHero,
  heroImageAlt: "Real estate agent handing keys to a happy couple",
  customerNoun: "clients",
  contentNoun: "listing content",
  qrPlace: "in your site-visit folder",
  revenueParagraph:
    "Over 85% of buyers and renters discover agents via Google Maps. Vizogen's users see a 3x increase in inquiry calls within 90 days.",
  benefits: [
    {
      icon: Building2,
      title: "Get More Leads",
      description:
        "Auto-collect reviews from happy clients so buyers pick you over the next listing.",
    },
    {
      icon: Sparkles,
      title: "Automate Listing Posts",
      description:
        "AI posts on new listings and market updates, published to your profile daily.",
    },
    {
      icon: ShieldCheck,
      title: "Protect Your Rating",
      description: "Review Shield filters complaints privately.",
    },
  ],
  timelineSteps: [
    {
      title: "Connect Your Business Profile",
      description: "One secure Google login links your Business Profile to Vizogen.",
    },
    {
      title: "AI Generates Listing Content",
      description: "Vizogen learns your localities, inventory and pricing, then posts daily.",
    },
    {
      title: "Capture Post-Deal Reviews via Magic QR",
      description:
        "Clients scan after closing and your 5-star reviews start compounding.",
    },
    {
      title: "Smart Review Replies",
      description: "Every review gets a fast, on-brand reply that Google rewards.",
    },
    {
      title: "Watch Leads Grow",
      description:
        "Track calls, direction requests and local keyword ranks climbing inside your dashboard.",
    },
  ],
  galleryTitles: [
    "New 3BHK Listing",
    "Ready to Move",
    "Market Update",
    "Rental Options",
    "Site Visit Weekend",
    "Investment Picks",
  ],
  whatsappMessage: "Hi Vizogen, I want to grow my Real Estate business.",
  seoTitle: "Real Estate Marketing Software & Local SEO | Vizogen",
  seoDescription:
    "Vizogen automates Google Business Profile marketing for real estate agents: daily AI listing posts, 5-star reviews, smart replies and Top 3 map rankings.",
});

/** Registry of every live industry page, keyed by homepage grid label. */
export const allIndustryConfigs: Record<string, IndustryConfig> = {
  "Gym & Fitness Centres": gymConfig,
  "Doctors & Health Clinics": clinicConfig,
  "Bakers & Cake Shops": bakeryConfig,
  "Salon Owners": salonConfig,
  "Restaurants & Bars": restaurantConfig,
  "Pest Control Businesses": pestControlConfig,
  "Car Garages & Mechanics": garageConfig,
  "Tours & Travels": travelConfig,
  "Yoga & Wellness": yogaConfig,
  "Handyman Services": handymanConfig,
  "Education & Coaching": educationConfig,
  "Real Estate Agents": realEstateConfig,
};
