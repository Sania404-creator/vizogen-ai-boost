import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Building2, IndianRupee, Loader2, Plus, UserCog, Users } from "lucide-react";
import { toast } from "sonner";
import {
  addPartnerEarning,
  getPartnerAdminOverview,
  updatePartnerAccount,
  updatePartnerClient,
} from "@/lib/partner-admin.functions";
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

const inr = (v: number) => `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export function PartnerAccountsPanel({ enabled }: { enabled: boolean }) {
  const queryClient = useQueryClient();
  const fetchOverview = useServerFn(getPartnerAdminOverview);
  const patchAccount = useServerFn(updatePartnerAccount);
  const addEarning = useServerFn(addPartnerEarning);
  const patchClient = useServerFn(updatePartnerClient);

  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [manager, setManager] = useState({ name: "", email: "", phone: "", city: "", rate: "" });
  const [earning, setEarning] = useState({
    amount: "",
    description: "",
    month: new Date().toISOString().slice(0, 7),
    status: "pending" as "pending" | "approved" | "paid",
  });

  const overview = useQuery({
    queryKey: ["partner-admin-overview"],
    queryFn: () => fetchOverview(),
    enabled,
    refetchInterval: 20000,
    refetchOnWindowFocus: true,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["partner-admin-overview"] });
  const partners = overview.data?.partners ?? [];
  const clients = overview.data?.clients ?? [];
  const summary = overview.data?.summary;

  const open = (id: string) => {
    const p = partners.find((x) => x.id === id);
    setOpenId(openId === id ? null : id);
    if (p) {
      setManager({
        name: p.manager_name,
        email: p.manager_email,
        phone: p.manager_phone,
        city: p.exclusive_city,
        rate: String(p.commission_rate),
      });
    }
  };

  const saveManager = async (id: string) => {
    setBusy(true);
    try {
      await patchAccount({
        data: {
          id,
          managerName: manager.name,
          managerEmail: manager.email,
          managerPhone: manager.phone,
          exclusiveCity: manager.city,
          commissionRate: Number(manager.rate || 0),
        },
      });
      await refresh();
      toast.success("Partner details updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update partner.");
    } finally {
      setBusy(false);
    }
  };

  const saveEarning = async (partnerId: string) => {
    if (!earning.amount) return;
    setBusy(true);
    try {
      await addEarning({
        data: {
          partnerId,
          amount: Number(earning.amount),
          description: earning.description,
          periodMonth: earning.month,
          status: earning.status,
        },
      });
      setEarning({ ...earning, amount: "", description: "" });
      await refresh();
      toast.success("Commission recorded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not record commission.");
    } finally {
      setBusy(false);
    }
  };

  const setClient = async (
    id: string,
    patch: { confirmation?: "pending" | "confirmed" | "rejected"; status?: "trial" | "active" | "churned" },
  ) => {
    setBusy(true);
    try {
      await patchClient({ data: { id, ...patch } });
      await refresh();
      toast.success("Client updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update client.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground font-display">
            <Users className="size-4" /> Approved partners
            {overview.isFetching ? (
              <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
            ) : null}
          </h2>
          <p className="text-sm text-muted-foreground">
            Managers, commissions and the clients each partner onboarded.
          </p>
        </div>
      </div>

      {summary ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {[
            { label: "Active partners", value: `${summary.approvedPartners}` },
            { label: "Clients onboarded", value: `${summary.clientsOnboarded}` },
            { label: "Commission owed", value: inr(summary.commissionPending) },
            { label: "Commission paid", value: inr(summary.commissionPaid) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-background p-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-xl font-bold text-foreground font-display">{s.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 divide-y divide-border">
        {overview.isLoading ? (
          <p className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading partners…
          </p>
        ) : partners.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            No approved partners yet. Approving an application creates a partner account here.
          </p>
        ) : (
          partners.map((p) => (
            <div key={p.id} className="py-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {p.full_name || p.email}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.program} · {p.email} · {p.commission_rate}% · manager {p.manager_name}
                    {p.exclusive_city ? ` · ${p.exclusive_city}` : ""}
                  </p>
                </div>
                <Badge variant="outline">{p.clients} clients</Badge>
                {p.pendingClients > 0 ? (
                  <Badge variant="secondary">{p.pendingClients} to confirm</Badge>
                ) : null}
                <Badge variant="default">{inr(p.earned)} earned</Badge>
                <Button size="sm" variant="outline" onClick={() => open(p.id)}>
                  <UserCog className="mr-1.5 size-3.5" />
                  {openId === p.id ? "Close" : "Manage"}
                </Button>
              </div>

              {openId === p.id ? (
                <div className="mt-3 space-y-4 rounded-xl border border-border bg-background p-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <div>
                      <Label>Manager name</Label>
                      <Input
                        value={manager.name}
                        onChange={(e) => setManager({ ...manager, name: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Manager email</Label>
                      <Input
                        value={manager.email}
                        onChange={(e) => setManager({ ...manager, email: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Manager phone</Label>
                      <Input
                        value={manager.phone}
                        onChange={(e) => setManager({ ...manager, phone: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Exclusive city</Label>
                      <Input
                        value={manager.city}
                        onChange={(e) => setManager({ ...manager, city: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Commission %</Label>
                      <Input
                        value={manager.rate}
                        onChange={(e) =>
                          setManager({ ...manager, rate: e.target.value.replace(/[^0-9.]/g, "") })
                        }
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <Button size="sm" disabled={busy} onClick={() => void saveManager(p.id)}>
                    Save partner details
                  </Button>

                  <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div>
                      <Label>Commission amount (₹)</Label>
                      <Input
                        value={earning.amount}
                        onChange={(e) =>
                          setEarning({ ...earning, amount: e.target.value.replace(/[^0-9]/g, "") })
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <Label>Description</Label>
                      <Input
                        value={earning.description}
                        onChange={(e) => setEarning({ ...earning, description: e.target.value })}
                        placeholder="March commission — 4 clients"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Month</Label>
                      <Input
                        type="month"
                        value={earning.month}
                        onChange={(e) => setEarning({ ...earning, month: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={earning.status}
                        onValueChange={(v) =>
                          setEarning({ ...earning, status: v as "pending" | "approved" | "paid" })
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => void saveEarning(p.id)}
                  >
                    <Plus className="mr-1.5 size-3.5" /> Record commission
                  </Button>

                  <div className="border-t border-border pt-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Building2 className="size-4" /> Clients submitted by this partner
                    </p>
                    <div className="mt-2 divide-y divide-border">
                      {clients.filter((c) => c.partner_id === p.id).length === 0 ? (
                        <p className="py-2 text-xs text-muted-foreground">None yet.</p>
                      ) : (
                        clients
                          .filter((c) => c.partner_id === p.id)
                          .map((c) => (
                            <div key={c.id} className="flex flex-wrap items-center gap-2 py-2">
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">
                                  {c.business_name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {c.city} · {c.plan} · {inr(c.monthly_value)}/mo ·{" "}
                                  {new Date(c.started_on).toLocaleDateString()}
                                </p>
                              </div>
                              <Select
                                value={c.status}
                                onValueChange={(v) =>
                                  void setClient(c.id, {
                                    status: v as "trial" | "active" | "churned",
                                  })
                                }
                              >
                                <SelectTrigger className="h-8 w-[130px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="trial">Trial</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="churned">Churned</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select
                                value={c.confirmation}
                                onValueChange={(v) =>
                                  void setClient(c.id, {
                                    confirmation: v as "pending" | "confirmed" | "rejected",
                                  })
                                }
                              >
                                <SelectTrigger className="h-8 w-[160px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Awaiting confirmation</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="rejected">Not accepted</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <IndianRupee className="size-3.5" /> {inr(p.pending)} pending payout · minimum{" "}
                    {inr(p.min_payout)}
                  </p>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
