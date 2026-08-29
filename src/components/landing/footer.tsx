import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/vizogen-logo.png.asset.json";

const columns = [
  {
    title: "Platform",
    items: [
      { label: "Features", to: "/" },
      { label: "Pricing", to: "/pricing" },
      { label: "AI Post Generation", to: "/features/ai-post-generation" },
      { label: "Smart Scheduling", to: "/features/smart-scheduling" },
      { label: "Review Management", to: "/features/review-management" },
      { label: "Magic QR", to: "/features/magic-qr" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Blog", to: "/blog" },
      { label: "Local SEO", to: "/services/local-seo" },
      { label: "GBP Guide", to: "/how-to-connect-gbp" },
      { label: "Official Partner", to: "/official-partner" },
      { label: "Become a Partner", to: "/partner" },
      { label: "Book a demo", to: "/demo" },
      { label: "Log in", to: "/login" },
    ],
  },
];

const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative bg-navy pt-16 text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2">
              <img
                src={logoAsset.url}
                alt="Vizogen"
                className="h-11 w-auto rounded-lg bg-white/95 px-2 py-1 object-contain shadow-soft sm:h-12"
              />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-foreground/65">
              AI automation for Google Business Profiles — daily posts, authentic reviews and
              local ranking growth on autopilot.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://login.vizogen.in/sign-in"
                className="flex items-center gap-2 rounded-xl border border-navy-foreground/15 bg-navy-foreground/5 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-navy-foreground/10"
              >
                Start Free Trial
              </a>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl border border-navy-foreground/15 bg-navy-foreground/5 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-navy-foreground/10"
              >
                Sign In
              </Link>
            </div>

          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-navy-foreground/65 transition-colors hover:text-navy-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm font-semibold">Connect With Us</p>
            <ul className="mt-4 space-y-3 text-sm text-navy-foreground/65">
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href="mailto:info.vizogen@gmail.com" className="min-w-0 break-all hover:text-navy-foreground">
                  info.vizogen@gmail.com
                </a>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href="tel:+918488918358" className="hover:text-navy-foreground">
                  +91 84889 18358
                </a>
              </li>
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="min-w-0">
                  Tower-B, RK ICONIC, 923, 150 Feet Ring Rd, nr. Ayodhya Chowk, Sheetal Park, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006
                </span>
              </li>

            </ul>
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-full border border-navy-foreground/15 bg-navy-foreground/5 transition-all duration-300 hover:-translate-y-1 hover:bg-navy-foreground/10"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-navy-foreground/10 py-6 text-center text-xs text-navy-foreground/55">
          © {new Date().getFullYear()} Vizogen. All rights reserved.
        </div>
      </div>

      <a
        href="https://wa.me/918488918358"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full gradient-brand text-primary-foreground shadow-glow transition-transform hover:scale-110"
      >
        <MessageCircle className="size-6" />
      </a>

    </footer>
  );
}
