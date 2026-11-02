import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Smartphone } from "lucide-react";
import { UPI_ID, formatAmount, upiPayLink } from "@/lib/billing";

/** UPI QR for the exact bill amount. */
export function UpiPay({ amount, billingNumber }: { amount: number; billingNumber: string }) {
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const link = upiPayLink(amount, billingNumber);
  useEffect(() => {
    void QRCode.toDataURL(link, { margin: 1, width: 360 }).then(setQr);
  }, [link]);
  return (
    <section className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-start">
      {qr ? <img src={qr} alt={`UPI QR code to pay ${formatAmount(amount, "INR")}`} className="size-40 rounded-xl bg-white p-2" /> : <div className="size-40 rounded-xl bg-muted" />}
      <div className="text-center sm:text-left">
        <h2 className="text-base font-semibold text-foreground font-display">Pay via UPI</h2>
        <p className="mt-1 text-sm text-muted-foreground">Scan with GPay, PhonePe, Paytm or any UPI app. The amount is filled in for you.</p>
        <p className="mt-3 font-mono text-lg font-bold text-foreground">{formatAmount(amount, "INR")}</p>
        <button type="button" onClick={() => { void navigator.clipboard?.writeText(UPI_ID); setCopied(true); }} className="mt-1 inline-flex items-center gap-1.5 font-mono text-sm text-primary">
          {UPI_ID} <Copy className="size-3.5" /> {copied ? <span className="font-sans text-xs">copied</span> : null}
        </button>
        <a href={link} className="mt-3 flex w-fit items-center gap-1.5 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary sm:hidden mx-auto">
          <Smartphone className="size-4" /> Open UPI app
        </a>
      </div>
    </section>
  );
}
