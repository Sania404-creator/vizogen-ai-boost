/**
 * Vizogen.ai WhatsApp & Instagram CRM page — every editable piece of copy,
 * number, URL, logo, review and price lives here.
 */
export type WAProductLink = { label: string; href: string; icon: string; note?: string; badge?: string };

/** The Vizogen product family — the footer and the side menu render this same list. */
export const WA_PRODUCTS: WAProductLink[] = [
  { label: "GMB Automation", href: "/", icon: "MapPin" },
  { label: "WhatsApp Marketing", href: "/whatsapp-crm", icon: "MessageCircle", badge: "New" },
  { label: "Vizogen AI Studio", href: "#ai-studio", icon: "Sparkles", badge: "New" },
  { label: "Enterprise ERP", href: "/products/enterprise-erp", icon: "Building2", badge: "Coming Soon" },
  { label: "Smart HRM & Payroll", href: "/products/hrm-payroll", icon: "Fingerprint", badge: "Coming Soon" },
  { label: "Commerce Cloud", href: "/products/commerce-cloud", icon: "ShoppingCart", badge: "Coming Soon" },
  { label: "Appointment Booking", href: "/products/appointment-booking", icon: "CalendarCheck", badge: "Coming Soon" },
];

export const WA = {
  app: { dashboard: "https://app.vizogen.in/dashboard" },
  loginUrl: "https://app.vizogen.in/dashboard",
  signupUrl: "https://app.vizogen.in/dashboard",
  /** POST JSON endpoints. Leave "" to save leads into the Vizogen CRM instead. */
  leadWebhookUrl: "",
  demoWebhookUrl: "",
  /** Optional Calendly embed URL for the Join Live Demo modal. */
  calendlyUrl: "",
  /** Product walkthrough video (YouTube embed or MP4). Leave "" to hide the player. */
  videoUrl: "",
  /** Vertical customer video shorts. Section is hidden while empty. */
  shorts: [] as { name: string; biz: string; src: string; poster?: string }[],
  /** URL returning real recent signups [{name,business,minutesAgo}]. Toast is hidden while empty. */
  recentSignupsUrl: "",
  offer: {
    /** ISO date, e.g. "2026-12-31T23:59:59+05:30". Leave "" to hide every countdown. */
    endsAt: "",
    plan: "Business",
    bar: "Cancel anytime • Free expert setup • Price locked for you",
    /** Optional free credit boxes on the offer card. */
    credits: [] as { label: string; value: string }[],
    discount: 0,
  },
  welcome: {
    badge: "Limited-time offer",
    title: "Turn WhatsApp into your revenue channel",
    benefits: ["Official WhatsApp API — no number blocking", "Broadcasts, chatbots & payments in one place", "Free expert setup, live in 30 minutes"],
    businessTypes: ["D2C / E-commerce", "Real Estate", "Clinic / Healthcare", "Coaching / Education", "Agency", "Restaurant / Retail", "Other"],
  },
  /** Real Vizogen client names for the /india-growth logo marquee. Hidden while empty. */
  realClients: [] as string[],
  results: [
    { value: 38, suffix: "%", label: "cart drop-offs recovered", quote: "Abandoned-cart flows brought back lost orders within weeks." },
    { value: 4, prefix: "₹", suffix: "", label: "average cost per lead", quote: "Click-to-WhatsApp ads beat our landing-page funnel." },
    { value: 30, suffix: " min", label: "time to go live", quote: "Setup call in the morning, first broadcast by lunch." },
    { value: 92, suffix: "%", label: "broadcast read rate", quote: "Customers actually read WhatsApp — unlike email." },
  ],
  contactEmail: "info.vizogen@gmail.com",
  contactPhone: "+91 84889 18358",
  whatsappNumber: "918488918358",
  links: {
    // Replace with the Vizogen Shopify App Store listing / install URL.
    shopify: "https://apps.shopify.com/",
    // Placeholder — replace with the Vizogen AI Studio URL.
    vizogenAIStudio: "https://app.vizogen.in/dashboard",
  },
  nav: [
    { label: "Features", href: "#features" },
    { label: "Solutions", href: "#solutions" },
    { label: "Integrations", href: "#integrations" },
    { label: "Pricing", href: "#pricing" },
    { label: "Reviews", href: "#reviews" },
    { label: "FAQ", href: "#faq" },
  ],
  hero: {
    badge: "Official Meta WhatsApp Partner", // placeholder — keep only if true
    line1: "Turn Every Click Into a WhatsApp Conversation.",
    line2Prefix: "Turn Every Conversation Into",
    rotating: ["Revenue.", "Leads.", "Orders.", "Customers."],
    sub: "One unified inbox for WhatsApp, Instagram & Messenger — with no-code chatbots, broadcasts and AI agents that reply, qualify and sell 24/7.",
    note: "No credit card required • Live in 30 minutes",
  },
  trust: [
    { icon: "BadgeCheck", prefix: "", value: 0, suffix: "", label: "Official Meta WhatsApp Partner" },
    { icon: "Activity", prefix: "", value: 99.9, suffix: "%", label: "uptime SLA", decimals: 1 },
    { icon: "Users", prefix: "", value: 1500, suffix: "+", label: "growing businesses" },
    { icon: "Timer", prefix: "Live in ", value: 30, suffix: " min", label: "" },
  ],
  collage: {
    stats: { leads: 2341, conversations: 8672, orders: 1276, revenueLakh: 24.8, automation: 92 },
    chat: [
      { from: "user", text: "Hi! I saw your ad and I'm interested in the lounge chair." },
      { from: "bot", text: "Hi Ananya! 👋 It comes in Forest Green, Sand and Charcoal. Want to see them?" },
      { from: "user", text: "Show me the options please." },
      { from: "bot", text: "products" },
      { from: "user", text: "Love the green one. Let's order!" },
    ],
  },
  logos: ["Bloomly", "Kairo Realty", "Lumen Clinics", "Northwind", "Orbitra", "Zestle", "UrbanNest", "EduSpark", "Spice Route", "FitHub", "Luxe Living", "Craftory"],
  pains: ["Missed Instagram DMs at midnight", "Chats scattered across 5 phones", "Emails with 18% open rates", "Agents typing the same answer 100× a day"],
  fixes: ["Every WhatsApp, Instagram & Messenger chat in one inbox", "Bots that reply in 0.4 seconds, 24/7", "Broadcasts with 92% read rates", "Smart auto-assignment across your team"],
  features: [
    { icon: "Inbox", anim: "typing", title: "Unified Inbox", text: "WhatsApp, Instagram and Messenger in one shared inbox." },
    { icon: "Workflow", anim: "flow", title: "No-Code Chatbot Builder", text: "Drag-and-drop flows with buttons, lists and payments." },
    { icon: "Megaphone", anim: "bars", title: "Broadcast Campaigns", text: "Segment by tags and send approved templates at scale." },
    { icon: "Instagram", anim: "typing", title: "Instagram DM & Comment Automation", text: "Auto-reply to comments, story mentions and price queries." },
    { icon: "KanbanSquare", anim: "flow", title: "Built-in CRM & Pipelines", text: "Contacts, tags, deals and full customer history." },
    { icon: "Bot", anim: "typing", title: "AI Agents", text: "Trained on your catalogue to answer, qualify and sell." },
    { icon: "Users", anim: "flow", title: "Team Collaboration", text: "Round-robin and load-equalising assignment, roles and notes." },
    { icon: "BarChart3", anim: "bars", title: "Analytics", text: "Delivery, read, reply and revenue tracking in real time." },
  ],
  deepDives: [
    { kind: "flow", eyebrow: "Chatbot Builder", title: "Design conversations visually — no code", bullets: ["Ready-made templates", "Buttons and list messages", "Collect payments in chat", "Smooth handoff to a human"] },
    { kind: "campaign", eyebrow: "Broadcast Campaigns", title: "Send campaigns people actually open", bullets: ["Audience segmentation by tags", "Approved message templates", "Auto-retarget non-responders"] },
    { kind: "contact", eyebrow: "CRM & Customer Profile", title: "Every customer, every detail, one profile", bullets: ["Labels and custom fields", "Private team notes", "Full order history"] },
  ],
  funnel: [
    { label: "Sent", value: 100 },
    { label: "Delivered", value: 98 },
    { label: "Read", value: 92 },
    { label: "Replied", value: 41 },
  ],
  ecommerce: {
    title: "Recover abandoned carts and send automatic order updates on WhatsApp.",
    bullets: ["Abandoned cart recovery", "Payment links in chat", "Order & shipping updates", "COD confirmation"],
    partners: ["Shopify", "WooCommerce", "Razorpay", "Shiprocket"],
    messages: [
      { title: "Still thinking? 🛒", text: "You left the Forest Green Lounge Chair in your cart. Use BACK10 for 10% off." },
      { title: "Pay securely 💳", text: "Here's your Razorpay link for ₹17,999: rzp.io/l/vz4821" },
      { title: "Order confirmed ✅", text: "Thanks Ananya! Order #4821 is confirmed." },
      { title: "Shipped 🚚", text: "On its way via Shiprocket. Track: vzg.in/t/4821" },
    ],
  },
  steps: [
    { title: "Connect WhatsApp & Instagram", text: "Link your number and accounts in a few clicks." },
    { title: "Build bots & campaigns", text: "Start from templates or drag-and-drop your own flows." },
    { title: "Engage, convert & scale", text: "Reply faster, sell more and track every rupee." },
  ],
  industries: [
    { icon: "ShoppingBag", title: "D2C & E-commerce", text: "Cart recovery, order updates and repeat-purchase campaigns." },
    { icon: "Building2", title: "Real Estate", text: "Qualify property leads and book site visits automatically." },
    { icon: "Stethoscope", title: "Healthcare & Clinics", text: "Appointment booking, reminders and reports on WhatsApp." },
    { icon: "GraduationCap", title: "Education", text: "Admission enquiries, fee reminders and parent updates." },
    { icon: "Briefcase", title: "Agencies", text: "Manage many client inboxes and campaigns from one place." },
    { icon: "UtensilsCrossed", title: "Restaurants & Retail", text: "Menus, orders, offers and loyalty messages." },
  ],
  integrations: [
    { name: "Zoho CRM", logo: "/logos/zoho.svg", url: "https://www.zoho.com/crm/" },
    { name: "Shopify", logo: "/logos/shopify.svg", url: "shopify" },
    { name: "Justdial", logo: "/logos/justdial.png", url: "https://www.justdial.com/" },
    { name: "WhatsApp", logo: "/logos/whatsapp.svg", url: "https://business.whatsapp.com/" },
    { name: "Google Calendar", logo: "/logos/google-calendar.svg", url: "https://calendar.google.com/" },
    { name: "Razorpay", logo: "/logos/razorpay.svg", url: "https://razorpay.com/" },
    { name: "Zapier", logo: "/logos/zapier.svg", url: "https://zapier.com/" },
    { name: "Facebook", logo: "/logos/facebook.svg", url: "https://www.facebook.com/business" },
    { name: "CleverTap", logo: "/logos/clevertap.png", url: "https://clevertap.com/" },
    { name: "LeadSquared", logo: "/logos/leadsquared.png", url: "https://www.leadsquared.com/" },
    { name: "Gemini", logo: "/logos/gemini.svg", url: "https://gemini.google.com/" },
    { name: "WooCommerce", logo: "/logos/woocommerce.svg", url: "https://woocommerce.com/" },
    { name: "Tally Prime", logo: "/logos/tally.png", url: "https://tallysolutions.com/" },
    { name: "Calendly", logo: "/logos/calendly.svg", url: "https://calendly.com/" },
    { name: "HTTP Webhook", logo: "/logos/webhook.svg", url: "/contact" },
    { name: "Shiprocket", logo: "/logos/shiprocket.png", url: "https://www.shiprocket.in/" },
    { name: "Google Sheets", logo: "/logos/google-sheets.svg", url: "https://sheets.google.com/" },
    { name: "TradeIndia", logo: "/logos/tradeindia.png", url: "https://www.tradeindia.com/" },
    { name: "Instamojo", logo: "/logos/instamojo.png", url: "https://www.instamojo.com/" },
    { name: "Instagram", logo: "/logos/instagram.svg", url: "https://business.instagram.com/" },
    { name: "ChatGPT / OpenAI", logo: "/logos/openai.png", url: "https://openai.com/chatgpt" },
    { name: "Google Contacts", logo: "/logos/google-contacts.png", url: "https://contacts.google.com/" },
    { name: "Pabbly", logo: "/logos/pabbly.png", url: "https://www.pabbly.com/" },
  ],
  rating: { score: 4.9, businesses: 1500 },
  reviews: [
    { name: "Ananya Mehta", biz: "Bloomly Skincare · D2C", ch: "whatsapp", quote: "Cart recovery brought back 18% of lost orders in month one." },
    { name: "Rohit Shah", biz: "Kairo Realty · Real Estate", ch: "whatsapp", quote: "The bot books site visits overnight. Mornings start with a full calendar." },
    { name: "Dr. Neha Rao", biz: "Lumen Clinics · Healthcare", ch: "whatsapp", quote: "WhatsApp reminders cut our no-shows almost in half." },
    { name: "Priya Nair", biz: "EduSpark · Education", ch: "instagram", quote: "Admission enquiries from Instagram now land in one inbox. Game changer." },
    { name: "Karan Joshi", biz: "Pixel & Co · Agency", ch: "whatsapp", quote: "We run 14 client inboxes from one dashboard without chaos." },
    { name: "Sneha Patel", biz: "Luxe Living · D2C", ch: "instagram", quote: "Comment-to-DM automation tripled our Reels conversions." },
    { name: "Amit Verma", biz: "UrbanNest · Real Estate", ch: "whatsapp", quote: "Lead response time dropped from 3 hours to under a minute." },
    { name: "Dr. Arjun Iyer", biz: "SmileCare Dental · Clinic", ch: "whatsapp", quote: "Patients book, reschedule and pay right inside WhatsApp." },
    { name: "Meera Kulkarni", biz: "CodeCamp · Education", ch: "whatsapp", quote: "Fee reminders on WhatsApp get paid twice as fast as email." },
    { name: "Vikram Singh", biz: "Spice Route · Restaurant", ch: "instagram", quote: "Our weekend offers broadcast gets a 90%+ read rate every time." },
    { name: "Riya Kapoor", biz: "Craftory · D2C", ch: "whatsapp", quote: "Setup took 30 minutes. First sale from a broadcast the same day." },
    { name: "Nikhil Rao", biz: "GrowthLab · Agency", ch: "instagram", quote: "Round-robin assignment finally made our team workload fair." },
  ],
  caseStudies: [
    { value: 3.4, decimals: 1, suffix: "X", label: "more orders", brand: "Bloomly Skincare" },
    { value: 62, decimals: 0, suffix: "%", label: "faster replies", brand: "Kairo Realty" },
    { value: 40, decimals: 0, suffix: "%", label: "cart recovery", brand: "Luxe Living" },
  ],
  pricing: {
    plans: [
      { name: "Starter", monthly: 1499, yearly: 14999, tagline: "For small teams getting started",
        features: ["Unlimited messages/month (+ Meta charges)", "Up to 2,000 contacts", "Official WhatsApp API", "1 Owner + 5 FREE Agents included", "Broadcasting & Retargeting", "Template Message APIs", "Create 2 Audience Segments"] },
      { name: "Business", monthly: 2999, yearly: 34999, tagline: "For growing brands", popular: true,
        features: ["Unlimited messages/month (+ Meta charges)", "Unlimited contacts", "Official WhatsApp API", "1 Owner + 5 FREE Agents included", "Broadcasting & Retargeting", "Template Message APIs", "Create 3 Audience Segments", "5 Chatbots", "Shopify Integration", "AI Integration", "Unified WhatsApp + Facebook Inbox"] },
      { name: "Pro", monthly: 3999, yearly: 44999, tagline: "For scaling teams",
        features: ["Unlimited messages/month (+ Meta charges)", "Unlimited contacts", "Official WhatsApp API", "1 Owner + 7 FREE Agents included", "Broadcasting & Retargeting", "Template Message APIs", "Create Unlimited Audience Segments", "Unlimited Chatbots", "Shopify Integration", "AI Integration – Vizogen AI Studio", "Unified WhatsApp + Facebook Inbox"] },
    ],
    guarantee: "30-day money back guarantee on all paid plans | Meta WhatsApp conversation charges billed at zero markup.",
    metaRatesDate: "1 Jan 2026",
    metaRates: [
      { cat: "Marketing", rate: "₹0.86" },
      { cat: "Utility", rate: "₹0.13" },
      { cat: "Authentication", rate: "₹0.13" },
      { cat: "Service", rate: "Free" },
    ],
    comparison: [
      { group: "Messaging", rows: [
        { f: "Messages/month", v: ["Unlimited", "Unlimited", "Unlimited"] },
        { f: "Meta charges", v: ["Extra, zero markup", "Extra, zero markup", "Extra, zero markup"] },
        { f: "Official WhatsApp API", v: [true, true, true] },
        { f: "Template Message APIs", v: [true, true, true] },
      ] },
      { group: "Contacts & Audience", rows: [
        { f: "Contacts", v: ["2,000", "Unlimited", "Unlimited"] },
        { f: "Audience segments", v: ["2", "3", "Unlimited"] },
        { f: "Broadcasting & Retargeting", v: [true, true, true] },
      ] },
      { group: "Team", rows: [{ f: "Included seats", v: ["1 Owner + 5 Agents", "1 Owner + 5 Agents", "1 Owner + 7 Agents"] }] },
      { group: "Automation", rows: [{ f: "Chatbots", v: [false, "5", "Unlimited"] }] },
      { group: "Integrations & Inbox", rows: [
        { f: "Shopify Integration", v: [false, true, true] },
        { f: "Unified WhatsApp + Facebook Inbox", v: [false, true, true] },
      ] },
      { group: "AI", rows: [{ f: "AI Integration", v: [false, true, "✔ Vizogen AI Studio"] }] },
    ],
    faqs: [
      { q: "Can I switch plans later?", a: "Yes. Upgrade or downgrade any time from your dashboard; the difference is adjusted on your next bill." },
      { q: "Are Meta message charges included?", a: "No. Meta's per-message charges are billed separately at zero markup." },
      { q: "What does yearly billing save?", a: "Yearly plans cost less than 12 monthly payments — the exact saving is shown on each plan." },
      { q: "Is there a money-back guarantee?", a: "Yes, a 30-day money back guarantee on all paid plans." },
    ],
  },
  faqs: [
    { q: "What is Vizogen WhatsApp Marketing?", a: "Vizogen.ai is a unified inbox and automation platform for WhatsApp, Instagram and Messenger — chat with customers, build no-code chatbots, run broadcasts and deploy AI agents from one place." },
    { q: "Do I need the WhatsApp Business API?", a: "Yes, for automation and broadcasts. We help you get WhatsApp Business API access as part of setup." },
    { q: "How fast can I go live?", a: "Most businesses are live in about 30 minutes." },
    { q: "Can I connect Instagram?", a: "Yes. Connect your Instagram business account to reply to DMs and automate comment replies." },
    { q: "Is there a free trial?", a: "Yes. Start a free trial with no credit card required." },
    { q: "Do you support Shopify?", a: "Yes. Shopify sync sends order confirmations, shipping updates and abandoned cart messages automatically." },
    { q: "How are Meta message charges billed?", a: "Meta's per-message charges are billed at zero markup, based on message category. Our plan price covers the Vizogen platform." },
    { q: "Can multiple agents use one number?", a: "Yes. Your whole team shares one number through the shared inbox, with round-robin assignment and roles." },
    { q: "Is my data secure?", a: "Yes. Data is encrypted in transit and access is controlled by team roles." },
  ],
  footer: {
    description: "The unified WhatsApp, Instagram & Messenger CRM, chatbot and AI-agent platform for Indian businesses.",
    columns: [
      { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "Compare plans", href: "/compare" }, { label: "India Growth offer", href: "/india-growth" }, { label: "Reviews", href: "#reviews" }] },
      { title: "Solutions", links: [{ label: "E-commerce", href: "#solutions" }, { label: "Real Estate", href: "#solutions" }, { label: "Healthcare", href: "#solutions" }] },
      { title: "Our Products", links: WA_PRODUCTS },
      { title: "Company", links: [{ label: "About", href: "/" }, { label: "Partner with us", href: "/partner" }, { label: "Contact", href: "/contact" }] },
      { title: "Legal", links: [{ label: "Privacy", href: "/whatsapp-crm/privacy-policy" }, { label: "Terms", href: "/whatsapp-crm/terms-and-conditions" }] },
    ],
    copyright: "© 2026 Vizogen.ai. All rights reserved.",
    poweredBy: "NG Marketing Solution",
    address: "Tower-B, RK ICONIC, 923, 150 Feet Ring Rd, nr. Ayodhya Chowk, Sheetal Park, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006",
  },
} as const;
