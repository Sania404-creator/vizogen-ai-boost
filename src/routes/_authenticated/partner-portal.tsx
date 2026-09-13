import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Download,
  IndianRupee,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPartnerPortal, submitPartnerClient } from "@/lib/partner-portal.functions";

export const Route = createFileRoute("/_authenticated/partner-portal")({
  head: () => ({
    meta: [
      { title: "Partner portal — Vizogen" },
      {
        name: "description",
        content:
          "Your Vizogen partner portal: partnership status, training materials, dedicated manager, commission earnings and the clients you onboarded.",
      },
      { property: "og:title", content: "Partner portal — Vizogen" },
      { property: "og:description", content: "Status, training, earnings and clients in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PartnerPortalPage,
});

const inr = (v: number) =>
  `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const CLIENT_STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  trial: "secondary",
  churned: "destructive",
};

function PartnerPortalPage() {
  const queryClient = useQueryClient();
  const fetchPortal = useServerFn(getPartnerPortal);
  const addClient = useServerFn(submitPartnerClient);

  const portal = useQuery({
    queryKey: ["partner-portal"],
    queryFn: () => fetchPortal(),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const [form, setForm] = useState({
    businessName: "",
    city: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    plan: "Starter" as "Starter" | "Growth" | "Pro" | "Custom",
    monthlyValue: "",
    startedOn: new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim()) return;
    setSaving(true);
    try {
      await addClient({
        data: {
          businessName: form.businessName,
          city: form.city,
          contactName: form.contactName,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          plan: form.plan,
          monthlyValue: Number(form.monthlyValue || 0),
          startedOn: form.startedOn,
        },
      });
      toast.success("Client submitted — Vizogen will confirm it shortly.");
      setForm({ ...form, businessName: "", city: "", contactName: "", contactEmail: "", contactPhone: "", monthlyValue: "" });
      await queryClient.invalidateQueries({ queryKey: ["partner-portal"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save this client.");
    } finally {
      setSaving(false);
    }
  };

  const data = portal.data;
  const account = data?.account ?? null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 sm:pt-32 lg:px-8">
        {portal.isLoading ? (
          <p className="flex items-center gap-2 py-20 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading your partner portal…
          </p>
        ) : !account ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
            <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-bold text-foreground">
              No approved partnership found
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This portal opens once your partner application is approved. Sign in with the same
              email address you applied with, or apply for a program to get started.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/partner-application"
                className="inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Apply to partner <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/partner"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                See the programs
              </Link>
            </div>
          </div>
        ) : (
          <>
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Partner portal
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
                  Welcome, {account.full_name || account.email}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {account.program} · approved{" "}
                  {new Date(account.approved_at).toLocaleDateString()}
                  {account.reference_code ? ` · ref ${account.reference_code}` : ""}
                </p>
              </div>
              <Badge variant={account.active ? "default" : "destructive"}>
                {account.active ? "Active partner" : "Paused"}
              </Badge>
            </header>

            {/* Earnings */}
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total commission", value: inr(data!.totals.earned), icon: IndianRupee },
                { label: "Pending payout", value: inr(data!.totals.pending), icon: Loader2 },
                { label: "Paid out", value: inr(data!.totals.paid), icon: BadgeCheck },
                {
                  label: "Clients onboarded",
                  value: `${data!.totals.clients}`,
                  icon: Users,
                },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <s.icon className="size-3.5" /> {s.label}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </section>

            <p className="mt-3 text-xs text-muted-foreground">
              Your commission rate is {account.commission_rate}% recurring
              {account.min_payout ? `, with a minimum payout of ${inr(account.min_payout)}` : ""}
              {account.exclusive_city ? ` · exclusive city: ${account.exclusive_city}` : ""}.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* Manager */}
              <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h2 className="font-display text-base font-bold text-foreground">
                  Your dedicated manager
                </h2>
                <p className="mt-4 text-sm font-semibold text-foreground">{account.manager_name}</p>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <a
                    className="flex items-center gap-2 hover:text-foreground"
                    href={`mailto:${account.manager_email}`}
                  >
                    <Mail className="size-4" /> {account.manager_email}
                  </a>
                  <a
                    className="flex items-center gap-2 hover:text-foreground"
                    href={`tel:${account.manager_phone.replace(/\s/g, "")}`}
                  >
                    <Phone className="size-4" /> {account.manager_phone}
                  </a>
                </div>
                <a
                  href={`https://wa.me/${account.manager_phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  <MessageCircle className="size-4" /> WhatsApp your manager
                </a>
              </section>

              {/* Training */}
              <section className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
                <h2 className="font-display text-base font-bold text-foreground">
                  Training materials
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Playbooks, scripts and policies to help you close faster.
                </p>
                <ul className="mt-4 divide-y divide-border">
                  {data!.resources.length === 0 ? (
                    <li className="py-3 text-sm text-muted-foreground">
                      New material is being added — your manager will share it shortly.
                    </li>
                  ) : (
                    data!.resources.map((r) => (
                      <li key={r.id} className="flex flex-wrap items-center gap-3 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">{r.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {r.category} · {r.description}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={r.url} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-1.5 size-3.5" /> Download
                          </a>
                        </Button>
                      </li>
                    ))
                  )}
                </ul>
              </section>
            </div>

            {/* Clients */}
            <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
                <Building2 className="size-4" /> Clients you onboarded
              </h2>
              <div className="mt-4 divide-y divide-border">
                {data!.clients.length === 0 ? (
                  <p className="py-3 text-sm text-muted-foreground">
                    No clients logged yet. Add your first closed client below.
                  </p>
                ) : (
                  data!.clients.map((c) => (
                    <div key={c.id} className="flex flex-wrap items-center gap-3 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {c.business_name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {[c.city, c.plan, inr(c.monthly_value) + "/mo", new Date(c.started_on).toLocaleDateString()]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        {c.admin_note ? (
                          <p className="truncate text-xs text-muted-foreground">
                            Note: {c.admin_note}
                          </p>
                        ) : null}
                      </div>
                      <Badge variant={CLIENT_STATUS_VARIANT[c.status] ?? "secondary"}>
                        {c.status}
                      </Badge>
                      <Badge variant={c.confirmation === "confirmed" ? "default" : "outline"}>
                        {c.confirmation === "confirmed"
                          ? "Confirmed"
                          : c.confirmation === "rejected"
                            ? "Not accepted"
                            : "Awaiting confirmation"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="pc-name">Business name</Label>
                  <Input
                    id="pc-name"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="Sunshine Dental Clinic"
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pc-city">City</Label>
                  <Input
                    id="pc-city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Rajkot"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="pc-contact">Contact person</Label>
                  <Input
                    id="pc-contact"
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="pc-email">Contact email</Label>
                  <Input
                    id="pc-email"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="pc-phone">Contact phone</Label>
                  <Input
                    id="pc-phone"
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Plan</Label>
                  <Select
                    value={form.plan}
                    onValueChange={(v) =>
                      setForm({ ...form, plan: v as "Starter" | "Growth" | "Pro" | "Custom" })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Starter", "Growth", "Pro", "Custom"].map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pc-value">Monthly value (₹)</Label>
                  <Input
                    id="pc-value"
                    inputMode="numeric"
                    value={form.monthlyValue}
                    onChange={(e) => setForm({ ...form, monthlyValue: e.target.value.replace(/[^0-9]/g, "") })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="pc-start">Start date</Label>
                  <Input
                    id="pc-start"
                    type="date"
                    value={form.startedOn}
                    onChange={(e) => setForm({ ...form, startedOn: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={saving} className="w-full">
                    {saving ? (
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                    ) : (
                      <Plus className="mr-1.5 size-4" />
                    )}
                    Add a client you closed
                  </Button>
                </div>
              </form>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
