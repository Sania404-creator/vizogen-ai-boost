import type { ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  HelpCircle,
  IdCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  MousePointerClick,
  Navigation,
  Phone,
  Play,
  QrCode,
  Settings,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  Wand2,
} from "lucide-react";

import logoAsset from "@/assets/vizogen-logo.png.asset.json";
import googleAsset from "@/assets/google-g.png.asset.json";

export const BUSINESS_NAME = "Sample Business Name";
export const BUSINESS_ADDRESS =
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
  { title: "Magic QR + Review & Feedback", icon: QrCode, tone: "bg-brand-2/10" },
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

/** Browser chrome frame: 3 dots + centered address pill. */
export function BrowserFrame({
  url = "app.vizogen.ai",
  children,
}: {
  url?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
        <span className="size-2.5 shrink-0 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 shrink-0 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 shrink-0 rounded-full bg-[#28c840]" />
        <span className="mx-auto truncate rounded-full bg-background px-4 py-1 text-[11px] text-muted-foreground">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

function DashSidebar() {
  return (
    <aside className="hidden w-48 shrink-0 flex-col border-r border-border bg-muted/30 p-3 sm:flex">
      <img src={logoAsset.url} alt="Vizogen.ai" className="h-6 w-auto" loading="lazy" />
      <nav className="mt-5 flex flex-1 flex-col gap-0.5">
        {navItems.map((item) => (
          <span
            key={item.label}
            className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${
              item.active ? "bg-navy text-navy-foreground" : "text-muted-foreground"
            }`}
          >
            <item.icon className="size-3.5 shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.badge ? (
              <span className="ml-auto rounded-full gradient-brand px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground">
                {item.badge}
              </span>
            ) : null}
          </span>
        ))}
      </nav>
      <div className="mt-5 border-t border-border pt-2">
        <span className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">
          <LogOut className="size-3.5" /> Logout
        </span>
        <p className="px-2.5 font-mono text-[9px] text-muted-foreground/70">v5.4.4</p>
      </div>
    </aside>
  );
}

function DashTopBar() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-3 py-2.5 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-full gradient-brand text-[10px] font-bold text-primary-foreground">
          S
        </span>
        <span className="truncate text-[11px] font-semibold text-foreground sm:text-xs">
          {BUSINESS_NAME}
        </span>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-success/12 px-2 py-0.5 text-[9px] font-semibold text-success sm:inline-flex">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          Connected
        </span>
        <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="hidden items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold text-foreground sm:inline-flex">
          <Play className="size-2.5" /> Tutorials
        </span>
        <span className="inline-flex items-center gap-1 rounded-full gradient-brand px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
          <Sparkles className="size-2.5" /> Upgrade
        </span>
        <span className="size-6 shrink-0 rounded-full bg-muted" />
      </div>
    </div>
  );
}

/** Full dashboard shell: sidebar + top bar, with page body as children. */
export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <DashSidebar />
      <div className="min-w-0 flex-1">
        <DashTopBar />
        <div className="space-y-4 p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
}

export function BusinessBanner({ highlight = false }: { highlight?: boolean }) {
  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)] items-center gap-3 rounded-2xl bg-gradient-to-r from-brand/10 via-brand-2/10 to-transparent p-3 sm:grid-cols-[minmax(0,1fr)_auto] ${
        highlight ? "ring-2 ring-brand/60 ring-offset-2 ring-offset-card" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-card shadow-soft">
          <img src={googleAsset.url} alt="Google" className="size-4" loading="lazy" />
        </span>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-xs font-bold text-foreground font-display sm:text-sm">
              {BUSINESS_NAME}
            </p>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[9px] font-semibold text-success">
              <span className="size-1.5 rounded-full bg-success" />
              Connected
            </span>
          </div>
          <p className="truncate text-[10px] text-muted-foreground">{BUSINESS_ADDRESS}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold text-foreground">
          Reviews
        </span>
        <span className="inline-flex items-center gap-1 rounded-full gradient-brand px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
          <Sparkles className="size-2.5" /> Automation
        </span>
      </div>
    </div>
  );
}

export function QuickConnectRow({ highlightGoogle = false }: { highlightGoogle?: boolean }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-foreground font-display sm:text-sm">Quick Connect</h3>
      <p className="text-[10px] text-muted-foreground">Connect your platforms in one click</p>
      <div className="mt-2.5 flex items-center gap-2">
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {quickConnect.map((c) => {
            const isGoogle = c.icon === "google";
            const glow = highlightGoogle && isGoogle;
            return (
              <div
                key={c.title}
                className={`rounded-2xl border p-2.5 ${c.tone} ${
                  glow
                    ? "border-brand ring-2 ring-brand/50 shadow-glow"
                    : `border-border ${highlightGoogle ? "opacity-60" : ""}`
                }`}
              >
                <span className="grid size-7 place-items-center rounded-xl bg-card shadow-soft">
                  {isGoogle ? (
                    <img src={googleAsset.url} alt="Google" className="size-3.5" loading="lazy" />
                  ) : (
                    <c.icon className="size-3.5 text-brand" />
                  )}
                </span>
                <p className="mt-1.5 line-clamp-2 text-[10px] font-semibold leading-snug text-foreground">
                  {c.title}
                </p>
                <span
                  className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                    glow
                      ? "gradient-brand text-primary-foreground"
                      : "bg-navy/8 text-muted-foreground"
                  }`}
                >
                  Manage
                </span>
              </div>
            );
          })}
        </div>
        <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground lg:block" />
      </div>
    </div>
  );
}

