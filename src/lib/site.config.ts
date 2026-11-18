import { Boxes, CalendarCheck, MessageCircle, ShoppingBag, Users, type LucideIcon } from "lucide-react";

export type SiteProduct = {
  name: string;
  description: string;
  to: string;
  badge: "Live" | "New" | "Coming Soon" | null;
  icon: LucideIcon;
  highlight?: boolean;
};

/** Single source of truth for product links in the main navbar side menu and footer. */
export const site = {
  links: { whatsappPlatform: "/whatsapp-crm" },
  products: [
    { name: "GMB Automation", description: "AI posts, reviews and local ranking for your Google profile.", to: "/", badge: null, icon: CalendarCheck },
    { name: "WhatsApp Marketing & Automation", description: "Unified WhatsApp + Instagram inbox, chatbots, broadcasts and AI agents.", to: "/whatsapp-marketing-automation", badge: "Live", icon: MessageCircle, highlight: true },
    { name: "Vizogen AI Studio", description: "AI creatives and content studio.", to: "/whatsapp-crm#ai-studio", badge: "New", icon: Boxes },
    { name: "Enterprise ERP", description: "Supply chain, inventory & GST accounting", to: "/products/enterprise-erp", badge: "Coming Soon", icon: Boxes },
    { name: "Smart HRM & Payroll", description: "Biometric attendance, leaves & 1-click payroll", to: "/products/hrm-payroll", badge: "Coming Soon", icon: Users },
    { name: "Commerce Cloud", description: "High-converting digital storefront & checkout", to: "/products/commerce-cloud", badge: "Coming Soon", icon: ShoppingBag },
    { name: "Appointment Booking", description: "Online booking, calendar & staff schedule", to: "/products/appointment-booking", badge: "Coming Soon", icon: CalendarCheck },
  ] satisfies SiteProduct[] as SiteProduct[],
};
