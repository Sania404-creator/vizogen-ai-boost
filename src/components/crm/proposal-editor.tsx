import { type ReactNode, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  listTemplates,
  saveProposal,
  sendProposal,
  type PricingLine,
} from "@/lib/proposals.functions";
import type { Lead } from "@/lib/crm.functions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProposalEditor({
  lead,
  trigger,
  onSent,
}: {
  lead: Lead;
  trigger: ReactNode;
  onSent?: () => void;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const fetchTemplates = useServerFn(listTemplates);
  const save = useServerFn(saveProposal);
  const send = useServerFn(sendProposal);
  const templates = useQuery({ queryKey: ["crm-templates"], queryFn: () => fetchTemplates() });

  const [title, setTitle] = useState(`Vizogen proposal for ${lead.company || lead.name}`);
  const [scope, setScope] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [pricing, setPricing] = useState<PricingLine[]>([{ item: "", qty: 1, price: 0 }]);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(
    "All fees are non-refundable. Invoices are payable in advance of each billing cycle.",
  );
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10),
  );
  const [subject, setSubject] = useState(`Your Vizogen proposal — ${lead.company || lead.name}`);
  const [message, setMessage] = useState(
    `Hi ${lead.name},\n\nThanks for your time. Here is the Vizogen proposal we discussed, covering scope, deliverables and pricing.\n\nOpen the link below to review it. Happy to walk you through it on a quick call.\n\nBest,\nVizogen Sales Team`,
  );
  const [templateId, setTemplateId] = useState("");

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const t = (templates.data ?? []).find((x) => x.id === id);
    if (!t) return;
    setScope(t.scope);
    setDeliverables(t.deliverables.join("\n"));
    setPricing(t.pricing.length ? t.pricing : [{ item: "", qty: 1, price: 0 }]);
    setNotes(t.notes);
    setTerms(t.terms);
  };

  const total = pricing.reduce((sum, l) => sum + l.qty * l.price, 0);
  const symbol = currency === "INR" ? "₹" : "$";

  const submit = async (sendNow: boolean) => {
    if (!lead.email) {
      toast.error("This lead has no email address. Add one first.");
      return;
    }
    setBusy(true);
    try {
      const proposal = await save({
        data: {
          leadId: lead.id,
          templateId: templateId || "",
          title,
          clientName: lead.name,
          clientCompany: lead.company,
          clientEmail: lead.email,
          scope,
          deliverables: deliverables
            .split("\n")
            .map((d) => d.trim())
            .filter(Boolean),
          pricing: pricing.filter((l) => l.item.trim()),
          currency,
          notes,
          terms,
          validUntil,
        },
      });
      if (sendNow) {
        await send({
          data: {
            id: proposal.id,
            subject,
            message,
            origin: window.location.origin,
          },
        });
        toast.success(`Proposal emailed to ${lead.email}.`);
      } else {
        toast.success("Proposal saved as a draft.");
      }
      setOpen(false);
      onSent?.();
      void queryClient.invalidateQueries({ queryKey: ["crm-proposals"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the proposal.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vizogen proposal</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Start from a template</Label>
              <Select value={templateId} onValueChange={applyTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Blank proposal" />
                </SelectTrigger>
                <SelectContent>
                  {(templates.data ?? []).map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Valid until</Label>
              <Input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Proposal title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Project scope</Label>
            <Textarea rows={3} value={scope} onChange={(e) => setScope(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Deliverables (one per line)</Label>
            <Textarea
              rows={4}
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Pricing</Label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as "INR" | "USD")}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR ₹</SelectItem>
                  <SelectItem value="USD">USD $</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {pricing.map((line, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={line.item}
                  placeholder="Item / package"
                  onChange={(e) =>
                    setPricing(pricing.map((l, j) => (j === i ? { ...l, item: e.target.value } : l)))
                  }
                />
                <Input
                  type="number"
                  min={1}
                  value={line.qty}
                  className="w-20"
                  onChange={(e) =>
                    setPricing(
                      pricing.map((l, j) =>
                        j === i ? { ...l, qty: Number(e.target.value) || 1 } : l,
                      ),
                    )
                  }
                />
                <Input
                  type="number"
                  min={0}
                  value={line.price}
                  className="w-28"
                  onChange={(e) =>
                    setPricing(
                      pricing.map((l, j) =>
                        j === i ? { ...l, price: Number(e.target.value) || 0 } : l,
                      ),
                    )
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPricing(pricing.filter((_, j) => j !== i))}
                  aria-label="Remove line"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPricing([...pricing, { item: "", qty: 1, price: 0 }])}
              >
                <Plus className="size-4" /> Add line
              </Button>
              <p className="text-sm font-semibold text-foreground">
                Total {symbol}
                {total.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Custom notes</Label>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Terms</Label>
            <Textarea rows={2} value={terms} onChange={(e) => setTerms(e.target.value)} />
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-sm font-semibold text-foreground">Email to {lead.email || "—"}</p>
            <div className="mt-3 space-y-3">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
              <Textarea rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" disabled={busy} onClick={() => submit(false)}>
            Save draft
          </Button>
          <Button disabled={busy} onClick={() => submit(true)} className="gradient-brand text-white">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Send
            proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
