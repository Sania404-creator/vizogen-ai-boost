export const WHATSAPP_NUMBER = "918488918358";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Vizogen, I have a question",
)}`;

/** Sanitises a value before it goes into a wa.me URL template. */
function clean(value: string, max = 160) {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

export type DemoWhatsAppDetails = {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  slotLabel: string;
  note?: string | undefined;
};

/** Template-based WhatsApp confirmation for a booked demo. */
export function buildDemoWhatsAppMessage(d: DemoWhatsAppDetails) {
  const lines = [
    "*New Vizogen Demo Booking* ✅",
    "",
    `👤 Name: ${clean(d.name, 100)}`,
    `🏢 Business: ${clean(d.businessName, 120)}`,
    `📞 Phone: ${clean(d.phone, 20)}`,
    `📧 Email: ${clean(d.email, 255)}`,
    `📅 Slot: ${clean(d.slotLabel, 120)} (IST)`,
  ];
  if (d.note) lines.push(`📝 Note: ${clean(d.note, 400)}`);
  lines.push("", "Please confirm my demo call. Thank you!");
  return lines.join("\n");
}

/** wa.me link that opens WhatsApp with the demo booking template prefilled. */
export function demoWhatsAppUrl(d: DemoWhatsAppDetails) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildDemoWhatsAppMessage(d),
  )}`;
}


export const OPEN_DEMO_EVENT = "vizogen:open-demo";
export const OPEN_FREE_DEMO_EVENT = "vizogen:open-free-demo";

export function openDemoScheduler() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_DEMO_EVENT));
  }
}

/** Opens the shared "Free Demo" lead capture popup used site-wide. */
export function openFreeDemo() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_FREE_DEMO_EVENT));
  }
}
