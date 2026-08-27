export const WHATSAPP_NUMBER = "918488918358";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Vizogen, I have a question",
)}`;

export const OPEN_DEMO_EVENT = "vizogen:open-demo";

export function openDemoScheduler() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_DEMO_EVENT));
  }
}
