import { type ReactNode, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Bell,
  Users,
  KanbanSquare,
  FileText,
  BarChart3,
  Filter,
  Settings,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getCrmSession, listNotifications, markNotificationsRead } from "@/lib/crm.functions";
import { VizogenLockup } from "@/components/brand/logo";

const NAV = [
  { to: "/crm", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { to: "/crm/leads", label: "Leads", icon: KanbanSquare, adminOnly: false },
  { to: "/crm/proposals", label: "Proposals", icon: FileText, adminOnly: false },
  { to: "/crm/funnel", label: "Sales funnel", icon: Filter, adminOnly: false },
  { to: "/crm/reports", label: "Reports", icon: BarChart3, adminOnly: false },
  { to: "/crm/team", label: "Team", icon: Users, adminOnly: true },
  { to: "/crm/settings", label: "Settings", icon: Settings, adminOnly: false },
] as const;

export function useCrmSession() {
  const fetchSession = useServerFn(getCrmSession);
  return useQuery({ queryKey: ["crm-session"], queryFn: () => fetchSession() });
}

export function CrmShell({
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
  const queryClient = useQueryClient();
  const session = useCrmSession();

  const fetchNotifications = useServerFn(listNotifications);
  const markRead = useServerFn(markNotificationsRead);
  const notifications = useQuery({
    queryKey: ["crm-notifications"],
    queryFn: () => fetchNotifications(),
    refetchInterval: 60000,
  });
  const unread = (notifications.data ?? []).filter((n) => !n.read_at).length;

  const isAdmin = session.data?.isAdmin ?? false;
  const items = NAV.filter((n) => !n.adminOnly || isAdmin);

  const signOut = async () => {
    await supabase.auth.signOut();
    void navigate({ to: "/crm/login" });
  };

  const nav = (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = item.to === "/crm" ? pathname === "/crm" : pathname.startsWith(item.to);
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

  if (session.isSuccess && !session.data.member) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="max-w-md rounded-2xl border border-border bg-card p-7 text-center shadow-soft">
          <h1 className="text-xl font-bold text-foreground font-display">No CRM access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {session.data.email} is signed in but is not an active Vizogen CRM member. Ask an Admin
            to add you to the team.
          </p>
          <Button variant="outline" onClick={signOut} className="mt-5 gap-2">
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex w-full max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
          <Link to="/crm" className="mb-8 px-2">
            <VizogenLockup sublabel="Sales CRM" />
          </Link>
          {nav}
          <div className="mt-auto space-y-1">
            <p className="px-3 text-xs text-muted-foreground">
              {session.data?.member?.full_name}
              <br />
              <span className="capitalize">
                {session.data?.member?.role === "admin" ? "Admin" : "Sales rep"}
              </span>
            </p>
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-start gap-3 text-muted-foreground"
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
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
              <Popover
                onOpenChange={(o) => {
                  if (o && unread) {
                    void markRead().then(() =>
                      queryClient.invalidateQueries({ queryKey: ["crm-notifications"] }),
                    );
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="size-4" />
                    {unread ? (
                      <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {unread}
                      </span>
                    ) : null}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="border-b border-border px-4 py-3 text-sm font-semibold">
                    Notifications
                  </div>
                  <div className="max-h-80 divide-y divide-border overflow-auto">
                    {(notifications.data ?? []).length === 0 ? (
                      <p className="px-4 py-6 text-sm text-muted-foreground">
                        Nothing new right now.
                      </p>
                    ) : (
                      (notifications.data ?? []).map((n) => (
                        <div key={n.id} className="px-4 py-3">
                          <p className="text-sm font-medium text-foreground">{n.title}</p>
                          {n.body ? (
                            <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                          ) : null}
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {new Date(n.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {open ? <div className="border-t border-border px-4 py-3 lg:hidden">{nav}</div> : null}
          </header>
          <main className="px-4 py-6 sm:px-6 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
