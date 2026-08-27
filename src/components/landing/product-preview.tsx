import { motion } from "motion/react";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MapPin,
  Phone,
  MousePointerClick,
  Navigation,
  Play,
  QrCode,
  Settings,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  IdCard,
  Wand2,
} from "lucide-react";

import { SectionHeading } from "@/components/landing/reveal";
import logoAsset from "@/assets/vizogen-logo.png.asset.json";
import googleAsset from "@/assets/google-g.png.asset.json";

const BUSINESS_NAME = "Sample Business Name";
const BUSINESS_ADDRESS =
  "123 Business Street, Near City Center, District, City 000000";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Digital QR", icon: QrCode, badge: "NEW" },
  { label: "Leads", icon: Users },
  { label: "GBP Automation", icon: Wand2 },
  { label: "AI Suggested Posts", icon: Sparkles },
  { label: "Website", icon: Globe },
  { label: "Need Help?", icon: HelpCircle },
  { label: "Settings", icon: Settings },
];

const quickConnect = [
  { title: "Google Business", icon: "google" as const, tone: "bg-card" },
  {
    title: "Magic QR + Review & Feedback",
    icon: QrCode,
    tone: "bg-brand-2/10",
  },
  { title: "Digital Menu / Catalog", icon: UtensilsCrossed, tone: "bg-[oklch(0.95_0.05_60)]" },
  { title: "Digital Visiting Card & Bio", icon: IdCard, tone: "bg-brand/10" },
  { title: "Instant Website", icon: Globe, tone: "bg-success/10" },
];

const stats = [
  { label: "Map Impressions", value: "179", icon: MapPin, color: "text-brand" },
  { label: "Call Clicks", value: "74", icon: Phone, color: "text-success" },
  {
    label: "Website Clicks",
    value: "191",
    icon: MousePointerClick,
    color: "text-[oklch(0.68_0.17_55)]",
  },
  { label: "Directions", value: "299", icon: Navigation, color: "text-accent-pink" },
  { label: "Reviews", value: "228", icon: Star, color: "text-brand-2" },
  {
    label: "Avg. Rating",
    value: "4.9",
    suffix: "/5",
    icon: Star,
    color: "text-[oklch(0.68_0.17_55)]",
  },
];

export function ProductPreview() {
  return (
    <section id="product-preview" className="relative overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="See It In Action"
          title="Your Entire Google Business Profile — One Dashboard"
          subtitle="No guesswork. See real-time stats, manage everything, and automate your growth — all from a single, simple screen."
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-14 max-w-6xl [perspective:1600px]"
        >
          <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-lift transition-transform duration-500 [transform:rotateX(3deg)] hover:[transform:rotateX(0deg)]">
            {/* browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
              <span className="size-2.5 shrink-0 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 shrink-0 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 shrink-0 rounded-full bg-[#28c840]" />
              <span className="mx-auto rounded-full bg-background px-4 py-1 text-[11px] text-muted-foreground">
                app.vizogen.ai
              </span>
            </div>

            <div className="flex">
              {/* sidebar */}
              <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-muted/30 p-4 lg:flex">
                <img
                  src={logoAsset.url}
                  alt="Vizogen.ai"
                  className="h-7 w-auto"
                  loading="lazy"
                />
                <nav className="mt-6 flex flex-1 flex-col gap-1">
                  {navItems.map((item) => (
                    <span
                      key={item.label}
                      className={`flex items-center gap-2.5 rounded-full px-3 py-2 text-xs font-semibold ${
                        item.active
                          ? "bg-navy text-navy-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.badge ? (
                        <span className="ml-auto rounded-full gradient-brand px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                          {item.badge}
                        </span>
                      ) : null}
                    </span>
                  ))}
                </nav>
                <div className="mt-6 border-t border-border pt-3">
                  <span className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-muted-foreground">
                    <LogOut className="size-4" /> Logout
                  </span>
                  <p className="px-3 pt-1 font-mono text-[10px] text-muted-foreground/70">
                    v5.4.4
                  </p>
                </div>
              </aside>

              {/* main */}
              <div className="min-w-0 flex-1">
                {/* top bar */}
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full gradient-brand text-xs font-bold text-primary-foreground">
                      S
                    </span>
                    <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
                      {BUSINESS_NAME}
                    </span>
                    <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-success/12 px-2 py-0.5 text-[10px] font-semibold text-success sm:inline-flex">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-success" />
                      </span>
                      Connected
                    </span>
                    <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold text-foreground sm:inline-flex">
                      <Play className="size-3" /> Tutorials
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
                      <Sparkles className="size-3" /> Upgrade
                    </span>
                    <span className="size-7 shrink-0 rounded-full bg-muted" />
                  </div>
                </div>

                <div className="space-y-6 p-4 sm:p-5">
                  {/* business banner */}
                  <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-3 rounded-2xl bg-gradient-to-r from-brand/10 via-brand-2/10 to-transparent p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-card shadow-soft">
                        <img src={googleAsset.url} alt="Google" className="size-5" loading="lazy" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground font-display">
                          {BUSINESS_NAME}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {BUSINESS_ADDRESS}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground">
                        Reviews
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
                        <Sparkles className="size-3" /> Automation
                      </span>
                    </div>
                  </div>

                  {/* quick connect */}
                  <div>
                    <h3 className="text-sm font-bold text-foreground font-display">
                      Quick Connect
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Connect your platforms in one click
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {quickConnect.map((c) => (
                          <div
                            key={c.title}
                            className={`rounded-2xl border border-border p-3 ${c.tone}`}
                          >
                            <span className="grid size-8 place-items-center rounded-xl bg-card shadow-soft">
                              {c.icon === "google" ? (
                                <img
                                  src={googleAsset.url}
                                  alt="Google"
                                  className="size-4"
                                  loading="lazy"
                                />
                              ) : (
                                <c.icon className="size-4 text-brand" />
                              )}
                            </span>
                            <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-snug text-foreground">
                              {c.title}
                            </p>
                            <span className="mt-2 inline-block rounded-full bg-navy/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                              Manage
                            </span>
                          </div>
                        ))}
                      </div>
                      <ChevronRight className="hidden size-5 shrink-0 text-muted-foreground lg:block" />
                    </div>
                  </div>

                  {/* performance */}
                  <div>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3 className="truncate text-sm font-bold text-foreground font-display">
                          Performance
                        </h3>
                        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          Last 6 Months
                        </span>
                      </div>
                      <span className="shrink-0 text-[11px] font-semibold text-primary">
                        View all →
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {stats.map((s) => (
                        <div
                          key={s.label}
                          className="rounded-2xl border border-border bg-card p-3 shadow-soft"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {s.label}
                            </p>
                            <s.icon className={`size-3.5 shrink-0 ${s.color}`} />
                          </div>
                          <p className={`mt-1.5 font-mono text-2xl font-bold ${s.color}`}>
                            {s.value}
                            {s.suffix ? (
                              <span className="ml-0.5 text-xs text-muted-foreground">
                                {s.suffix}
                              </span>
                            ) : null}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
            This is exactly what you'll see the moment you log in — no complicated setup,
            no confusing menus.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
