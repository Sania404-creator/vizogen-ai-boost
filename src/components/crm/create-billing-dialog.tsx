import { type ReactNode, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessageCircle, Plus, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  saveProposal,
  sendProposal,
  sendProposalWhatsApp,
  type PricingLine,
} from "@/lib/proposals.functions";
import { listLeads, type Lead } from "@/lib/crm.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function toWa(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.length === 10 ? `91${d}` : d;
}

const plusDays = (n: number) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

export function CreateBillingDialog({
  lead: fixedLead,
  trigger,
  onDone,
}: {
  lead?: Lead;
  trigger: ReactNode;
  onDone?: () => void;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const fetchLeads = useServerFn(listLeads);
  const save = useServerFn(saveProposal);
  const send = useServerFn(sendProposal);
  const sendWa = useServerFn(sendProposalWhatsApp);

  const leads = useQuery({
    queryKey: ["crm-leads-billing-picker"],
    queryFn: () => fetchLeads({ data: {} }),
    enabled: open && !fixedLead,
  });

  const [leadId, setLeadId] = useState(fixedLead?.id ?? "");
  const lead = fixedLead ?? (leads.data ?? []).find((l) => l.id === leadId);
  const [clientName, setClientName] = useState(fixedLead?.name ?? "");
  const [company, setCompany] = useState(fixedLead?.company ?? "");
  const [email, setEmail] = useState(fixedLead?.email ?? "");
  const [phone, setPhone] = useState(fixedLead?.phone ?? "");
  const [items, setItems] = useState<PricingLine[]>([{ item: "", qty: 1, price: 0 }]);
  const [notes, setNotes] = useState("");
  const [validUntil, setValidUntil] = useState(plusDays(14));

  const [billId, setBillId] = useState<string | undefined>();
  const reset = () => {
    setBillId(undefined);
    setLeadId(fixedLead?.id ?? "");
    setClientName(fixedLead?.name ?? "");
    setCompany(fixedLead?.company ?? "");
    setEmail(fixedLead?.email ?? "");
    setPhone(fixedLead?.phone ?? "");
    setItems([{ item: "", qty: 1, price: 0 }]);
    setNotes("");
    setValidUntil(plusDays(14));
  };

  const total = useMemo(() => items.reduce((s, l) => s + l.qty * l.price, 0), [items]);

  const pickLead = (id: string) => {
    setLeadId(id);
    const l = (leads.data ?? []).find((x) => x.id === id);
    if (l) {
      setClientName(l.name);
      setCompany(l.company ?? "");
      setEmail(l.email ?? "");
      setPhone(l.phone ?? "");
    }
  };

  const setItem = (i: number, patch: Partial<PricingLine>) =>
    setItems((arr) => arr.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const refresh = () => {
    for (const k of ["crm-proposals", "crm-lead", "crm-sales-dashboard", "crm-leads", "crm-activities"])
      void qc.invalidateQueries({ queryKey: [k] });
    onDone?.();
  };

  async function persist() {
    if (!lead) throw new Error("Pehle lead select karo.");
    const pricing = items.filter((l) => l.item.trim());
    if (!pricing.length) throw new Error("Kam se kam ek item add karo.");
    if (clientName.trim().length < 2) throw new Error("Client name daalo.");
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error("Email sahi nahi hai.");
    const saved = await save({
      data: {
        id: billId,
        leadId: lead.id,
        title: `Bill for ${company || clientName}`,
        clientName,
        clientCompany: company,
        clientEmail: email,
        scope: "",
        deliverables: [],
        pricing,
        currency: "INR",
        notes,
        terms: "All fees are non-refundable.",
        validUntil,
        kind: "billing",
      },
    });
    setBillId(saved.id);
    return saved;
  }

  async function run(mode: "draft" | "email" | "wa") {
    setBusy(true);
    try {
      const bill = await persist();
      if (mode === "email") {
        await send({
          data: {
            id: bill.id,
            subject: `Your bill from Vizogen`,
            message: `Hi ${clientName}, please find your Vizogen bill attached. Review, sign and pay via UPI using the link.`,
          },
        });
        toast.success("Bill create ho gaya aur mail par bhej diya.");
      } else if (mode === "wa") {
        const { link } = await sendWa({ data: { id: bill.id } });
        const text = encodeURIComponent(
          `Hi ${clientName}, aapka Vizogen bill (₹${total.toLocaleString("en-IN")}) ready hai. Sign karke UPI se pay karein:\n\n${link}\n\n— Vizogen Team`,
        );
        window.open(`https://wa.me/${toWa(phone)}?text=${text}`, "_blank");
        toast.success("Bill create ho gaya — WhatsApp khul raha hai.");
      } else toast.success("Bill draft save ho gaya.");
      setOpen(false);
      reset();
      refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      toast.error(msg && !msg.trim().startsWith("[") ? msg : "Bill create nahi hua — details check karo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { if (billId) refresh(); reset(); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Billing</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!fixedLead ? (
            <div className="space-y-1.5">
              <Label>Lead</Label>
              <Select value={leadId} onValueChange={pickLead}>
                <SelectTrigger>
                  <SelectValue placeholder={leads.isLoading ? "Loading..." : "Lead select karo"} />
                </SelectTrigger>
                <SelectContent>
                  {(leads.data ?? []).map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                      {l.company ? ` — ${l.company}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Client name</Label><Input value={clientName} onChange={(e) => setClientName(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Company</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          </div>
          <div className="space-y-2">
            <Label>Items</Label>
            {items.map((l, i) => (
              <div key={i} className="grid grid-cols-[1fr_70px_110px_auto] gap-2">
                <Input placeholder="Item / service" value={l.item} onChange={(e) => setItem(i, { item: e.target.value })} />
                <Input type="number" min={1} value={l.qty} onChange={(e) => setItem(i, { qty: Math.max(1, Number(e.target.value) || 1) })} />
                <Input type="number" min={0} placeholder="Rate ₹" value={l.price || ""} onChange={(e) => setItem(i, { price: Math.max(0, Number(e.target.value) || 0) })} />
                <Button type="button" variant="ghost" size="icon" disabled={items.length === 1} onClick={() => setItems((a) => a.filter((_, idx) => idx !== i))}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setItems((a) => [...a, { item: "", qty: 1, price: 0 }])}>
              <Plus className="size-4" /> Add item
            </Button>
            <p className="text-right text-lg font-semibold text-foreground">Total: ₹{total.toLocaleString("en-IN")}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Valid till</Label><Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label>Notes (optional)</Label><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
        <DialogFooter className="flex-wrap gap-2">
          <Button variant="outline" disabled={busy} onClick={() => run("draft")}><Save className="size-4" /> Save as Draft</Button>
          <Button variant="outline" disabled={busy || !phone} onClick={() => run("wa")}><MessageCircle className="size-4" /> WhatsApp</Button>
          <Button className="gradient-brand text-white" disabled={busy || !email.trim()} onClick={() => run("email")}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Create & Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
