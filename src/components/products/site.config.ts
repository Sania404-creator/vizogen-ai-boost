/**
 * Coming-soon product pages — every piece of copy, link and setting lives here.
 * Edit this file only; the page template reads from it.
 */
export type ProductSlug = "enterprise-erp" | "hrm-payroll" | "commerce-cloud" | "appointment-booking";

export type ProductConfig = {
  slug: ProductSlug;
  name: string;
  keyword: string; // part of the name shown in gradient
  short: string; // menu subtitle
  tagline: string;
  description: string;
  icon: string; // lucide icon name
  /** ISO date e.g. "2027-03-01T10:00:00+05:30". Leave "" to show the "Building in progress" bar instead. */
  launchDate: string;
  seoTitle: string;
  seoDescription: string;
  features: { icon: string; title: string; text: string }[];
  steps: { title: string; text: string }[];
  builtFor: string[];
  faqs: { q: string; a: string }[];
};

export const SITE = {
  /** POST JSON endpoint for waitlist sign-ups. Leave "" to save them into the Vizogen CRM. */
  waitlistWebhookUrl: "",
  contactLink: "/contact",
  brand: { from: "#84CC16", via: "#10B981", to: "#16A34A" },
  /** Only benefits you have confirmed. Leave empty to hide the section. */
  earlyAccessBenefits: [] as { icon: string; title: string; text: string }[],
  /** Set true only once confirmed — adds a Product JSON-LD snippet. */
  productSchema: false,
  successMessage: "You're on the list! We'll let you know the moment it launches.",
};

const commonFaq = (name: string) => [
  { q: "When will it launch?", a: `${name} is being built right now. Join the waitlist and you'll be the first to know the launch date.` },
  { q: "Can I get early access?", a: "Yes. Waitlist members are invited first, in the order they joined." },
  { q: "Will it integrate with Vizogen's WhatsApp CRM?", a: "That is the plan — it is being designed to work alongside Vizogen WhatsApp Marketing so your customer data stays in one place." },
  { q: "How will it be priced?", a: "Pricing will be announced at launch. Waitlist members hear about it first." },
];

