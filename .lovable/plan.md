# Partner program: portal, live status, approval emails, admin review

Some of this already exists (applications are saved with a status, the admin board lists them, and the Partner page already carries titles, descriptions and structured data). This plan fills the real gaps and finishes the rest.

## 1. Live status tracking

- "Track your status" keeps the reference-code + email lookup, but refreshes itself every 20 seconds and on window focus, so a status change made in the admin panel appears without reloading.
- Show a small progress trail (Received → Under review → Approved / Not selected) with the date of the last update.
- Once an application is approved, the result box shows a "Open your partner portal" button.

## 2. Approval confirmation email

- When an application is switched to **Approved** in the admin panel, the applicant automatically receives an email:
  - congratulations + their reference code,
  - the benefits of the exact program they applied for (commission rate, payout minimum, perks),
  - next steps: create a portal password, first training session, dedicated manager name and contact,
  - a direct link to the partner portal.
- The email is sent only once per application, so re-saving the same status will not spam them.
- "Not selected" also gets a short, polite email.

## 3. Partner portal (new)

New signed-in area at `/partner-portal`:

- **Access**: an approved applicant signs in with the email they applied with (email + password, plus Google sign-in). If their email has no approved application, they see a friendly "no approved partnership found" screen instead of the portal.
- **Status card**: program, reference code, approval date, city exclusivity where it applies.
- **Dedicated manager**: name, photo initials, email, phone, WhatsApp button (set per partner from the admin panel; falls back to the Vizogen partnerships desk).
- **Training materials**: list of downloadable resources (PDF/video links) with title, description and category, managed centrally so new material appears for everyone.
- **Earnings**: total earned, pending payout, paid out, minimum-payout progress, and a month-by-month table of commission entries.
- **My clients**: businesses they onboarded — name, city, plan, monthly value, start date, status (trial / active / churned) — with a "Add a client you closed" form that submits for Vizogen confirmation.

## 4. Admin panel

- Extend the existing partner board: search, per-status filter (already there), plus for each application a detail drawer to set the dedicated manager, record commission entries, confirm or reject partner-submitted clients, and see that partner's totals.
- Summary strip: approved partners, clients onboarded, commission owed this month.

## 5. SEO

- Partner page and application page already have titles, descriptions and program structured data. Add one dedicated page per program — `/partner/affiliate-partner`, `/partner/prime-plus-partner`, `/partner/white-labelled-partner` — each with its own title, meta description, H1, benefits, FAQ block, breadcrumbs and program structured data, linked from the Partner page cards and included in the sitemap and the AI-crawler file.

## Technical notes

- New tables: `partner_accounts` (links an approved application to an auth user, manager details, city exclusivity), `partner_resources` (training material catalogue), `partner_earnings` (commission ledger), `partner_clients` (onboarded businesses with confirmation state). RLS: a partner reads only their own rows and inserts client submissions; admins get full access via `has_role`. GRANTs issued in the same migration.
- Portal routes live under the existing authenticated layout; data flows through new `createServerFn` handlers in `src/lib/partner-portal.functions.ts`, gated by `requireSupabaseAuth` plus an approved-application check on the caller's email.
- Approval email built in `src/lib/partner-emails.ts` and sent from `updatePartnerApplication`, guarded by a `approval_email_sent` flag on `partner_applications`.
- Program pages reuse `PARTNER_PROGRAMS` from `src/lib/aeo.ts` so copy and schema stay in one place.
