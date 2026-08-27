/**
 * Deterministic generator for industry-specific customer testimonials.
 * Each industry page gets 10 reviews written around its own customers,
 * content type and local search intent — config-only, no component changes.
 */
export type IndustryTestimonial = {
  quote: string;
  name: string;
  business: string;
  city: string;
  initials: string;
  rating: number;
  result: string;
};

const OWNERS = [
  "Rahul Mehta",
  "Priya Nair",
  "Karan Shah",
  "Sneha Kulkarni",
  "Aditya Verma",
  "Meera Iyer",
  "Vikram Chauhan",
  "Fatima Sheikh",
  "Rohit Deshmukh",
  "Ananya Rao",
  "Manish Patel",
  "Divya Menon",
  "Sandeep Bhatia",
  "Neha Joshi",
  "Arjun Reddy",
  "Kavya Pillai",
  "Imran Qureshi",
  "Pooja Agarwal",
  "Harshad Trivedi",
  "Ritika Sen",
];

const CITIES = [
  "Mumbai",
  "Rajkot",
  "Bangalore",
  "Pune",
  "Delhi",
  "Ahmedabad",
  "Hyderabad",
  "Surat",
  "Jaipur",
  "Kolkata",
  "Indore",
  "Chandigarh",
];

const BRAND_PREFIXES = [
  "Urban",
  "Sunrise",
  "Prime",
  "Elite",
  "Royal",
  "Nova",
  "Shree",
  "Metro",
  "Bright",
  "Apex",
  "Green Leaf",
  "Silver Oak",
];

const RESULTS = [
  "3.2x more calls from Maps",
  "Top 3 for local searches",
  "+128 new Google reviews",
  "Rating 4.2 → 4.9",
  "Saved 24 hrs/month",
  "2.6x direction requests",
  "+92% profile views",
  "Agency cost cut by 70%",
  "Daily posts, zero effort",
  "+180 leads in 90 days",
];

type Tokens = {
  singular: string;
  plural: string;
  customerNoun: string;
  contentNoun: string;
  searchTerm: string;
  brandSuffix: string;
};

const QUOTE_TEMPLATES: ((t: Tokens) => string)[] = [
  (t) =>
    `We used to post on Google once a month. Vizogen now publishes ${t.contentNoun} every single day and our Maps calls have more than tripled.`,
  (t) =>
    `I was paying an agency ₹25,000 a month for less than what Vizogen does automatically. Best switch we made for the ${t.singular.toLowerCase()}.`,
  (t) =>
    `The Magic QR is the hero. ${cap(t.customerNoun)} scan it before leaving and we've added over a hundred 5-star reviews without asking anyone twice.`,
  (t) =>
    `We now show up in the top 3 for "${t.searchTerm}" in our area. New ${t.customerNoun} literally say they found us on Google Maps.`,
  (t) =>
    `The AI replies sound exactly like me. Every review is answered within minutes, and our rating climbed from 4.2 to 4.9.`,
  (t) =>
    `Zero design skills needed. The ${t.contentNoun} Vizogen creates looks better than what our old freelancer delivered.`,
  (t) =>
    `Negative feedback now comes to us privately instead of landing on our profile. That alone protected our rating this year.`,
  (t) =>
    `I check the dashboard on Monday and see exactly where we rank. For a small ${t.singular.toLowerCase()} that visibility is priceless.`,
  (t) =>
    `Onboarding took ten minutes. By the next morning our profile had fresh posts and our first new enquiry from search.`,
  (t) =>
    `Other ${t.plural.toLowerCase()} in my city are still doing this manually. Vizogen quietly gave us a 20+ hour a month head start.`,
];

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function buildIndustryTestimonials(opts: {
  industrySingular: string;
  industryPlural: string;
  customerNoun: string;
  contentNoun: string;
  /** business-name suffix, e.g. "Gym", "Salon" */
  brandSuffix?: string;
  searchTerm?: string;
  /** stable offset so each industry gets different names/cities */
  seed: number;
}): IndustryTestimonial[] {
  const tokens: Tokens = {
    singular: opts.industrySingular,
    plural: opts.industryPlural,
    customerNoun: opts.customerNoun,
    contentNoun: opts.contentNoun,
    searchTerm: opts.searchTerm ?? `${opts.industrySingular.toLowerCase()} near me`,
    brandSuffix: opts.brandSuffix ?? opts.industrySingular,
  };

  return Array.from({ length: 10 }, (_, i) => {
    const owner = OWNERS[(opts.seed * 3 + i * 2) % OWNERS.length]!;
    const city = CITIES[(opts.seed * 5 + i) % CITIES.length]!;
    const prefix = BRAND_PREFIXES[(opts.seed * 7 + i) % BRAND_PREFIXES.length]!;
    return {
      quote: QUOTE_TEMPLATES[i]!(tokens),
      name: owner,
      business: `${prefix} ${tokens.brandSuffix}`,
      city,
      initials: initials(owner),
      rating: 5,
      result: RESULTS[(opts.seed + i) % RESULTS.length]!,
    };
  });
}
