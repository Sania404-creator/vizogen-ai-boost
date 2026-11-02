import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { UPI_ID, billingTotals, formatAmount, istDateTime, upiPayLink, type BillingLine } from "@/lib/billing";
import { NAP } from "@/lib/aeo";

export interface BillingDoc {
  billingNumber: string;
  title: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  scope: string;
  pricing: BillingLine[];
  currency: string;
  notes: string;
  terms: string;
  validUntil: string | null;
  createdAt: string;
}

export interface SignatureInfo {
  pngBytes: Uint8Array;
  signerName: string;
  designation: string;
  signedAt: string;
  ip: string;
  userAgent: string;
  documentHash: string;
}

const BLUE = rgb(0.184, 0.502, 1);
const INK = rgb(0.08, 0.09, 0.12);
const MUTED = rgb(0.42, 0.44, 0.5);

/** Standard PDF fonts only cover Latin-1; replace anything else. */
const clean = (s: string) =>
  String(s ?? "")
    .replace(/₹/g, "Rs.")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[^\x09\x0a\x0d\x20-\x7e\xa0-\xff]/g, "");

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const out: string[] = [];
  for (const para of clean(text).split(/\n/)) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      const t = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(t, size) > width && line) {
        out.push(line);
        line = word;
      } else line = t;
    }
    out.push(line);
  }
  return out;
}

