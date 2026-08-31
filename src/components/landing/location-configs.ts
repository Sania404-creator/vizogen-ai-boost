export type LocationConfig = {
  slug: string;
  city: string;
  region: string;
  headline: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  neighbourhoods: string[];
  industries: string[];
  localInsight: string;
  searchBehaviour: string;
  faqs: { q: string; a: string }[];
};

const baseFaqs = (city: string) => [
  {
    q: `How long does it take to rank in the Google Maps 3-Pack in ${city}?`,
    a: `Most ${city} businesses see movement in local pack visibility within 4–8 weeks. Categories, service areas and post frequency improve fastest; review volume and prominence build over 3–6 months of consistent activity.`,
  },
  {
    q: `Do you work with small single-location businesses in ${city}?`,
    a: `Yes. The majority of our ${city} clients are single-location businesses — clinics, salons, garages, bakeries, gyms and local service providers who compete against bigger brands on the map.`,
  },
  {
    q: `Do I need to give access to my Google Business Profile?`,
    a: `You connect your profile yourself through Google's official OAuth screen in the Vizogen dashboard. You keep ownership, and you can disconnect anytime.`,
  },
];

export const locations: LocationConfig[] = [
  {
    slug: "ahmedabad",
    city: "Ahmedabad",
    region: "Gujarat",
    headline: "Local SEO Services in Ahmedabad",
    intro:
      "Ahmedabad is one of India's most competitive local search markets — from CG Road retail to Prahlad Nagar clinics and SG Highway showrooms, customers decide within the first three map results. Vizogen automates the Google Business Profile work that decides who those three are.",
    metaTitle: "Local SEO Services in Ahmedabad, Gujarat | Vizogen",
    metaDescription:
      "Local SEO and Google Business Profile management for Ahmedabad businesses. Rank in the Google Maps 3-Pack across SG Highway, Prahlad Nagar, CG Road, Maninagar and Bopal with AI posts and review automation.",
    keywords: [
      "best SEO agency Ahmedabad",
      "local SEO services Ahmedabad",
      "Google Business Profile management Ahmedabad",
      "Google Maps ranking Ahmedabad",
      "GMB expert Ahmedabad",
    ],
    neighbourhoods: [
      "SG Highway",
      "Prahlad Nagar",
      "CG Road",
      "Satellite",
      "Bopal",
      "Maninagar",
      "Vastrapur",
      "Navrangpura",
      "Chandkheda",
      "Gota",
    ],
    industries: [
      "Clinics & dental practices",
      "Salons & spas",
      "Restaurants & cafés",
      "Real estate offices",
      "Car garages & detailers",
      "Coaching institutes",
    ],
    localInsight:
      "Ahmedabad searches are highly area-led: people type \u201Cnear me\u201D alongside a locality name such as Satellite, Bopal or Maninagar. We build your service areas, categories and post language around the localities you actually serve, so proximity and relevance signals line up instead of fighting each other.",
    searchBehaviour:
      "Bilingual search matters here — a large share of queries mix English with Gujarati transliteration. Vizogen's AI posts, service descriptions and review replies are written to read naturally for both, which lifts engagement and click-to-call rates on your profile.",
    faqs: [
      {
        q: "Why does location-specific SEO matter so much in Ahmedabad?",
        a: "Google filters local results by proximity to the searcher. A profile optimized for \u201CAhmedabad\u201D generally is weaker than one optimized around the specific corridors you serve — SG Highway, Prahlad Nagar, Satellite, Maninagar — with matching posts, photos and service areas.",
      },
      ...baseFaqs("Ahmedabad"),
    ],
  },
  {
    slug: "gujarat",
    city: "Gujarat",
    region: "India",
    headline: "Local SEO Services across Gujarat",
    intro:
      "Vizogen is operated by NG Marketing Solution from Rajkot, and works with businesses across Gujarat — Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Bhavnagar and Jamnagar. One dashboard, one profile strategy, every city you trade in.",
    metaTitle: "Local SEO Services in Gujarat | Vizogen (Rajkot Based)",
    metaDescription:
      "Gujarat-based local SEO and Google Business Profile automation. Rajkot-operated team helping businesses in Ahmedabad, Surat, Vadodara, Rajkot and Gandhinagar rank higher on Google Maps.",
    keywords: [
      "best SEO agency Gujarat",
      "local SEO services Gujarat",
      "GMB agency Rajkot",
      "Google Business Profile Gujarat",
      "SEO company Surat Vadodara",
    ],
    neighbourhoods: [
      "Ahmedabad",
      "Surat",
      "Vadodara",
      "Rajkot",
      "Gandhinagar",
      "Bhavnagar",
      "Jamnagar",
      "Anand",
      "Junagadh",
      "Mehsana",
    ],
    industries: [
      "Multi-branch retail",
      "Manufacturing & B2B suppliers",
      "Hospitals & clinics",
      "Hotels & travel operators",
      "Education & coaching",
      "Home services",
    ],
    localInsight:
      "Multi-city Gujarat businesses lose rankings when branches share one profile or duplicate the same description. We keep each branch distinct — separate categories, service areas, photos and post schedules — so branches stop cannibalising each other in the map pack.",
    searchBehaviour:
      "Tier-2 Gujarat cities convert on calls, not forms. Vizogen keeps hours, holiday hours, Q&A and review replies current, which is exactly what Google uses to decide whether to surface your call button in the local pack.",
    faqs: [
      {
        q: "Do you handle multi-branch businesses across Gujarat?",
        a: "Yes. Each location gets its own optimized profile and post cadence under a single Vizogen account, so you review performance city by city.",
      },
      ...baseFaqs("Gujarat"),
    ],
  },
  {
    slug: "rajkot",
    city: "Rajkot",
    region: "Gujarat",
    headline: "Local SEO Services in Rajkot",
    intro:
      "Rajkot is our home city — NG Marketing Solution operates Vizogen from RK Iconic on the 150 Feet Ring Road. We know how local buyers here search, compare and call.",
    metaTitle: "Local SEO Services in Rajkot, Gujarat | Vizogen",
    metaDescription:
      "Rajkot-based local SEO and Google Business Profile automation by Vizogen (NG Marketing Solution). Rank higher on Google Maps across 150 Feet Ring Road, Kalawad Road and University Road.",
    keywords: [
      "SEO agency Rajkot",
      "local SEO services Rajkot",
      "GMB management Rajkot",
      "Google Maps ranking Rajkot",
    ],
    neighbourhoods: [
      "150 Feet Ring Road",
      "Kalawad Road",
      "University Road",
      "Sheetal Park",
      "Mavdi",
      "Raiya Road",
      "Gondal Road",
      "Yagnik Road",
    ],
    industries: [
      "Engineering & machine tools",
      "Jewellery & retail",
      "Clinics & diagnostics",
      "Restaurants",
      "Gyms & fitness studios",
      "Automotive workshops",
    ],
    localInsight:
      "Ring-road businesses compete inside a very tight radius, so prominence decides the pack. We push steady review acquisition and daily posts, the two signals a competitor down the road usually neglects.",
    searchBehaviour:
      "Rajkot buyers check photos before calling. Vizogen keeps a fresh stream of AI-designed posts and offers on your profile so the listing never looks dormant.",
    faqs: baseFaqs("Rajkot"),
  },
  {
    slug: "surat",
    city: "Surat",
    region: "Gujarat",
    headline: "Local SEO Services in Surat",
    intro:
      "Textile, diamond and fast-growing service businesses in Surat all fight for the same map positions. Vizogen keeps your profile active and relevant every single day.",
    metaTitle: "Local SEO Services in Surat, Gujarat | Vizogen",
    metaDescription:
      "Local SEO and Google Business Profile automation for Surat businesses. Rank higher on Google Maps across Vesu, Adajan, Piplod and Athwalines with AI posts and review management.",
    keywords: [
      "SEO agency Surat",
      "local SEO services Surat",
      "GMB management Surat",
      "Google Maps ranking Surat",
    ],
    neighbourhoods: [
      "Vesu",
      "Adajan",
      "Piplod",
      "Athwalines",
      "Katargam",
      "Pal",
      "Varachha",
      "City Light",
    ],
    industries: [
      "Textile showrooms",
      "Jewellery retail",
      "Clinics & dental",
      "Salons",
      "Restaurants & bakeries",
      "Coaching institutes",
    ],
    localInsight:
      "Surat's newer corridors like Vesu and Pal have dense clusters of similar businesses. Precise categories plus locality-specific posts are what separate the top three from everyone below the fold.",
    searchBehaviour:
      "High mobile-first search volume with strong evening peaks — we schedule posts and offers so fresh content lands right before demand.",
    faqs: baseFaqs("Surat"),
  },
  {
    slug: "vadodara",
    city: "Vadodara",
    region: "Gujarat",
    headline: "Local SEO Services in Vadodara",
    intro:
      "From Alkapuri to Gotri, Vadodara customers search short and act fast. Vizogen makes sure your Google Business Profile answers them first.",
    metaTitle: "Local SEO Services in Vadodara, Gujarat | Vizogen",
    metaDescription:
      "Google Business Profile management and local SEO for Vadodara businesses. Rank higher on Google Maps in Alkapuri, Gotri, Manjalpur and Sayajigunj with Vizogen automation.",
    keywords: [
      "SEO agency Vadodara",
      "local SEO services Vadodara",
      "GMB management Baroda",
      "Google Maps ranking Vadodara",
    ],
    neighbourhoods: [
      "Alkapuri",
      "Gotri",
      "Manjalpur",
      "Sayajigunj",
      "Waghodia Road",
      "Akota",
      "Karelibaug",
      "Vasna",
    ],
    industries: [
      "Clinics & hospitals",
      "Restaurants & cafés",
      "Interior & home services",
      "Salons & wellness",
      "Education",
      "Automotive",
    ],
    localInsight:
      "Vadodara profiles often carry outdated hours and thin service lists. Fixing structure first, then layering daily posts, usually produces the quickest pack movement.",
    searchBehaviour:
      "Comparison-heavy searching: reviews and replies carry unusual weight, so automated, personalised review replies matter here.",
    faqs: baseFaqs("Vadodara"),
  },
  {
    slug: "mumbai",
    city: "Mumbai",
    region: "Maharashtra",
    headline: "Local SEO Services in Mumbai",
    intro:
      "Mumbai's map results change street by street. Vizogen builds proximity, relevance and prominence signals for the exact suburbs you serve.",
    metaTitle: "Local SEO Services in Mumbai | Vizogen",
    metaDescription:
      "Local SEO and Google Business Profile automation for Mumbai businesses. Rank higher on Google Maps in Andheri, Bandra, Powai, Thane and Borivali with AI posts and review management.",
    keywords: [
      "local SEO services Mumbai",
      "Google Business Profile management Mumbai",
      "GMB expert Mumbai",
      "Google Maps ranking Mumbai",
    ],
    neighbourhoods: [
      "Andheri",
      "Bandra",
      "Powai",
      "Lower Parel",
      "Borivali",
      "Thane",
      "Chembur",
      "Malad",
    ],
    industries: [
      "Clinics & aesthetics",
      "Cafés & restaurants",
      "Fitness studios",
      "Salons & spas",
      "Real estate",
      "Home services",
    ],
    localInsight:
      "Because of extreme density, Mumbai listings win on prominence — review velocity, Q&A and photo freshness — far more than on keywords alone.",
    searchBehaviour:
      "Commuter-driven search spikes morning and late evening; scheduled posts keep your profile freshest in those windows.",
    faqs: baseFaqs("Mumbai"),
  },
  {
    slug: "delhi",
    city: "Delhi",
    region: "Delhi NCR",
    headline: "Local SEO Services in Delhi NCR",
    intro:
      "Delhi, Noida and Gurgaon behave like separate markets inside one metro. Vizogen tunes each profile to the market it actually trades in.",
    metaTitle: "Local SEO Services in Delhi NCR | Vizogen",
    metaDescription:
      "Local SEO and Google Business Profile automation for Delhi NCR businesses. Rank higher on Google Maps in South Delhi, Dwarka, Noida and Gurgaon with Vizogen.",
    keywords: [
      "local SEO services Delhi",
      "Google Business Profile management Delhi",
      "GMB agency Delhi NCR",
      "Google Maps ranking Delhi",
    ],
    neighbourhoods: [
      "South Delhi",
      "Dwarka",
      "Rohini",
      "Karol Bagh",
      "Janakpuri",
      "Noida",
      "Gurgaon",
      "Pitampura",
    ],
    industries: [
      "Clinics & dental",
      "Restaurants",
      "Coaching institutes",
      "Salons",
      "Legal & CA firms",
      "Home services",
    ],
    localInsight:
      "Duplicate and suspended listings are common in Delhi. We stabilise profile health first, then scale posting and review acquisition.",
    searchBehaviour:
      "Highly price-comparative queries; offer posts and updated service pricing lift conversion from map views to calls.",
    faqs: baseFaqs("Delhi"),
  },
  {
    slug: "bangalore",
    city: "Bangalore",
    region: "Karnataka",
    headline: "Local SEO Services in Bangalore",
    intro:
      "Indiranagar, Koramangala, Whitefield — Bangalore searchers are digital-first and review-driven. Vizogen keeps your profile competitive in all of them.",
    metaTitle: "Local SEO Services in Bangalore | Vizogen",
    metaDescription:
      "Google Business Profile automation and local SEO for Bangalore businesses. Rank higher on Google Maps in Koramangala, Indiranagar, Whitefield and HSR Layout.",
    keywords: [
      "local SEO services Bangalore",
      "Google Business Profile management Bangalore",
      "GMB expert Bengaluru",
      "Google Maps ranking Bangalore",
    ],
    neighbourhoods: [
      "Koramangala",
      "Indiranagar",
      "Whitefield",
      "HSR Layout",
      "Jayanagar",
      "Marathahalli",
      "Hebbal",
      "Electronic City",
    ],
    industries: [
      "Cafés & cloud kitchens",
      "Fitness & yoga studios",
      "Clinics & wellness",
      "Salons",
      "Co-working & services",
      "Pet & home services",
    ],
    localInsight:
      "Bangalore users read reviews before calling, so reply speed and sentiment are ranking-adjacent conversion levers. Vizogen replies within minutes, automatically.",
    searchBehaviour:
      "Very high share of \u201Copen now\u201D and \u201Cnear me\u201D searches — accurate hours and live updates are non-negotiable.",
    faqs: baseFaqs("Bangalore"),
  },
  {
    slug: "hyderabad",
    city: "Hyderabad",
    region: "Telangana",
    headline: "Local SEO Services in Hyderabad",
    intro:
      "From Gachibowli to Banjara Hills, Hyderabad's growth corridors are crowded with new listings. Consistent activity is what keeps you visible.",
    metaTitle: "Local SEO Services in Hyderabad | Vizogen",
    metaDescription:
      "Local SEO and Google Business Profile automation for Hyderabad businesses. Rank higher on Google Maps in Gachibowli, Banjara Hills, Kukatpally and Madhapur.",
    keywords: [
      "local SEO services Hyderabad",
      "Google Business Profile management Hyderabad",
      "GMB agency Hyderabad",
      "Google Maps ranking Hyderabad",
    ],
    neighbourhoods: [
      "Gachibowli",
      "Madhapur",
      "Banjara Hills",
      "Kukatpally",
      "Kondapur",
      "Begumpet",
      "Uppal",
      "Miyapur",
    ],
    industries: [
      "Clinics & diagnostics",
      "Restaurants",
      "Real estate",
      "Salons & spas",
      "Education",
      "Automotive",
    ],
    localInsight:
      "New listings in IT corridors ramp quickly with structured categories plus a first wave of authentic reviews — exactly what Magic QR is built for.",
    searchBehaviour:
      "Bilingual Telugu-English queries; our AI copy handles both naturally.",
    faqs: baseFaqs("Hyderabad"),
  },
  {
    slug: "pune",
    city: "Pune",
    region: "Maharashtra",
    headline: "Local SEO Services in Pune",
    intro:
      "Kothrud, Baner, Hinjewadi and Viman Nagar each rank independently. Vizogen aligns your profile to the pockets that bring revenue.",
    metaTitle: "Local SEO Services in Pune | Vizogen",
    metaDescription:
      "Google Business Profile management and local SEO for Pune businesses. Rank higher on Google Maps in Baner, Kothrud, Hinjewadi and Viman Nagar with Vizogen.",
    keywords: [
      "local SEO services Pune",
      "Google Business Profile management Pune",
      "GMB expert Pune",
      "Google Maps ranking Pune",
    ],
    neighbourhoods: [
      "Baner",
      "Kothrud",
      "Hinjewadi",
      "Viman Nagar",
      "Wakad",
      "Kharadi",
      "Aundh",
      "Hadapsar",
    ],
    industries: [
      "Restaurants & bakeries",
      "Clinics",
      "Gyms & studios",
      "Salons",
      "Education",
      "Home services",
    ],
    localInsight:
      "Student and IT-worker demand shifts seasonally; scheduled campaign posts keep offers aligned with those cycles.",
    searchBehaviour:
      "Strong weekend discovery searching — weekend post scheduling reliably lifts profile views.",
    faqs: baseFaqs("Pune"),
  },
  {
    slug: "chennai",
    city: "Chennai",
    region: "Tamil Nadu",
    headline: "Local SEO Services in Chennai",
    intro:
      "Chennai buyers search precisely and locally. A well-structured, continuously updated profile is the fastest route into the 3-Pack.",
    metaTitle: "Local SEO Services in Chennai | Vizogen",
    metaDescription:
      "Local SEO and Google Business Profile automation for Chennai businesses. Rank higher on Google Maps in T. Nagar, Anna Nagar, Velachery and OMR.",
    keywords: [
      "local SEO services Chennai",
      "Google Business Profile management Chennai",
      "GMB agency Chennai",
      "Google Maps ranking Chennai",
    ],
    neighbourhoods: [
      "T. Nagar",
      "Anna Nagar",
      "Velachery",
      "OMR",
      "Adyar",
      "Porur",
      "Mylapore",
      "Tambaram",
    ],
    industries: [
      "Clinics & hospitals",
      "Restaurants",
      "Retail showrooms",
      "Salons",
      "Education",
      "Automotive",
    ],
    localInsight:
      "Tamil-language reviews and replies improve trust signals locally; our review replies mirror the reviewer's language.",
    searchBehaviour:
      "High call-intent traffic — accurate hours, holiday hours and service lists convert best.",
    faqs: baseFaqs("Chennai"),
  },
  {
    slug: "kolkata",
    city: "Kolkata",
    region: "West Bengal",
    headline: "Local SEO Services in Kolkata",
    intro:
      "Salt Lake, Park Street, Behala — Kolkata's map results reward businesses that stay active week after week.",
    metaTitle: "Local SEO Services in Kolkata | Vizogen",
    metaDescription:
      "Google Business Profile automation and local SEO for Kolkata businesses. Rank higher on Google Maps in Salt Lake, Park Street, New Town and Behala.",
    keywords: [
      "local SEO services Kolkata",
      "Google Business Profile management Kolkata",
      "GMB expert Kolkata",
      "Google Maps ranking Kolkata",
    ],
    neighbourhoods: [
      "Salt Lake",
      "Park Street",
      "New Town",
      "Behala",
      "Ballygunge",
      "Howrah",
      "Garia",
      "Dumdum",
    ],
    industries: [
      "Restaurants & sweet shops",
      "Clinics",
      "Retail",
      "Salons",
      "Education",
      "Travel operators",
    ],
    localInsight:
      "Many Kolkata listings are unclaimed or unverified. Getting structure and verification right unlocks quick gains before automation compounds them.",
    searchBehaviour:
      "Festival-season demand spikes; campaign posts around Durga Puja and weddings drive measurable profile traffic.",
    faqs: baseFaqs("Kolkata"),
  },
  {
    slug: "jaipur",
    city: "Jaipur",
    region: "Rajasthan",
    headline: "Local SEO Services in Jaipur",
    intro:
      "Tourism and local demand overlap in Jaipur. Vizogen keeps your profile visible to both audiences.",
    metaTitle: "Local SEO Services in Jaipur | Vizogen",
    metaDescription:
      "Local SEO and Google Business Profile automation for Jaipur businesses. Rank higher on Google Maps in Malviya Nagar, Vaishali Nagar, C-Scheme and Mansarovar.",
    keywords: [
      "local SEO services Jaipur",
      "Google Business Profile management Jaipur",
      "GMB agency Jaipur",
      "Google Maps ranking Jaipur",
    ],
    neighbourhoods: [
      "Malviya Nagar",
      "Vaishali Nagar",
      "C-Scheme",
      "Mansarovar",
      "Tonk Road",
      "Jagatpura",
      "Raja Park",
      "Sitapura",
    ],
    industries: [
      "Hotels & travel",
      "Restaurants",
      "Handicraft retail",
      "Clinics",
      "Salons",
      "Education",
    ],
    localInsight:
      "Tourist-facing businesses need photo-rich, review-heavy profiles; locals need accurate hours and offers. We serve both from one posting calendar.",
    searchBehaviour:
      "Seasonal tourism peaks — post scheduling is aligned to the travel calendar.",
    faqs: baseFaqs("Jaipur"),
  },
  {
    slug: "lucknow",
    city: "Lucknow",
    region: "Uttar Pradesh",
    headline: "Local SEO Services in Lucknow",
    intro:
      "Gomti Nagar to Hazratganj, Lucknow's local search competition is still winnable — activity beats age here.",
    metaTitle: "Local SEO Services in Lucknow | Vizogen",
    metaDescription:
      "Google Business Profile automation and local SEO for Lucknow businesses. Rank higher on Google Maps in Gomti Nagar, Hazratganj, Aliganj and Indira Nagar.",
    keywords: [
      "local SEO services Lucknow",
      "Google Business Profile management Lucknow",
      "GMB expert Lucknow",
      "Google Maps ranking Lucknow",
    ],
    neighbourhoods: [
      "Gomti Nagar",
      "Hazratganj",
      "Aliganj",
      "Indira Nagar",
      "Alambagh",
      "Chinhat",
      "Jankipuram",
      "Ashiyana",
    ],
    industries: [
      "Restaurants",
      "Clinics & diagnostics",
      "Coaching institutes",
      "Salons",
      "Retail",
      "Home services",
    ],
    localInsight:
      "Competitors post rarely, so a daily AI posting cadence produces outsized freshness advantage in Lucknow.",
    searchBehaviour:
      "Hindi-English mixed queries dominate; our copy is written to match how people actually type.",
    faqs: baseFaqs("Lucknow"),
  },
];

export const locationBySlug = Object.fromEntries(locations.map((l) => [l.slug, l]));
