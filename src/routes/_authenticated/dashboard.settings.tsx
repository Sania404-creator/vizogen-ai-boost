import { useEffect, useState } from "react";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, PlugZap, CheckCircle2, AlertTriangle, MapPin, Unplug } from "lucide-react";
import {
  getGoogleStatus,
  startGoogleConnect,
  listGoogleLocations,
  selectGoogleLocation,
  disconnectGoogle,
} from "@/lib/google.functions";
import { getWorkspace } from "@/lib/workspace.functions";
import { DashboardShell } from "@/components/dashboard/shell";
import { BusinessForm } from "@/components/dashboard/business-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: SettingsPage,
});

interface GoogleLocation {
  accountId: string;
  locationId: string;
  title: string;
  address?: string | null;
}

function SettingsPage() {
  const search = useRouterState({ select: (s) => s.location.search }) as Record<string, string>;
  const fetchWorkspace = useServerFn(getWorkspace);
  const fetchStatus = useServerFn(getGoogleStatus);
  const startConnect = useServerFn(startGoogleConnect);
  const fetchLocations = useServerFn(listGoogleLocations);
  const chooseLocation = useServerFn(selectGoogleLocation);
  const disconnect = useServerFn(disconnectGoogle);

  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });
  const status = useQuery({ queryKey: ["google-status"], queryFn: () => fetchStatus() });

  const [locations, setLocations] = useState<GoogleLocation[] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (search["google"] === "connected") toast.success("Google account connected.");
    if (search["google"] === "error") toast.error(search["message"] ?? "Google connection failed.");
  }, [search]);

  const business = workspace.data?.business ?? null;
  const connection = status.data?.connection ?? null;
  const configured = status.data?.configured ?? false;

  const connect = async () => {
    setBusy(true);
    const result = await startConnect({ data: { origin: window.location.origin } });
    setBusy(false);
    if (!result.url) {
      toast.error(result.error?.message ?? "Google sign-in is not configured yet.");
      return;
    }
    window.location.href = result.url;
  };

  const loadLocations = async () => {
    setBusy(true);
    setLocationError(null);
    const result = await fetchLocations();
    setBusy(false);
    if (result.error) {
      setLocationError(result.error.message);
      setLocations([]);
      return;
    }
    setLocations(result.locations as GoogleLocation[]);
  };

  return (
    <DashboardShell title="Settings" subtitle="Your business profile and Google connection.">
      <div className="grid gap-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground font-display">
              Google Business Profile
            </h2>
            {connection ? (
              <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
                Connected
              </Badge>
            ) : (
              <Badge variant="outline">Not connected</Badge>
            )}
          </div>

          {status.isLoading ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Checking connection…
            </div>
          ) : !configured ? (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <AlertTriangle className="size-4 text-amber-500" /> Google API setup pending
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Vizogen&apos;s Google Business Profile API credentials aren&apos;t configured on this
                workspace yet. Everything else works now — posts, AI replies and Magic QR are saved
                and will publish to Google the moment the connection is switched on.
              </p>
            </div>
          ) : connection ? (
            <div className="mt-4 space-y-4">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-emerald-500" />
                {connection.google_email ?? "Google account"} connected
              </p>
              {business?.google_location_name ? (
                <p className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="size-4 text-primary" /> {business.google_location_name}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={loadLocations} disabled={busy}>
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  {business?.google_location_id ? "Change location" : "Choose location"}
                </Button>
                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={async () => {
                    await disconnect();
                    setLocations(null);
                    void status.refetch();
                    void workspace.refetch();
                    toast.success("Google account disconnected.");
                  }}
                >
                  <Unplug className="mr-2 size-4" /> Disconnect
                </Button>
              </div>

              {locationError ? (
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">
                  {locationError}
                </p>
              ) : null}

              {locations?.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {locations.map((loc) => {
                    const active = business?.google_location_id === loc.locationId;
                    return (
                      <button
                        key={`${loc.accountId}-${loc.locationId}`}
                        type="button"
                        onClick={async () => {
                          await chooseLocation({
                            data: {
                              accountId: loc.accountId,
                              locationId: loc.locationId,
                              title: loc.title,
                            },
                          });
                          void workspace.refetch();
                          toast.success("Location linked.");
                        }}
                        className={`rounded-xl border p-4 text-left transition-colors ${
                          active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <p className="font-semibold text-foreground">{loc.title}</p>
                        {loc.address ? (
                          <p className="mt-1 text-sm text-muted-foreground">{loc.address}</p>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Connect the Google account that manages your listing. Vizogen only reads your
                locations and reviews, and posts what you approve.
              </p>
              <Button onClick={connect} disabled={busy} className="mt-4 gradient-brand text-white">
                {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <PlugZap className="mr-2 size-4" />}
                Connect Google
              </Button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground font-display">Business details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These drive how the AI writes your posts and replies.
          </p>
          <div className="mt-5">
            {workspace.isLoading ? (
              <Loader2 className="size-5 animate-spin text-primary" />
            ) : (
              <BusinessForm business={business} onSaved={() => void workspace.refetch()} />
            )}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
