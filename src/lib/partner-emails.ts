export type PartnerApplication = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  website?: string;
  program: "Affiliate Partner" | "Prime Plus Partnership" | "White-Labelled Partner";
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

export function buildPartnerApplicantEmail(app: PartnerApplication, referenceCode?: string) {
  const codeBlock = referenceCode
    ? `<div style="margin:0 0 16px;padding:14px 16px;border:1px solid #e6e8ef;border-radius:12px">
        <div style="font-size:12px;color:#8a8f9c">Your application reference</div>
        <div style="font-size:20px;font-weight:700;letter-spacing:1px">${escape(referenceCode)}</div>
        <div style="margin-top:6px;font-size:12px;color:#8a8f9c">
          Track your status anytime at https://www.vizogen.in/partner-application
        </div>
      </div>`
    : "";
  return wrap(`
    <h2 style="margin:18px 0 8px;font-size:22px">Thanks, ${escape(app.fullName)}!</h2>
    <p style="margin:0 0 14px;color:#4a4f5c">
      We've received your application for the <b>${escape(app.program)}</b> program.
    </p>
    ${codeBlock}
    <p style="margin:0 0 14px;color:#4a4f5c">
      Our partnerships team will review your details and reach out within
      <b>2 business days</b> with next steps, commission details and your onboarding link.
    </p>
    <p style="margin:0;color:#4a4f5c">Need us sooner? WhatsApp us on +91 84889 18358.</p>
  `);
}


const PROGRAM_BENEFITS: Record<string, { headline: string; benefits: string[] }> = {
  "Affiliate Partner": {
    headline: "20% recurring commission on every referral",
    benefits: [
      "20% recurring commission on every business you refer",
      "Minimum payout of ₹999, paid in Indian Rupees",
      "No joining fees and no monthly targets",
      "Ready-made creatives and a referral dashboard",
    ],
  },
  "Prime Plus Partnership": {
    headline: "Up to 30% recurring commission across all revenue streams",
    benefits: [
      "Up to 30% recurring commission across all revenue streams",
      "Agency co-branding and a dedicated Partner Growth Manager",
      "Direct inbound client leads forwarded from Vizogen",
      "Exclusive rights in your city",
      "Priority support, faster onboarding and early feature access",
    ],
  },
  "White-Labelled Partner": {
    headline: "Sell Vizogen under your own brand",
    benefits: [
      "Your own custom domain, logo and design",
      "Set your own client pricing and collect payments directly",
      "Vizogen handles hosting, engineering, updates and API stability",
      "Custom commercials based on your client volume",
    ],
  },
};

export function buildPartnerApprovedEmail(args: {
  fullName: string;
  program: string;
  referenceCode: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  portalUrl: string;
}) {
  const program = PROGRAM_BENEFITS[args.program] ?? PROGRAM_BENEFITS["Affiliate Partner"]!;
  const list = program.benefits
    .map(
      (b) =>
        `<li style="margin:0 0 8px;color:#4a4f5c">${escape(b)}</li>`,
    )
    .join("");
  return wrap(`
    <h2 style="margin:18px 0 8px;font-size:22px">You're approved, ${escape(args.fullName)} 🎉</h2>
    <p style="margin:0 0 14px;color:#4a4f5c">
      Welcome to the Vizogen <b>${escape(args.program)}</b> program — ${escape(program.headline)}.
    </p>
    <div style="margin:0 0 16px;padding:14px 16px;border:1px solid #e6e8ef;border-radius:12px">
      <div style="font-size:12px;color:#8a8f9c">Your partner reference</div>
      <div style="font-size:20px;font-weight:700;letter-spacing:1px">${escape(args.referenceCode)}</div>
    </div>
    <h3 style="margin:20px 0 8px;font-size:16px">Your program benefits</h3>
    <ul style="margin:0;padding-left:18px;font-size:14px">${list}</ul>
    <h3 style="margin:22px 0 8px;font-size:16px">Next steps</h3>
    <ol style="margin:0;padding-left:18px;font-size:14px;color:#4a4f5c">
      <li style="margin:0 0 8px">Open your partner portal and create your password using this email address.</li>
      <li style="margin:0 0 8px">Download the Partner Playbook and demo script from the Training tab.</li>
      <li style="margin:0 0 8px">Book your onboarding call with your dedicated manager.</li>
      <li style="margin:0 0 8px">Log every client you close in the portal so your commission is tracked.</li>
    </ol>
    <p style="margin:20px 0 6px;font-size:14px"><b>Your dedicated manager</b></p>
    <p style="margin:0 0 18px;font-size:14px;color:#4a4f5c">
      ${escape(args.managerName)}<br/>
      ${escape(args.managerEmail)} · ${escape(args.managerPhone)}
    </p>
    <p style="margin:0 0 8px">
      <a href="${escape(args.portalUrl)}" style="display:inline-block;background:#2F80FF;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:700;font-size:14px">Open your partner portal</a>
    </p>
    <p style="margin:14px 0 0;font-size:13px;color:#8a8f9c">${escape(args.portalUrl)}</p>
  `);
}

export function buildPartnerRejectedEmail(args: { fullName: string; program: string }) {
  return wrap(`
    <h2 style="margin:18px 0 8px;font-size:22px">Thanks for applying, ${escape(args.fullName)}</h2>
    <p style="margin:0 0 14px;color:#4a4f5c">
      After reviewing your application for the <b>${escape(args.program)}</b> program, we're not able
      to take it forward right now.
    </p>
    <p style="margin:0 0 14px;color:#4a4f5c">
      This isn't a final no — you're welcome to apply again in 3 months, or reply to this email if
      your situation changes sooner.
    </p>
    <p style="margin:0;color:#4a4f5c">Thank you for your interest in Vizogen.</p>
  `);
}
