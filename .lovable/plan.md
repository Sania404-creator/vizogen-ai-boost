# CRM mein "Create Billing" option

Abhi bill sirf proposal bhejne ke baad banta hai. Ab seedha bill banane ka alag option hoga.

## Kya banega
- **Proposals page** par aur **Lead detail page** par naya button: **"+ Create Billing"**.
- Button dabane par chhota form khulega:
  - Lead select (lead page se khola toh pehle se bhara)
  - Client naam, company, email, phone
  - Items: naam + quantity + rate (add/remove rows), total apne aap
  - Notes (optional), valid till date
- Do button: **"Save as Draft"** aur **"Create & Send"**.
- "Create & Send" par: bill number apne aap (same series jaisa abhi), customer ko mail mein bill PDF + sign link, WhatsApp share option bhi.
- Customer ka flow same rahega: naam + sign → UPI QR (9586387958@kotakbank, exact amount) → signed bill PDF mail mein.
- Proposals list mein ye bills **"Direct Bill"** tag ke saath dikhenge, aur filter: All / Proposals / Direct Bills.
- GST nahi, terms checkbox nahi — jaise abhi hai.

## Technical details
- Existing `crm_proposals` table hi use hogi (naya column `kind` = 'proposal' | 'billing', default 'proposal') taaki billing page, PDF, sign, lock, timeline sab reuse ho.
- New server function `createDirectBilling` (requireSupabaseAuth, crm member check) — insert + `crm_next_billing_number` + optional send via existing `sendProposal` email/PDF path.
- New component `create-billing-dialog.tsx`; React Query invalidation for proposals, lead, sales dashboard.
- Sales dashboard revenue mein direct bills bhi count honge (confirmed hone par).
