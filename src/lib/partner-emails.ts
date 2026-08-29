export type PartnerApplication = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  website?: string;
  program: "Affiliate Partner" | "Prime Plus Partnership";
  businessCount: string;
  about?: string;
};

const wrap = (inner: string) => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#ffffff;padding:24px;color:#14161F">
  <div style="max-width:560px;margin:0 auto">
    <div style="font-size:20px;font-weight:700;color:#14161F">Vizogen</div>
    ${inner}
    <p style="margin-top:28px;font-size:12px;color:#8a8f9c">
      Vizogen — AI automation for Google Business Profiles<br/>
      info.vizogen@gmail.com · +91 84889 18358
    </p>
  </div>
</div>`;

const escape = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function buildPartnerAdminEmail(app: PartnerApplication) {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:8px 0;color:#8a8f9c;vertical-align:top">${k}</td><td style="padding:8px 0"><b>${escape(
      v,
    )}</b></td></tr>`;
  return wrap(`
    <h2 style="margin:18px 0 8px;font-size:22px">New partner application</h2>
    <p style="margin:0 0 16px;color:#4a4f5c">Submitted from the Vizogen partner page.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${row("Full name", app.fullName)}
      ${row("Email", app.email)}
      ${row("Phone", app.phone)}
      ${row("Agency / Business", app.businessName)}
      ${row("Website / Social", app.website || "—")}
      ${row("Program", app.program)}
      ${row("Businesses worked with", app.businessCount)}
      ${row("About", app.about || "—")}
    </table>
    <p style="margin-top:20px;font-size:14px;color:#4a4f5c">Review and respond within 2 business days.</p>
  `);
}

export function buildPartnerApplicantEmail(app: PartnerApplication) {
  return wrap(`
    <h2 style="margin:18px 0 8px;font-size:22px">Thanks, ${escape(app.fullName)}!</h2>
    <p style="margin:0 0 14px;color:#4a4f5c">
      We've received your application for the <b>${escape(app.program)}</b> program.
    </p>
    <p style="margin:0 0 14px;color:#4a4f5c">
      Our partnerships team will review your details and reach out within
      <b>2 business days</b> with next steps, commission details and your onboarding link.
    </p>
    <p style="margin:0;color:#4a4f5c">Need us sooner? WhatsApp us on +91 84889 18358.</p>
  `);
}
