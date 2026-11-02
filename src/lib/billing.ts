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