export const PRODUCTS: ProductConfig[] = [
  {
    slug: "enterprise-erp", name: "Enterprise ERP", keyword: "ERP", short: "Supply chain, inventory & GST accounting", icon: "Boxes", launchDate: "",
    tagline: "Run supply chain, inventory and GST accounting from one screen.",
    description: "Track every unit from supplier to customer, keep stock levels right, and generate GST-ready invoices and returns — without spreadsheets.",
    seoTitle: "Vizogen Enterprise ERP, Coming Soon | Supply Chain, Inventory & GST Accounting",
    seoDescription: "Vizogen Enterprise ERP is coming soon: supply chain, multi-warehouse inventory and GST accounting in one platform. Join the waitlist for launch updates.",
    features: [
      { icon: "Truck", title: "Supply-chain tracking", text: "Purchase orders to dispatch, with live status at each step." },
      { icon: "Warehouse", title: "Multi-warehouse inventory", text: "Stock by location, batch and SKU, always in sync." },
      { icon: "ReceiptIndianRupee", title: "GST invoicing", text: "CGST, SGST and IGST worked out on every invoice." },
      { icon: "BellRing", title: "Low-stock alerts", text: "Get told before you run out, not after." },
      { icon: "BookOpen", title: "Accounting ledgers", text: "Sales, purchases and payments posted automatically." },
      { icon: "BarChart3", title: "Business reports", text: "Profit, stock value and GST summaries at a glance." },
    ],
    steps: [
      { title: "Add products & suppliers", text: "Import your items, warehouses and vendors." },
      { title: "Record purchases & sales", text: "Stock and ledgers update as you work." },
      { title: "File with confidence", text: "Pull GST-ready reports when it's time to file." },
    ],
    builtFor: ["Manufacturing", "Distribution", "Wholesale", "Retail chains", "D2C brands", "Pharma"],
    faqs: commonFaq("Enterprise ERP"),
  },
  {
    slug: "hrm-payroll", name: "Smart HRM & Payroll", keyword: "HRM & Payroll", short: "Biometric attendance, leaves & 1-click payroll", icon: "Fingerprint", launchDate: "",
    tagline: "Attendance, leaves and payroll — done in one click.",
    description: "Connect biometric devices, approve leaves on the go and run payroll for your whole team with payslips generated automatically.",
    seoTitle: "Vizogen Smart HRM & Payroll, Coming Soon | Biometric Attendance & 1-Click Payroll",
    seoDescription: "Vizogen Smart HRM & Payroll is coming soon: biometric attendance, leave management and 1-click payroll with automatic payslips. Join the waitlist.",
    features: [
      { icon: "Fingerprint", title: "Biometric attendance", text: "Check-ins sync from fingerprint and face devices." },
      { icon: "CalendarCheck", title: "Leave management", text: "Requests, balances and approvals in one place." },
      { icon: "Wallet", title: "1-click payroll", text: "Salaries worked out from attendance automatically." },
      { icon: "FileText", title: "Payslips", text: "Payslips generated and shared with every employee." },
      { icon: "MapPin", title: "Shifts & locations", text: "Manage shifts across branches and sites." },
      { icon: "Users", title: "Employee records", text: "Documents, roles and history for every team member." },
    ],
    steps: [
      { title: "Add your team", text: "Import employees and connect attendance devices." },
      { title: "Track time & leaves", text: "Attendance and leave flow in automatically." },
      { title: "Run payroll", text: "Review, click once, and payslips go out." },
    ],
    builtFor: ["Manufacturing", "Retail", "Clinics", "Salons", "Agencies", "Restaurants"],
    faqs: commonFaq("Smart HRM & Payroll"),
  },
  {
    slug: "commerce-cloud", name: "Commerce Cloud", keyword: "Commerce Cloud", short: "High-converting digital storefront & checkout", icon: "ShoppingBag", launchDate: "",
    tagline: "A storefront and checkout built to convert.",
    description: "Launch a fast online store with UPI and card checkout, cart recovery and order tracking — ready to sell from day one.",
    seoTitle: "Vizogen Commerce Cloud, Coming Soon | Digital Storefront & Checkout",
    seoDescription: "Vizogen Commerce Cloud is coming soon: a high-converting digital storefront with UPI and card checkout, cart recovery and order tracking. Join the waitlist.",
    features: [
      { icon: "Store", title: "Online storefront", text: "Mobile-first product pages that load fast." },
      { icon: "CreditCard", title: "UPI & card checkout", text: "Short, simple checkout your buyers trust." },
      { icon: "ShoppingCart", title: "Cart recovery", text: "Win back shoppers who leave before paying." },
      { icon: "Package", title: "Order tracking", text: "Orders, shipping and returns in one view." },
      { icon: "Tag", title: "Offers & coupons", text: "Run discounts and bundles in a few clicks." },
      { icon: "TrendingUp", title: "Sales insights", text: "See what sells, where buyers come from." },
    ],
    steps: [
      { title: "Add your products", text: "Upload photos, prices and stock." },
      { title: "Go live", text: "Publish your store and share the link." },
      { title: "Get paid", text: "Buyers check out by UPI or card." },
    ],
    builtFor: ["D2C brands", "Fashion", "Electronics", "Home décor", "Grocery", "Creators"],
    faqs: commonFaq("Commerce Cloud"),
  },
  {
    slug: "appointment-booking", name: "Appointment Booking", keyword: "Booking", short: "Online booking, calendar & staff schedule", icon: "CalendarClock", launchDate: "",
    tagline: "Let customers book you online, 24/7.",
    description: "Customers pick a service, date and time slot; your staff calendar fills itself and reminders go out on WhatsApp.",
    seoTitle: "Vizogen Appointment Booking, Coming Soon | Online Booking, Calendar & Staff Schedule",
    seoDescription: "Vizogen Appointment Booking is coming soon: online booking, a shared calendar, staff schedules and WhatsApp reminders. Join the waitlist.",
    features: [
      { icon: "MousePointerClick", title: "Online booking page", text: "Customers book a service in a few taps." },
      { icon: "CalendarDays", title: "Shared calendar", text: "Every booking in one clear view." },
      { icon: "UserCog", title: "Staff schedules", text: "Set working hours and assign staff." },
      { icon: "MessageCircle", title: "WhatsApp reminders", text: "Fewer no-shows with automatic reminders." },
      { icon: "Clock", title: "Smart time slots", text: "No double-bookings, ever." },
      { icon: "Repeat", title: "Reschedule & cancel", text: "Customers change bookings themselves." },
    ],
    steps: [
      { title: "List your services", text: "Add services, durations and staff." },
      { title: "Share your booking link", text: "Put it on WhatsApp, Instagram and Google." },
      { title: "Show up prepared", text: "Bookings and reminders run on their own." },
    ],
    builtFor: ["Clinics", "Salons", "Spas", "Gyms", "Coaches", "Consultants"],
    faqs: commonFaq("Appointment Booking"),
  },
];

export const productBySlug = (s: ProductSlug) => PRODUCTS.find((p) => p.slug === s)!;
