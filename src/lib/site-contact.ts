export const WHATSAPP_NUMBER = "918488918358";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Vizogen, I have a question",
)}`;

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
