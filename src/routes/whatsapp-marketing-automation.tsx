import { createFileRoute, redirect } from "@tanstack/react-router";

// Service URL for WhatsApp Marketing & Automation; the full page lives at /whatsapp-crm.
export const Route = createFileRoute("/whatsapp-marketing-automation")({
  beforeLoad: () => {
    throw redirect({ to: "/whatsapp-crm", statusCode: 301 });
  },
});
