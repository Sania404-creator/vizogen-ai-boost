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
