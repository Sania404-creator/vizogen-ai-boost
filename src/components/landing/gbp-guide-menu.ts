import { BookOpen, Link2, MessageSquare, QrCode, Send } from "lucide-react";

export const gbpGuideLinks = [
  {
    label: "How To Connect GBP",
    subtitle: "Step-by-step connection guide",
    to: "/how-to-connect-gbp" as const,
    icon: Link2,
  },
  { label: "Create AI Post", to: "/how-to-create-post" as const, icon: BookOpen },
  { label: "Reply to Reviews", to: "/how-to-reply-review" as const, icon: MessageSquare },
  { label: "Generate Magic QR", to: "/how-to-generate-magic-qr" as const, icon: QrCode },
  { label: "Post on GBP", to: "/how-to-post-on-gbp" as const, icon: Send },
];
