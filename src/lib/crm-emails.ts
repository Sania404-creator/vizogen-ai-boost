const BRAND = "#2F80FF";

const wrap = (inner: string) => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f6f7fb;padding:28px;color:#14161F">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e7e9f0">
    <div style="background:linear-gradient(90deg,#2F80FF,#8B2FE0 60%,#E91E8C);padding:20px 26px;color:#ffffff;font-size:20px;font-weight:700">
      Vizogen
    </div>
    <div style="padding:26px">
      ${inner}
    </div>
    <div style="padding:18px 26px;border-top:1px solid #eef0f6;font-size:12px;color:#8a8f9c">
      Vizogen — AI automation for Google Business Profiles<br/>
      info.vizogen@gmail.com · +91 84889 18358 · www.vizogen.in
    </div>
  </div>
</div>`;

export function buildCrmInviteEmail(input: {
  fullName: string;
  email: string;
  password: string;
}) {
  return wrap(`
    <h2 style="margin:0 0 10px;font-size:22px">Welcome to Vizogen CRM, ${input.fullName}</h2>
    <p style="margin:0 0 14px;color:#4a4f5c">Your sales account has been created. Sign in with:</p>
    <table style="font-size:14px;border-collapse:collapse">
      <tr><td style="padding:6px 14px 6px 0;color:#8a8f9c">Email</td><td><b>${input.email}</b></td></tr>
      <tr><td style="padding:6px 14px 6px 0;color:#8a8f9c">Temporary password</td><td><b>${input.password}</b></td></tr>
    </table>
    <p style="margin:20px 0 0">
      <a href="https://crm.vizogen.in/crm/login" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700">Open Vizogen CRM</a>
    </p>
    <p style="margin:18px 0 0;color:#4a4f5c;font-size:13px">Please change your password after your first sign-in.</p>
  `);
}

export function buildProposalEmail(input: {
  clientName: string;
  company: string;
  title: string;
  link: string;
  message: string;
  validUntil: string | null;
}) {
  const body = input.message
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;color:#4a4f5c">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  return wrap(`
    <h2 style="margin:0 0 12px;font-size:22px">${input.title}</h2>
    ${body}
    <p style="margin:22px 0 0">
      <a href="${input.link}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700">View your proposal</a>
    </p>
    ${
      input.validUntil
        ? `<p style="margin:16px 0 0;color:#8a8f9c;font-size:13px">This proposal is valid until ${input.validUntil}.</p>`
        : ""
    }
  `);
}

export function buildFollowUpReminderEmail(input: { repName: string; leads: string[] }) {
  return wrap(`
    <h2 style="margin:0 0 10px;font-size:22px">Follow-ups due today</h2>
    <p style="margin:0 0 14px;color:#4a4f5c">Hi ${input.repName}, these leads need a touch today:</p>
    <ul style="margin:0 0 16px;padding-left:18px;color:#14161F;font-size:14px">
      ${input.leads.map((l) => `<li style="margin:4px 0">${l}</li>`).join("")}
    </ul>
    <p style="margin:0">
      <a href="https://crm.vizogen.in/crm/leads" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700">Open your pipeline</a>
    </p>
  `);
}

const esc = (s: string) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function buildInvoiceEmail(input: {
  invoiceNumber: string;
  clientName: string;
  company: string;
  signerName: string;
  title: string;
  currency: string;
  lines: { item: string; qty: number; price: number }[];
  acceptedAt: string;
  link: string;
}) {
  const sym = input.currency === "USD" ? "$" : "₹";
  const fmt = (n: number) => sym + n.toLocaleString("en-IN");
  const total = input.lines.reduce((s, l) => s + l.qty * l.price, 0);
  const rows = input.lines
    .map(
      (l) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eef0f6">${esc(l.item)}</td><td style="padding:8px;border-bottom:1px solid #eef0f6;text-align:center">${l.qty}</td><td style="padding:8px;border-bottom:1px solid #eef0f6;text-align:right">${fmt(l.price)}</td><td style="padding:8px;border-bottom:1px solid #eef0f6;text-align:right">${fmt(l.qty * l.price)}</td></tr>`,
    )
    .join("");
  const date = new Date(input.acceptedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  return wrap(`
    <h2 style="margin:0 0 6px;font-size:22px">Your bill · ${esc(input.invoiceNumber)}</h2>
    <p style="margin:0 0 14px;color:#4a4f5c">Hi ${esc(input.clientName)}, thank you for accepting <b>${esc(input.title)}</b>. Here is your bill.</p>
    <table style="font-size:13px;color:#4a4f5c;margin-bottom:14px">
      <tr><td style="padding:3px 14px 3px 0">Billed to</td><td><b>${esc(input.company || input.clientName)}</b></td></tr>
      <tr><td style="padding:3px 14px 3px 0">Billed by</td><td>Vizogen / NG Marketing Solution, Rajkot, Gujarat</td></tr>
      <tr><td style="padding:3px 14px 3px 0">Accepted &amp; e-signed</td><td>${esc(input.signerName)} · ${date} IST</td></tr>
    </table>
    <table style="width:100%;font-size:14px;border-collapse:collapse">
      <tr style="background:#f6f7fb;text-align:left"><th style="padding:8px">Item</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Price</th><th style="padding:8px;text-align:right">Amount</th></tr>
      ${rows}
      <tr><td colspan="3" style="padding:10px 8px;font-weight:700">Total payable</td><td style="padding:10px 8px;text-align:right;font-weight:700">${fmt(total)}</td></tr>
    </table>
    <p style="margin:16px 0 0;font-size:13px;color:#4a4f5c">You agreed to the Vizogen Terms &amp; Conditions (www.vizogen.in/terms-and-conditions). All payments are non-refundable.</p>
    <p style="margin:18px 0 0"><a href="${input.link}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700">View signed proposal</a></p>
  `);
}
