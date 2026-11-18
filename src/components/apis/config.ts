export const UPI_ID = "9586387958@ptaxis";
export const PRICE_CYCLE = [6734, 8536, 8943, 9456, 6201];
const WEEK = 7 * 24 * 60 * 60 * 1000;

export type ApiProduct = { slug: string; name: string; short: string; features: string[] };
export const API_PRODUCTS: ApiProduct[] = [
  { slug: "whatsapp-api", name: "WhatsApp API", short: "Official WhatsApp Business API — broadcasts, chatbots, templates aur automation.",
    features: ["Bulk broadcast messages", "Chatbot & auto-replies", "Template message approval", "Webhook + REST access", "Green-tick support"] },
  { slug: "google-review-api", name: "Google Review API", short: "Google reviews fetch karo, AI replies bhejo aur review widgets apni site par lagao.",
    features: ["Fetch all Google reviews", "AI auto-reply to reviews", "Review widget for website", "Rating analytics", "Webhook on new review"] },
];

/** First visit = 6734; price changes every 7 days through PRICE_CYCLE. */
export function priceForWeek(firstSeen: number, now: number) {
  const idx = Math.max(0, Math.floor((now - firstSeen) / WEEK)) % PRICE_CYCLE.length;
  return PRICE_CYCLE[idx]!;
}
export function upiLink(amount: number, note: string) {
  return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent("Vizogen")}&am=${amount}.00&cu=INR&tn=${encodeURIComponent(note)}`;
}
