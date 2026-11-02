import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Download, Eraser, Loader2, MessageCircle, PenLine, Send } from "lucide-react";
import { downloadBillingPdf, getBilling, requestBillingChanges, signBilling } from "@/lib/billing.functions";
import { formatAmount } from "@/lib/billing";
import { VizogenMark } from "@/components/brand/logo";
import { NAP } from "@/lib/aeo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const SIG_FONTS = ["Dancing Script", "Great Vibes", "Caveat", "Satisfy"];
const WHATSAPP = `https://wa.me/${NAP.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Vizogen, my billing link has expired. Please send a new one.")}`;

export const Route = createFileRoute("/billing/$token")({
  head: () => ({
    meta: [
      { title: "Review & sign your Vizogen billing" },
      { name: "description", content: "Securely review, accept and digitally sign your Vizogen quotation or invoice." },
      { property: "og:title", content: "Review & sign your Vizogen billing" },
      { property: "og:description", content: "Securely review, accept and digitally sign your Vizogen billing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Dancing+Script:wght@600&family=Great+Vibes&family=Satisfy&display=swap",
      },
    ],
  }),
  component: BillingPage,
});

function Shell({ children, number }: { children: React.ReactNode; number?: string }) {
  return (
    <div className="min-h-screen bg-muted/30 py-6 sm:py-10">
      <article className="mx-auto w-full max-w-3xl px-3 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <header className="gradient-brand flex items-center justify-between gap-3 px-5 py-5 text-white sm:px-8">
            <div className="flex items-center gap-2.5">
              <VizogenMark className="size-9" />
              <span className="text-lg font-bold tracking-tight font-display">Vizogen</span>
            </div>
            {number ? <span className="font-mono text-sm opacity-95">{number}</span> : null}
          </header>
          <div className="px-5 py-7 sm:px-8">{children}</div>
        </div>
      </article>
    </div>
  );
}

function Message({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="py-6 text-center">
      <h1 className="text-xl font-bold text-foreground font-display">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {children ? <div className="mt-5 flex justify-center gap-2">{children}</div> : null}
    </div>
  );
}

