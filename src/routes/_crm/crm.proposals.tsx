import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CrmShell } from "@/components/crm/shell";
import {
  deleteTemplate,
  listProposals,
  listTemplates,
  saveTemplate,
  setProposalStatus,
} from "@/lib/proposals.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export const Route = createFileRoute("/_crm/crm/proposals")({
  head: () => ({
    meta: [
      { title: "Proposals — Vizogen CRM" },
      {
        name: "description",
        content: "Every Vizogen proposal sent, its status, and reusable proposal templates.",
      },
      { property: "og:title", content: "Proposals — Vizogen CRM" },
      { property: "og:description", content: "Sent proposals and reusable templates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProposalsPage,
});

function ProposalsPage() {
  const queryClient = useQueryClient();
  const fetchProposals = useServerFn(listProposals);
  const fetchTemplates = useServerFn(listTemplates);
  const setStatus = useServerFn(setProposalStatus);
  const removeTemplate = useServerFn(deleteTemplate);

  const proposals = useQuery({ queryKey: ["crm-proposals"], queryFn: () => fetchProposals() });
  const templates = useQuery({ queryKey: ["crm-templates"], queryFn: () => fetchTemplates() });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["crm-proposals"] });
    void queryClient.invalidateQueries({ queryKey: ["crm-templates"] });
  };

  return (
    <CrmShell title="Proposals" subtitle="Sent proposals and reusable Vizogen templates">
      <Tabs defaultValue="sent">
        <TabsList>
          <TabsTrigger value="sent">Sent proposals</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="mt-5">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Proposal</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(proposals.data ?? []).map((p) => {
                  const total = (p.pricing ?? []).reduce((s, l) => s + l.qty * l.price, 0);
                  return (
                    <tr key={p.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <Link
                          to="/crm/lead/$id"
                          params={{ id: p.lead_id }}
                          className="font-semibold text-foreground hover:text-primary"
                        >
                          {p.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">v{p.version}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {p.client_company || p.client_name}
                        <br />
                        <span className="text-xs">{p.client_email}</span>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {p.currency === "INR" ? "₹" : "$"}
                        {total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={p.status}
                          onValueChange={async (v) => {
                            await setStatus({
                              data: { id: p.id, status: v as "sent" | "viewed" | "accepted" | "rejected" | "draft" },
                            });
                            refresh();
                          }}
                        >
                          <SelectTrigger className="h-8 w-32 capitalize">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="viewed">Viewed</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {p.sent_at ? new Date(p.sent_at).toLocaleDateString() : "—"}
                        {p.viewed_at ? (
                          <Badge variant="secondary" className="ml-2 text-[10px]">
                            viewed
                          </Badge>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/proposal/${p.share_token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          Client view <ExternalLink className="size-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(proposals.data ?? []).length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                No proposals yet. Open a lead and click “Send proposal”.
              </p>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-5">
          <div className="mb-4 flex justify-end">
            <TemplateDialog onSaved={refresh} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(templates.data ?? []).map((t) => (
              <div key={t.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-foreground font-display">
                    <FileText className="size-4 text-primary" /> {t.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <TemplateDialog template={t} onSaved={refresh} />
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete template"
                      onClick={async () => {
                        await removeTemplate({ data: { id: t.id } });
                        toast.success("Template deleted.");
                        refresh();
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t.scope}</p>
                <ul className="mt-3 space-y-1 text-sm text-foreground">
                  {t.deliverables.slice(0, 4).map((d) => (
                    <li key={d}>• {d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </CrmShell>
  );
}

function TemplateDialog({
  template,
  onSaved,
}: {
  template?: {
    id: string;
    name: string;
    scope: string;
    deliverables: string[];
    pricing: { item: string; qty: number; price: number }[];
    notes: string;
    terms: string;
  };
  onSaved: () => void;
}) {
  const save = useServerFn(saveTemplate);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(template?.name ?? "");
  const [scope, setScope] = useState(template?.scope ?? "");
  const [deliverables, setDeliverables] = useState((template?.deliverables ?? []).join("\n"));
  const [price, setPrice] = useState(String(template?.pricing?.[0]?.price ?? 0));
  const [item, setItem] = useState(template?.pricing?.[0]?.item ?? "");
  const [notes, setNotes] = useState(template?.notes ?? "");
  const [terms, setTerms] = useState(template?.terms ?? "");

  const submit = async () => {
    try {
      await save({
        data: {
          ...(template ? { id: template.id } : {}),
          name,
          scope,
          deliverables: deliverables
            .split("\n")
            .map((d) => d.trim())
            .filter(Boolean),
          pricing: item ? [{ item, qty: 1, price: Number(price) || 0 }] : [],
          notes,
          terms,
        },
      });
      toast.success("Template saved.");
      setOpen(false);
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the template.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {template ? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="gradient-brand text-white">
            <Plus className="size-4" /> New template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{template ? "Edit template" : "New proposal template"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Template name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Scope</Label>
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
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Default package</Label>
              <Input value={item} onChange={(e) => setItem(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Default price</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min={0}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Terms</Label>
            <Textarea rows={2} value={terms} onChange={(e) => setTerms(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={submit}
            disabled={name.trim().length < 2}
            className="gradient-brand text-white"
          >
            Save template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