/** Stable SHA-256 of the billing content shown to the client. */
export async function billingHash(doc: BillingDoc) {
  const canonical = JSON.stringify([
    doc.billingNumber, doc.title, doc.clientName, doc.clientCompany, doc.scope,
    doc.pricing, doc.currency, doc.notes, doc.terms, doc.validUntil,
  ]);
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function renderBillingPdf(doc: BillingDoc, sig?: SignatureInfo) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Vizogen billing ${doc.billingNumber}`);
  pdf.setAuthor(NAP.name);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  const W = 595, H = 842, M = 48;
  let page: PDFPage = pdf.addPage([W, H]);
  let y = H - M;

  const ensure = (h: number) => {
    if (y - h < M) {
      page = pdf.addPage([W, H]);
      y = H - M;
    }
  };
  const text = (t: string, x: number, size = 10, f = font, color = INK) =>
    page.drawText(clean(t), { x, y, size, font: f, color });
  const para = (t: string, size = 10) => {
    for (const l of wrap(t, font, size, W - 2 * M)) {
      ensure(size + 4);
      text(l, M, size, font, MUTED);
      y -= size + 4;
    }
  };

  page.drawRectangle({ x: 0, y: H - 90, width: W, height: 90, color: BLUE });
  page.drawText("Vizogen", { x: M, y: H - 52, size: 24, font: bold, color: rgb(1, 1, 1) });
  page.drawText(clean(`Billing ${doc.billingNumber}`), { x: M, y: H - 74, size: 11, font, color: rgb(1, 1, 1) });
  y = H - 120;

  text(doc.title, M, 15, bold);
  y -= 22;
  text(`Billed to: ${doc.clientCompany || doc.clientName}`, M);
  text(`Date: ${new Date(doc.createdAt).toLocaleDateString("en-IN")}`, 360);
  y -= 14;
  text(`${doc.clientName}  ${doc.clientEmail}`, M, 10, font, MUTED);
  if (doc.validUntil) text(`Valid until: ${new Date(doc.validUntil).toLocaleDateString("en-IN")}`, 360);
  y -= 14;
  text(`Billed by: ${NAP.name}, ${NAP.locality}, ${NAP.region}`, M, 10, font, MUTED);
  y -= 26;

  if (doc.scope) {
    text("Scope", M, 11, bold);
    y -= 15;
    para(doc.scope);
    y -= 10;
  }

  // Line items
  ensure(40);
  page.drawRectangle({ x: M, y: y - 6, width: W - 2 * M, height: 20, color: rgb(0.95, 0.96, 0.98) });
  text("Description", M + 6, 9, bold);
  text("Qty", 340, 9, bold);
  text("Rate", 390, 9, bold);
  text("Amount", 475, 9, bold);
  y -= 24;
  for (const l of doc.pricing) {
    const lines = wrap(l.item, font, 10, 280);
    ensure(lines.length * 14 + 4);
    text(String(l.qty), 340, 10, mono);
    text(formatAmount(l.price, doc.currency, true), 390, 10, mono);
    text(formatAmount(l.qty * l.price, doc.currency, true), 475, 10, mono);
    for (const ln of lines) {
      text(ln, M + 6);
      y -= 14;
    }
    y -= 4;
  }
  const t = billingTotals(doc.pricing);
  ensure(60);
  page.drawLine({ start: { x: 330, y: y + 6 }, end: { x: W - M, y: y + 6 }, color: MUTED, thickness: 0.5 });
  y -= 8;
  text("Subtotal", 390, 10);
  text(formatAmount(t.subtotal, doc.currency, true), 475, 10, mono);
  y -= 15;
  text("Total", 390, 11, bold);
  text(formatAmount(t.total, doc.currency, true), 475, 11, bold);
  y -= 28;

  if (doc.currency === "INR" && t.total > 0) {
    ensure(130);
    const QR = await import("qrcode");
    const dataUrl = await QR.toDataURL(upiPayLink(t.total, doc.billingNumber), { margin: 1, width: 300 });
    const qr = await pdf.embedPng(Buffer.from(dataUrl.split(",")[1]!, "base64"));
    page.drawImage(qr, { x: M, y: y - 110, width: 110, height: 110 });
    text("Pay via UPI", M + 125, 12, bold, BLUE);
    y -= 18;
    text(`UPI ID: ${UPI_ID}`, M + 125, 10, mono);
    y -= 15;
    text(`Amount: ${formatAmount(t.total, doc.currency, true)}`, M + 125, 10, mono);
    y -= 15;
    text("Scan with any UPI app - the exact amount is filled in.", M + 125, 9, font, MUTED);
    y -= 92;
  }

  if (doc.terms) {
    ensure(30);
    text("Payment terms", M, 11, bold);
    y -= 15;
    para(doc.terms);
    y -= 10;
  }
  if (doc.notes) {
    ensure(30);
    text("Notes", M, 11, bold);
    y -= 15;
    para(doc.notes);
    y -= 10;
  }

  if (sig) {
    ensure(150);
    y -= 10;
    page.drawRectangle({ x: M, y: y - 120, width: W - 2 * M, height: 128, borderColor: BLUE, borderWidth: 1 });
    y -= 8;
    text("Accepted & signed", M + 12, 11, bold, BLUE);
    const img = await pdf.embedPng(sig.pngBytes);
    const scale = Math.min(200 / img.width, 70 / img.height);
    page.drawImage(img, { x: M + 12, y: y - 82, width: img.width * scale, height: img.height * scale });
    text(sig.signerName, 300, 11, bold);
    y -= 15;
    if (sig.designation) text(sig.designation, 300, 10, font, MUTED);
    y -= 15;
    text(istDateTime(sig.signedAt), 300, 10, font, MUTED);
    y -= 15;
    text("Digitally signed via Vizogen", 300, 10, font, MUTED);
    y -= 60;

    // Certificate page
    page = pdf.addPage([W, H]);
    y = H - M;
    text("Signature Certificate", M, 18, bold, BLUE);
    y -= 30;
    const rows: [string, string][] = [
      ["Document", `Billing ${doc.billingNumber} - ${doc.title}`],
      ["Signer", sig.signerName],
      ["Designation / Company", sig.designation || "-"],
      ["Signer email", doc.clientEmail],
      ["Signed at", istDateTime(sig.signedAt)],
      ["IP address", sig.ip || "unknown"],
      ["Browser", sig.userAgent || "unknown"],
      ["Document SHA-256", sig.documentHash],
      ["Consent", "I have reviewed this billing and agree to its terms. I understand my digital signature is legally binding."],
    ];
    for (const [k, v] of rows) {
      text(k, M, 10, bold);
      const lines = wrap(v, k === "Document SHA-256" ? mono : font, 9, 330);
      for (const l of lines) {
        ensure(14);
        page.drawText(l, { x: 200, y, size: 9, font: k === "Document SHA-256" ? mono : font, color: MUTED });
        y -= 13;
      }
      y -= 8;
    }
    y -= 10;
    para("The document hash is computed over the billing content at the moment of signing. Any later change to the billing produces a different hash.");
  }

  return pdf.save();
}

export const toBase64 = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64");
