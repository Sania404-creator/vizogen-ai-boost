/** Client-safe billing helpers shared by the CRM, the public billing page and PDFs. */
export interface BillingLine {
  item: string;
  qty: number;
  price: number;
}

export const BILLING_LINK_DAYS = 14;

export const BILLING_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  viewed: "Viewed",
  changes_requested: "Changes Requested",
  confirmed: "Confirmed",
  accepted: "Confirmed",
  expired: "Expired",
  rejected: "Rejected",
};

export function billingTotals(lines: BillingLine[], gstRate: number) {
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const gst = Math.round(subtotal * (gstRate / 100) * 100) / 100;
  return { subtotal, gst, total: Math.round((subtotal + gst) * 100) / 100 };
}

export function formatAmount(n: number, currency: string, ascii = false) {
  const sym = currency === "USD" ? "$" : ascii ? "Rs. " : "₹";
  return sym + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

/** Effective status, treating past-expiry unsigned links as expired. */
export function effectiveBillingStatus(status: string, expiresAt: string | null) {
  if (status === "confirmed" || status === "accepted" || status === "draft") return status;
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) return "expired";
  return status;
}

export function istDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";
}

export const UPI_ID = "9586387958@kotakbank";
export const UPI_PAYEE = "Vizogen";

/** UPI deep link for the exact bill amount (INR only). */
export function upiPayLink(amount: number, billingNumber: string) {
  const p = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_PAYEE,
    am: amount.toFixed(2),
    cu: "INR",
    tn: `Billing ${billingNumber}`,
  });
  return `upi://pay?${p.toString()}`;
}
