import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Eraser, Loader2, PenLine, Receipt } from "lucide-react";
import { acceptProposal } from "@/lib/proposals.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  token: string;
  total: string;
  status: string;
  signerName: string | null;
  acceptedAt: string | null;
  invoiceNumber: string | null;
  onDone: () => void;
}

export function ProposalAccept(props: Props) {
  const accept = useServerFn(acceptProposal);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [signed, setSigned] = useState(false);
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ invoiceNumber: string; emailed: boolean } | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    c.width = c.offsetWidth * ratio;
    c.height = c.offsetHeight * ratio;
    const ctx = c.getContext("2d")!;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#14161F";
  }, [props.status]);

  if (props.status === "accepted" || result) {
    return (
      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <p className="flex items-center gap-2 font-semibold text-foreground">
          <CheckCircle2 className="size-5 text-primary" /> Proposal accepted &amp; e-signed
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {props.signerName || name} agreed to the Terms &amp; Conditions
          {props.acceptedAt ? ` on ${new Date(props.acceptedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST` : ""}.
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm text-foreground">
          <Receipt className="size-4 text-primary" /> Bill {result?.invoiceNumber || props.invoiceNumber}
          {result && !result.emailed ? " — we couldn't email it, our team will send it shortly." : " has been sent to your email."}
        </p>
      </section>
    );
  }
  if (props.status === "rejected") return null;

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const ctx = e.currentTarget.getContext("2d")!;
    const [x, y] = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d")!;
    const [x, y] = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setSigned(true);
  };
  const clear = () => {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setSigned(false);
  };

  const submit = async () => {
    setError("");
    if (!agreed) return setError("Please agree to the Terms & Conditions.");
    if (name.trim().length < 2) return setError("Please type your full name.");
    if (!signed) return setError("Please sign in the box.");
    setBusy(true);
    try {
      const res = await accept({
        data: { token: props.token, signerName: name.trim(), signature: canvasRef.current!.toDataURL("image/png"), agreed: true },
      });
      setResult(res);
      props.onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-muted/30 p-5">
      <h2 className="text-lg font-semibold text-foreground font-display">Billing &amp; acceptance</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Total payable <span className="font-semibold text-foreground">{props.total}</span>. Accept, sign below and your bill is emailed instantly.
      </p>

      <label className="mt-4 flex items-start gap-2.5 text-sm text-foreground">
        <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
        <span>
          I agree to the{" "}
          <a href="/terms-and-conditions" target="_blank" rel="noreferrer" className="font-medium text-primary underline">
            Terms &amp; Conditions
          </a>{" "}
          and accept this proposal. I understand payments are non-refundable.
        </span>
      </label>

      <div className="mt-4">
        <label className="text-sm font-medium text-foreground" htmlFor="signer">Full name</label>
        <Input id="signer" value={name} maxLength={120} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="mt-1.5" />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground"><PenLine className="size-4" /> Digital signature</span>
          <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <Eraser className="size-3.5" /> Clear
          </button>
        </div>
        <canvas
          ref={canvasRef}
          aria-label="Signature pad"
          className="mt-1.5 h-36 w-full touch-none rounded-xl border border-dashed border-border bg-background"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => (drawing.current = false)}
          onPointerLeave={() => (drawing.current = false)}
        />
      </div>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      <Button onClick={submit} disabled={busy} className="mt-4 w-full gradient-brand text-white">
        {busy ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />} Accept, sign &amp; get my bill
      </Button>
    </section>
  );
}
