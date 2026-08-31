type Lead = {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  industry: string;
};

const wrap = (inner: string) => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#ffffff;padding:24px;color:#14161F">
  <div style="max-width:560px;margin:0 auto">
    <div style="font-size:20px;font-weight:700;color:#14161F">Vizogen</div>
    ${inner}
    <p style="margin-top:28px;font-size:12px;color:#8a8f9c">
      Vizogen — AI automation for Google Business Profiles<br/>
      info.bizzdigitalschool@gmail.com · +91 84889 18358
    </p>
  </div>
</div>`;

export function buildLeadAdminEmail(lead: Lead) {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:8px 0;color:#8a8f9c">${k}</td><td style="padding:8px 0"><b>${v}</b></td></tr>`;
  return wrap(`
    <h2 style="margin:18px 0 8px;font-size:22px">New free demo request</h2>
    <p style="margin:0 0 16px;color:#4a4f5c">A visitor requested a free demo from the website popup.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${row("Name", lead.name)}
      ${row("Business", lead.businessName)}
      ${row("Industry", lead.industry)}
      ${row("Phone", lead.phone)}
      ${row("Email", lead.email)}
    </table>
    <p style="margin-top:20px;font-size:14px;color:#4a4f5c">Follow up within 24 hours.</p>
  `);
}

export function buildLeadCustomerEmail(lead: Lead) {
  return wrap(`
    <h2 style="margin:18px 0 8px;font-size:22px">Thanks, ${lead.name}!</h2>
    <p style="margin:0 0 14px;color:#4a4f5c">
      We've received your free demo request for <b>${lead.businessName}</b> and our team
      will contact you within 24 hours.
    </p>
    <p style="margin:0 0 14px;color:#4a4f5c">
      In your demo we'll review your Google Business Profile live, share a free ranking
      audit and show how Vizogen automates posts, reviews and replies for you.
    </p>
    <p style="margin:0;color:#4a4f5c">Need us sooner? WhatsApp us on +91 84889 18358.</p>
  `);
}
