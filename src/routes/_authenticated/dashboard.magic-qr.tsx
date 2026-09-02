import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, QrCode, Trash2, Copy, Star, Download } from "lucide-react";
import {
  listQrCodes,
  createQrCode,
  updateQrCode,
  deleteQrCode,
  renderQrSvg,
  type QrRow,
} from "@/lib/qr.functions";
import { getWorkspace } from "@/lib/workspace.functions";
import { DashboardShell } from "@/components/dashboard/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/magic-qr")({
  component: MagicQrPage,
});

function MagicQrPage() {
  const fetchWorkspace = useServerFn(getWorkspace);
  const fetchCodes = useServerFn(listQrCodes);
  const create = useServerFn(createQrCode);
  const update = useServerFn(updateQrCode);
  const remove = useServerFn(deleteQrCode);
  const render = useServerFn(renderQrSvg);

  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });
  const data = useQuery({ queryKey: ["qr-codes"], queryFn: () => fetchCodes() });

  const [title, setTitle] = useState("How was your experience?");
  const [reviewLink, setReviewLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [svgs, setSvgs] = useState<Record<string, string>>({});

  const business = workspace.data?.business ?? null;
  const origin = typeof window === "undefined" ? "https://www.vizogen.in" : window.location.origin;
  const linkFor = (code: QrRow) => `${origin}/r/${code.slug}`;

  const add = async () => {
    setBusy(true);
    try {
      await create({ data: { title: title.trim(), reviewLink: reviewLink.trim() } });
      setReviewLink("");
      void data.refetch();
      toast.success("Magic QR created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the QR code.");
    } finally {
      setBusy(false);
    }
  };

  const showQr = async (code: QrRow) => {
    if (svgs[code.id]) return;
    const result = await render({ data: { url: linkFor(code) } });
    setSvgs((prev) => ({ ...prev, [code.id]: result.svg }));
  };

  const download = async (code: QrRow) => {
    const svg = svgs[code.id] ?? (await render({ data: { url: linkFor(code) } })).svg;
    setSvgs((prev) => ({ ...prev, [code.id]: svg }));
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vizogen-magic-qr-${code.slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!workspace.isLoading && !business) {
    return (
      <DashboardShell title="Magic QR">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <p className="text-muted-foreground">Add your business details first.</p>
          <Button asChild className="mt-4 gradient-brand text-white">
            <Link to="/dashboard">Go to setup</Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Magic QR"
      subtitle="4–5 stars go straight to Google. 1–3 stars reach you privately first."
    >
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-base font-semibold text-foreground font-display">New Magic QR</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="qr-title">Question shown to customers</Label>
              <Input id="qr-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qr-link">Google review link (optional)</Label>
              <Input
                id="qr-link"
                value={reviewLink}
                onChange={(e) => setReviewLink(e.target.value)}
                placeholder={business?.review_link ?? "https://g.page/r/…/review"}
              />
            </div>
            <Button onClick={add} disabled={busy} className="w-full gradient-brand text-white">
              {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <QrCode className="mr-2 size-4" />}
              Create Magic QR
            </Button>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Recent feedback
            </h3>
            <div className="mt-3 space-y-3">
              {(data.data?.feedback ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No feedback yet.</p>
              ) : (
                (data.data?.feedback ?? []).slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`size-3.5 ${n <= item.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                      {item.routed_to_google ? (
                        <Badge variant="outline" className="ml-auto text-[0.65rem]">
                          Sent to Google
                        </Badge>
                      ) : null}
                    </div>
                    {item.comment ? (
                      <p className="mt-2 text-sm text-muted-foreground">{item.comment}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.customer_name || "Anonymous"} · {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {data.isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : (data.data?.codes ?? []).length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No Magic QR codes yet.
            </p>
          ) : (
            (data.data?.codes ?? []).map((code) => (
              <div key={code.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void showQr(code)}
                    className="flex size-32 shrink-0 items-center justify-center rounded-xl border border-border bg-white p-2"
                    aria-label="Show QR code"
                  >
                    {svgs[code.id] ? (
                      <span
                        className="block size-full [&>svg]:size-full"
                        dangerouslySetInnerHTML={{ __html: svgs[code.id]! }}
                      />
                    ) : (
                      <QrCode className="size-8 text-muted-foreground" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{code.title}</p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">{linkFor(code)}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{code.scans} scans</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          void navigator.clipboard.writeText(linkFor(code));
                          toast.success("Link copied.");
                        }}
                      >
                        <Copy className="mr-2 size-3.5" /> Copy link
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => void download(code)}>
                        <Download className="mr-2 size-3.5" /> Download
                      </Button>
                      <div className="flex items-center gap-2 pl-1">
                        <Switch
                          checked={code.active}
                          onCheckedChange={async (checked) => {
                            await update({ data: { id: code.id, active: checked } });
                            void data.refetch();
                          }}
                        />
                        <span className="text-xs text-muted-foreground">Active</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={async () => {
                          await remove({ data: { id: code.id } });
                          void data.refetch();
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
