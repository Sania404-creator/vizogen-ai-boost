import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Loader2, LogOut, Plug, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CrmShell } from "@/components/crm/shell";
import { getCrmSession, listStages, updateMember } from "@/lib/crm.functions";
import { getMetaLeadConfig, runMetaLeadSync } from "@/lib/meta-leads.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_crm/crm/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Vizogen CRM" },
      {
        name: "description",
        content: "Your CRM profile, pipeline stages and the website lead-capture endpoint.",
      },
      { property: "og:title", content: "Settings — Vizogen CRM" },
      { property: "og:description", content: "Profile, pipeline stages and lead capture setup." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const fetchSession = useServerFn(getCrmSession);
  const fetchStages = useServerFn(listStages);
  const patch = useServerFn(updateMember);
  const fetchMetaConfig = useServerFn(getMetaLeadConfig);
  const syncMeta = useServerFn(runMetaLeadSync);

  const session = useQuery({ queryKey: ["crm-session"], queryFn: () => fetchSession() });
  const stages = useQuery({ queryKey: ["crm-stages"], queryFn: () => fetchStages() });
  const metaConfig = useQuery({ queryKey: ["meta-config"], queryFn: () => fetchMetaConfig() });

  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [origin, setOrigin] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (session.data?.member) setFullName(session.data.member.full_name);
  }, [session.data]);

  const saveName = async () => {
    if (!session.data?.member) return;
    setBusy(true);
    try {
      await patch({ data: { userId: session.data.member.user_id, fullName } });
      void queryClient.invalidateQueries({ queryKey: ["crm-session"] });
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your profile.");
    } finally {
      setBusy(false);
    }
  };

  const runSync = async () => {
    setSyncing(true);
    try {
      const result = await syncMeta();
      if (!result.ok) throw new Error(result.error ?? "Sync failed");
      setLastSync(
        `${result.created} new lead${result.created === 1 ? "" : "s"} imported · ${result.duplicates} already in CRM · ${result.rows} rows scanned`,
      );
      void queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
      void queryClient.invalidateQueries({ queryKey: ["crm-dashboard"] });
      toast.success(`Meta sync done — ${result.created} new lead(s).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sync Meta leads.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <CrmShell title="Settings" subtitle="Your profile, pipeline and lead capture">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-base font-semibold text-foreground font-display">Your profile</h2>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Display name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={session.data?.email ?? ""} readOnly className="bg-muted/50" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Role:{" "}
              <Badge variant={session.data?.isAdmin ? "default" : "secondary"}>
                {session.data?.isAdmin ? "Admin" : "Sales rep"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveName} disabled={busy || fullName.trim().length < 2}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null} Save profile
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/crm/login";
                }}
              >
                <LogOut className="size-4" /> Sign out
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-base font-semibold text-foreground font-display">Pipeline stages</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Leads move through these stages on the pipeline board.
          </p>
          <ol className="mt-4 space-y-2">
            {(stages.data ?? []).map((s, i) => (
              <li
                key={s.key}
                className="flex items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full gradient-brand text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <span className="font-medium text-foreground">{s.label}</span>
                <span className="ml-auto text-xs uppercase tracking-wide text-muted-foreground">
                  {s.kind}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground font-display">
            <Plug className="size-4 text-primary" /> Meta Ads lead sync
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Leads from your Facebook &amp; Instagram lead forms land in the connected Google Sheet
            tab <span className="font-medium text-foreground">{metaConfig.data?.sheetTab}</span>.
            Syncing imports every new row as a CRM lead with source{" "}
            <Badge variant="secondary">Meta Ads</Badge> — duplicates by email or phone are skipped.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button onClick={runSync} disabled={syncing || !metaConfig.data?.connected}>
              {syncing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Sync Meta leads now
            </Button>
            {metaConfig.data?.sheetUrl ? (
              <Button variant="outline" asChild>
                <a href={metaConfig.data.sheetUrl} target="_blank" rel="noreferrer">
                  Open sheet <ExternalLink className="size-4" />
                </a>
              </Button>
            ) : null}
            {!metaConfig.data?.connected ? (
              <span className="text-xs text-destructive">
                Google Sheets is not connected yet.
              </span>
            ) : null}
          </div>
          {lastSync ? <p className="mt-3 text-sm text-muted-foreground">{lastSync}</p> : null}
          <p className="mt-3 text-xs text-muted-foreground">
            Business type, interest, preferred start date and requested demo slot are saved on the
            lead so reps have full context. For hands-off imports, schedule{" "}
            <code>{`GET ${origin}/api/public/cron/sync-meta-leads`}</code> hourly with the header{" "}
            <code>x-vizogen-secret</code>.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground font-display">
            <Plug className="size-4 text-primary" /> Website lead capture
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Demo bookings and popup requests from vizogen.in create CRM leads automatically. Any
            other form or automation can post leads to this endpoint:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-muted/60 p-4 text-xs leading-relaxed text-foreground">
            {`POST ${origin}/api/public/leads
Headers: x-vizogen-secret: <CRM_WEBHOOK_SECRET>
Body: {
  "name": "Ramesh Patel",
  "email": "ramesh@example.com",
  "phone": "+91 90000 00000",
  "company": "Patel Dental Clinic",
  "message": "Wants GMB automation for 2 clinics",
  "source": "website_demo",
  "sourcePage": "/demo"
}`}
          </pre>
          <p className="mt-3 text-xs text-muted-foreground">
            Duplicate emails or phone numbers are merged into the existing lead instead of creating a
            second record.
          </p>
        </div>
      </div>
    </CrmShell>
  );
}
