export function formatSlot(slotDate: string, slotTime: string) {
  const [y, m, d] = slotDate.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  const label = date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${label} at ${slotTime} IST`;
}

type Booking = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  note?: string;
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

export function buildAdminEmail(booking: Booking, slotLabel: string) {
  return wrap(`
    <h2 style="margin:18px 0 8px;font-size:22px">New demo booked</h2>
    <p style="margin:0 0 16px;color:#4a4f5c">A new Vizogen demo call has been scheduled.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#8a8f9c">Name</td><td style="padding:8px 0"><b>${booking.name}</b></td></tr>
      <tr><td style="padding:8px 0;color:#8a8f9c">Business</td><td style="padding:8px 0"><b>${booking.businessName}</b></td></tr>
      <tr><td style="padding:8px 0;color:#8a8f9c">Email</td><td style="padding:8px 0">${booking.email}</td></tr>
      <tr><td style="padding:8px 0;color:#8a8f9c">Phone</td><td style="padding:8px 0">${booking.phone}</td></tr>
      <tr><td style="padding:8px 0;color:#8a8f9c">Slot</td><td style="padding:8px 0"><b>${slotLabel}</b></td></tr>
      ${booking.note ? `<tr><td style="padding:8px 0;color:#8a8f9c">Note</td><td style="padding:8px 0">${booking.note}</td></tr>` : ""}
    </table>`);
}

export function buildCustomerEmail(booking: Booking, slotLabel: string) {
  return wrap(`
    <h2 style="margin:18px 0 8px;font-size:22px">Your Vizogen demo is confirmed 🎉</h2>
    <p style="margin:0 0 16px;color:#4a4f5c">Hi ${booking.name}, thanks for booking a 30-minute Vizogen demo call.</p>
    <div style="border:1px solid #e6e8ef;border-radius:14px;padding:16px;margin-bottom:16px">
      <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8a8f9c">Your slot</div>
      <div style="font-size:18px;font-weight:700;margin-top:6px">${slotLabel}</div>
    </div>
    <p style="margin:0 0 8px;color:#4a4f5c">On the call we'll walk through your Google Business Profile, show AI post samples for ${booking.businessName}, and map out your local ranking plan.</p>
    <p style="margin:0;color:#4a4f5c">Need to reschedule? Just reply to this email or WhatsApp us at +91 84889 18358.</p>`);
}
