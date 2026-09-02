import { type ReactNode, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sparkles,
  Star,
  QrCode,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/vizogen-logo.png.asset.json";
const logo = logoAsset.url;

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/posts", label: "AI Posts", icon: Sparkles },
  { to: "/dashboard/reviews", label: "Reviews", icon: Star },
  { to: "/dashboard/magic-qr", label: "Magic QR", icon: QrCode },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    void navigate({ to: "/auth" });
  };

  const nav = (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active =
          item.to === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "gradient-brand text-white shadow-soft"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex w-full max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
          <Link to="/" className="mb-8 flex items-center gap-2 px-2">
            <img src={logo} alt="Vizogen" width={32} height={32} className="size-8" />
            <span className="text-lg font-bold tracking-tight text-foreground font-display">
              Vizogen
            </span>
          </Link>
          {nav}
          <Button variant="ghost" onClick={signOut} className="mt-auto justify-start gap-3 text-muted-foreground">
            <LogOut className="size-4" /> Sign out
          </Button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle navigation"
              >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-xl font-bold tracking-tight text-foreground font-display sm:text-2xl">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
                ) : null}
              </div>
              {actions}
            </div>
            {open ? <div className="border-t border-border px-4 py-3 lg:hidden">{nav}</div> : null}
          </header>
          <main className="px-4 py-6 sm:px-6 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