function useDownload(token: string) {
  const dl = useServerFn(downloadBillingPdf);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try {
      const r = await dl({ data: { token } });
      if (r.url) window.open(r.url, "_blank", "noopener");
      else if (r.base64) {
        const bin = Uint8Array.from(atob(r.base64), (c) => c.charCodeAt(0));
        const url = URL.createObjectURL(new Blob([bin], { type: "application/pdf" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = r.filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
    } finally {
      setBusy(false);
    }
  };
  return { run, busy };
}

function BillingPage() {
  const { token } = Route.useParams();
  const fetchBilling = useServerFn(getBilling);
  const q = useQuery({ queryKey: ["billing", token], queryFn: () => fetchBilling({ data: { token } }), retry: false });
  const download = useDownload(token);
  const [done, setDone] = useState<{ emailed: boolean } | null>(null);

  if (q.isLoading)
    return (
      <div className="grid min-h-screen place-items-center bg-muted/30">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );

  const d = q.data;
  if (!d || d.state === "invalid")
    return (
      <Shell>
        <Message title="Link not valid" body="This billing link isn't valid. Please check the email we sent you, or contact us." />
      </Shell>
    );

  const DownloadBtn = ({ label }: { label: string }) => (
    <Button variant="outline" onClick={download.run} disabled={download.busy}>
      {download.busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />} {label}
    </Button>
  );

  if (done)
    return (
      <Shell>
        <div className="py-6 text-center">
          <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="mx-auto grid size-20 place-items-center rounded-full bg-primary/10">
            <CheckCircle2 className="size-12 text-primary" />
          </motion.div>
          <h1 className="mt-5 text-2xl font-bold text-foreground font-display">Billing Confirmed! 🎉</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {done.emailed ? "A signed copy has been emailed to you." : "Your signature is saved. We'll email your signed copy shortly."} Our team will contact you about next steps.
          </p>
          <div className="mt-5 flex justify-center"><DownloadBtn label="Download Signed PDF" /></div>
        </div>
      </Shell>
    );

  if (d.state === "confirmed")
    return (
      <Shell number={d.billingNumber}>
        <Message title="This billing has already been confirmed" body={`Signed by ${d.signerName ?? "the client"}. You can download the signed copy below.`}>
          <DownloadBtn label="Download Signed PDF" />
        </Message>
      </Shell>
    );

  if (d.state === "expired")
    return (
      <Shell number={d.billingNumber}>
        <Message title="This link has expired" body="Please contact us for a new one.">
          <Button asChild className="gradient-brand text-white">
            <a href={WHATSAPP} target="_blank" rel="noreferrer"><MessageCircle className="size-4" /> WhatsApp us</a>
          </Button>
        </Message>
      </Shell>
    );

  const { doc, totals } = d;
  const money = (n: number) => formatAmount(n, doc.currency);

  return (
    <Shell number={doc.billingNumber}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">{doc.title}</h1>
      <div className="mt-4 grid gap-4 rounded-xl bg-muted/50 p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Billed to</p>
          <p className="mt-1 font-semibold text-foreground">{doc.clientCompany || doc.clientName}</p>
          <p className="text-muted-foreground">{doc.clientName} · {doc.clientEmail}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Billing no.</p>
          <p className="mt-1 font-mono font-semibold text-foreground">{doc.billingNumber}</p>
          {doc.validUntil || d.expiresAt ? (
            <p className="text-muted-foreground">Valid until {new Date(doc.validUntil ?? d.expiresAt!).toLocaleDateString("en-IN")}</p>
          ) : null}
        </div>
      </div>

      {doc.scope ? <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{doc.scope}</p> : null}

      <div className="mt-5 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="px-3 py-2.5">Description</th><th className="px-3 py-2.5 text-right">Qty</th><th className="px-3 py-2.5 text-right">Rate</th><th className="px-3 py-2.5 text-right">Amount</th></tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {doc.pricing.map((l, i) => (
              <tr key={`${l.item}-${i}`}>
                <td className="px-3 py-2.5 font-sans text-foreground">{l.item}</td>
                <td className="px-3 py-2.5 text-right text-muted-foreground">{l.qty}</td>
                <td className="px-3 py-2.5 text-right text-muted-foreground">{money(l.price)}</td>
                <td className="px-3 py-2.5 text-right text-foreground">{money(l.qty * l.price)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="font-mono text-sm">
            <tr className="border-t border-border"><td colSpan={3} className="px-3 py-2 text-right font-sans text-muted-foreground">Subtotal</td><td className="px-3 py-2 text-right">{money(totals.subtotal)}</td></tr>
            <tr><td colSpan={3} className="px-3 py-2 text-right font-sans text-muted-foreground">GST ({doc.gstRate}%)</td><td className="px-3 py-2 text-right">{money(totals.gst)}</td></tr>
            <tr className="bg-muted/40"><td colSpan={3} className="px-3 py-3 text-right font-sans font-semibold">Total</td><td className="px-3 py-3 text-right text-base font-bold">{money(totals.total)}</td></tr>
          </tfoot>
        </table>
      </div>

      {doc.terms ? (<section className="mt-5"><h2 className="text-sm font-semibold text-foreground">Payment terms</h2><p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{doc.terms}</p></section>) : null}
      {doc.notes ? (<section className="mt-4"><h2 className="text-sm font-semibold text-foreground">Notes</h2><p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{doc.notes}</p></section>) : null}

      <button type="button" onClick={download.run} disabled={download.busy} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        {download.busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />} Download PDF
      </button>

      <SignPanel token={token} defaultName={doc.clientName} onSigned={setDone} changesRequested={d.status === "changes_requested"} />
    </Shell>
  );
}

function SignPanel({ token, defaultName, onSigned, changesRequested }: { token: string; defaultName: string; onSigned: (r: { emailed: boolean }) => void; changesRequested: boolean }) {
  const sign = useServerFn(signBilling);
  const askChanges = useServerFn(requestBillingChanges);
  const [open, setOpen] = useState(false);
  const [changesOpen, setChangesOpen] = useState(false);
  const [changeMsg, setChangeMsg] = useState("");
  const [changeSent, setChangeSent] = useState(changesRequested);
  const [name, setName] = useState(defaultName);
  const [designation, setDesignation] = useState("");
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [font, setFont] = useState(SIG_FONTS[0]!);
  const [typed, setTyped] = useState(defaultName);
  const [drawn, setDrawn] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#changes") setChangesOpen(true);
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !open || mode !== "draw") return;
    const ratio = window.devicePixelRatio || 1;
    c.width = c.offsetWidth * ratio;
    c.height = c.offsetHeight * ratio;
    const ctx = c.getContext("2d")!;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#14161F";
    setDrawn(false);
  }, [open, mode]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  const typedPng = async () => {
    await document.fonts.load(`64px "${font}"`);
    const c = document.createElement("canvas");
    c.width = 900;
    c.height = 260;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#14161F";
    let size = 110;
    do {
      ctx.font = `${size}px "${font}"`;
      size -= 6;
    } while (ctx.measureText(typed).width > 840 && size > 30);
    ctx.textBaseline = "middle";
    ctx.fillText(typed, 30, 135);
    return c.toDataURL("image/png");
  };

  const hasSig = mode === "draw" ? drawn : typed.trim().length >= 2;
  const ready = name.trim().length >= 2 && hasSig && consent;

  const submit = async () => {
    setError("");
    setBusy(true);
    try {
      const signature = mode === "draw" ? canvasRef.current!.toDataURL("image/png") : await typedPng();
      const r = await sign({ data: { token, signerName: name.trim(), designation: designation.trim(), signature, consent: true } });
      onSigned({ emailed: r.emailed });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="changes" className="mt-8 border-t border-border pt-6">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={() => setOpen(true)} className="gradient-brand flex-1 text-white" size="lg">
          <PenLine className="size-4" /> Accept &amp; Sign
        </Button>
        <Button variant="outline" size="lg" onClick={() => setChangesOpen((v) => !v)}>Request Changes</Button>
      </div>

      <AnimatePresence>
        {changesOpen ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4">
              {changeSent ? (
                <p className="text-sm text-foreground">Thanks — your change request has reached our team. We'll get back to you soon.</p>
              ) : (
                <>
                  <label htmlFor="chg" className="text-sm font-medium text-foreground">What would you like us to change?</label>
                  <Textarea id="chg" value={changeMsg} maxLength={2000} onChange={(e) => setChangeMsg(e.target.value)} className="mt-1.5" rows={3} />
                  <Button className="mt-3" size="sm" disabled={changeMsg.trim().length < 5 || busy} onClick={async () => {
                    setBusy(true);
                    try {
                      await askChanges({ data: { token, message: changeMsg.trim() } });
                      setChangeSent(true);
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Something went wrong.");
                    } finally {
                      setBusy(false);
                    }
                  }}>
                    <Send className="size-4" /> Send to Vizogen
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="mt-4 space-y-4 rounded-2xl border border-border bg-muted/30 p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="sn" className="text-sm font-medium text-foreground">Full name *</label>
                  <Input id="sn" value={name} maxLength={120} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <label htmlFor="sd" className="text-sm font-medium text-foreground">Designation / Company</label>
                  <Input id="sd" value={designation} maxLength={160} onChange={(e) => setDesignation(e.target.value)} className="mt-1.5" placeholder="Optional" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex rounded-full border border-border bg-background p-0.5 text-sm">
                    {(["draw", "type"] as const).map((m) => (
                      <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-full px-4 py-1.5 font-medium capitalize ${mode === m ? "gradient-brand text-white" : "text-muted-foreground"}`}>{m}</button>
                    ))}
                  </div>
                  {mode === "draw" ? (
                    <button type="button" onClick={() => { const c = canvasRef.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); setDrawn(false); }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <Eraser className="size-3.5" /> Clear
                    </button>
                  ) : null}
                </div>
                {mode === "draw" ? (
                  <canvas
                    ref={canvasRef}
                    aria-label="Signature pad — draw your signature"
                    className="mt-2 h-44 w-full touch-none rounded-xl border border-dashed border-border bg-background"
                    onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drawing.current = true; const ctx = e.currentTarget.getContext("2d")!; const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(x, y); }}
                    onPointerMove={(e) => { if (!drawing.current) return; const ctx = e.currentTarget.getContext("2d")!; const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); setDrawn(true); }}
                    onPointerUp={() => (drawing.current = false)}
                    onPointerCancel={() => (drawing.current = false)}
                  />
                ) : (
                  <div className="mt-2 space-y-2">
                    <Input value={typed} maxLength={60} onChange={(e) => setTyped(e.target.value)} placeholder="Type your name" />
                    <div className="grid grid-cols-2 gap-2">
                      {SIG_FONTS.map((f) => (
                        <button key={f} type="button" onClick={() => setFont(f)} style={{ fontFamily: `"${f}", cursive` }} className={`truncate rounded-xl border bg-background px-3 py-3 text-2xl text-foreground ${font === f ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
                          {typed || "Your name"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2.5 text-sm text-foreground">
                <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
                <span>I have reviewed this billing and agree to its terms. I understand my digital signature is legally binding.</span>
              </label>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button onClick={submit} disabled={!ready || busy} size="lg" className="gradient-brand w-full text-white">
                {busy ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />} Confirm &amp; Sign
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {!open && error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
    </section>
  );
}