export function PerformanceGrid() {
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-xs font-bold text-foreground font-display sm:text-sm">
            Performance
          </h3>
          <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
            Last 6 Months
          </span>
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-primary">View all →</span>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-2.5 shadow-soft">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <s.icon className={`size-3 shrink-0 ${s.color}`} />
            </div>
            <p className={`mt-1 font-mono text-xl font-bold ${s.color}`}>
              {s.value}
              {s.suffix ? (
                <span className="ml-0.5 text-[10px] text-muted-foreground">{s.suffix}</span>
              ) : null}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Google "Choose an account" window mockup (Google's own UI). */
export function GoogleChooserMock() {
  return (
    <div className="bg-card p-5 sm:p-7">
      <div className="mx-auto max-w-[320px]">
        <img src={googleAsset.url} alt="Google" className="mx-auto size-6" loading="lazy" />
        <h4 className="mt-3 text-center text-lg font-normal text-foreground">Choose an account</h4>
        <p className="mt-1 text-center text-[11px] text-muted-foreground">
          to continue to <span className="text-brand">Vizogen</span>
        </p>
        <div className="mt-4 divide-y divide-border rounded-xl border border-border">
          <div className="flex items-center gap-3 bg-brand/5 p-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full gradient-brand text-[11px] font-bold text-primary-foreground">
              S
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">Sample Business</p>
              <p className="truncate text-[10px] text-muted-foreground">
                owner@samplebusiness.com
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 opacity-60">
            <span className="size-8 shrink-0 rounded-full bg-muted" />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">Personal Account</p>
              <p className="truncate text-[10px] text-muted-foreground">personal@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-sm text-muted-foreground">
              +
            </span>
            <p className="text-xs font-medium text-muted-foreground">Use another account</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Google OAuth consent / permissions screen mockup. */
export function GoogleConsentMock() {
  return (
    <div className="bg-card p-5 sm:p-7">
      <div className="mx-auto max-w-[340px]">
        <img src={googleAsset.url} alt="Google" className="mx-auto size-6" loading="lazy" />
        <h4 className="mt-3 text-center text-base font-normal text-foreground">
          Vizogen wants access to your Google Account
        </h4>
        <p className="mt-1 text-center text-[10px] text-muted-foreground">
          owner@samplebusiness.com
        </p>
        <p className="mt-4 text-[11px] font-medium text-foreground">
          Select what Vizogen can access
        </p>
        <div className="mt-2 space-y-2">
          <label className="flex items-start gap-2.5 rounded-xl border-2 border-brand bg-brand/5 p-3">
            <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-[4px] gradient-brand text-primary-foreground">
              <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-[11px] leading-snug text-foreground">
              See, edit, create and delete your Google business listings
            </span>
          </label>
          <div className="flex items-start gap-2.5 rounded-xl border border-border p-3 opacity-70">
            <span className="mt-0.5 size-4 shrink-0 rounded-[4px] border border-border" />
            <span className="text-[11px] leading-snug text-muted-foreground">
              See your primary Google Account email address
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-brand">
            Cancel
          </span>
          <span className="rounded-full gradient-brand px-4 py-1.5 text-[11px] font-semibold text-primary-foreground">
            Continue
          </span>
        </div>
      </div>
    </div>
  );
}
