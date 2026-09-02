import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/vizogen-logo.png";

const title = "Vizogen CRM — Sales team sign in";
const description = "Internal Vizogen CRM for the sales team. Accounts are created by an Admin.";

export const Route = createFileRoute("/crm/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CrmLogin,
});

function CrmLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) void navigate({ to: "/crm" });
    })();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    void navigate({ to: "/crm" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/30 px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-3xl rounded-full opacity-20 blur-3xl gradient-brand"
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-soft">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Vizogen" width={32} height={32} className="size-8" />
          <span className="text-lg font-bold tracking-tight text-foreground font-display">
            Vizogen CRM
          </span>
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight text-foreground font-display">
          Sales team sign in
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Internal access only. Ask an Admin to create your account.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="crm-email">Work email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="crm-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@vizogen.in"
                className="pl-9"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="crm-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="crm-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={busy} className="w-full gradient-brand text-white">
            {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Sign in
          </Button>
        </form>

        <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" /> Vizogen internal CRM · crm.vizogen.in
        </p>
      </div>
    </div>
  );
}
