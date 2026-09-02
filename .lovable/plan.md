# Build the real Vizogen product

Turn the marketing site into a working app: visitors sign up, connect their real Google Business Profile, and use AI post generation + scheduling, review replies, and Magic QR from a dashboard.

## What visitors will get

1. **Sign up / sign in** at `/auth` — email + password, plus Google sign-in.
2. **Onboarding** — create a workspace: business name, category, city, brand tone, keywords.
3. **Connect Google Business Profile** — a "Connect Google" button that runs a real Google OAuth consent flow, then lists the user's GBP locations so they pick which one Vizogen manages.
4. **Dashboard** (`/dashboard`) — overview of connected location, posts published, scheduled queue, reviews awaiting reply, QR scans.
5. **Posts** (`/dashboard/posts`) — AI generates GBP-ready post copy (offer / update / event) from the brand profile, editable, save as draft, schedule a date/time, publish to Google. Calendar + list view with status badges (draft / scheduled / published / failed).
6. **Reviews** (`/dashboard/reviews`) — pulls reviews from the connected location, AI drafts a reply in the brand tone, user edits and posts the reply back to Google. Filters by rating and replied state.
7. **Magic QR** (`/dashboard/magic-qr`) — generates a branded QR + short link per location pointing at a public feedback page. Happy customers (4-5 stars) are routed to the Google review link; unhappy feedback is captured privately for the owner. Scan and outcome counts tracked.
8. **Settings** — brand tone, posting frequency, Google connection status, disconnect.

Marketing pages stay exactly as they are; "Start Free Trial" CTAs will point at the new in-app `/auth` instead of the external login.

## Important: Google approval is required

Real posting and review replies use the **Google Business Profile APIs**, which Google gates behind an application review. So the build lands in two stages:

- **Stage A (this build):** full product, real Google OAuth sign-in and connection flow, real API calls written against Google's endpoints. Until Google grants your project access, the connect step will return an access error and the app falls back to a clearly labelled "not connected yet" state — posts and replies are still generated and stored, just queued instead of published.
- **Stage B (after approval):** nothing to rebuild — once your Google Cloud project has Business Profile API access, the same flow starts publishing for real.

To wire this up I need from you a Google Cloud OAuth client (Client ID + Client Secret) with the Business Profile scope and redirect URI `https://www.vizogen.in/api/public/google/callback`. I'll ask for those as secrets when we start, and I'll tell you exactly which APIs to request access for.

## Technical plan

**Data (Lovable Cloud / Postgres, RLS on every table, GRANTs included)**
- `profiles` — user row created by trigger on signup.
- `businesses` — owner_id, name, category, city, brand_tone, keywords, google_location_id, google_account_id, review_link.
- `google_connections` — owner_id, encrypted refresh token, access token + expiry, granted scopes, status.
- `posts` — business_id, type, headline, body, cta, cta_url, image_url, status, scheduled_at, published_at, google_post_name, error.
- `reviews` — business_id, google_review_id, reviewer, rating, comment, created_at, reply_text, reply_status.
- `qr_codes` — business_id, slug (public), title, scans; `qr_feedback` — qr_id, rating, comment, routed_to_google.
- Public read policy limited to `qr_codes` by slug; everything else scoped to `auth.uid()`.

**Auth**
- Email+password and Google sign-in via `lovable.auth.signInWithOAuth("google", ...)`, provider configured with `supabase--configure_social_auth`; `/auth` is public, app lives under `src/routes/_authenticated/`.

**Google Business Profile integration**
- `/api/public/google/callback` server route completes the GBP OAuth code exchange (separate from sign-in), stores tokens server-side.
- `src/lib/gbp.server.ts` — token refresh, `accounts.locations` list, `localPosts.create`, `reviews.list`, `reviews.updateReply`; all errors normalized so the UI can show "awaiting Google approval" distinctly from real failures.
- `src/lib/*.functions.ts` server functions with `requireSupabaseAuth` for every dashboard read/write.

**AI**
- Lovable AI Gateway (existing `LOVABLE_API_KEY` pattern from `chat.functions.ts`): post copy generation, review-reply drafting, plus image generation for post visuals.

**Scheduling**
- `/api/public/cron/publish-due` route (secret-verified) publishes due posts and syncs new reviews; scheduled with pg_cron.

**UI**
- Dashboard shell with sidebar, reusing the existing gradient/rounded-2xl design system and shadcn components. All dashboard routes `noindex`.

## Suggested build order

1. Auth + `_authenticated` shell + database schema
2. Onboarding + business profile + Google connect flow
3. Posts (AI generation, scheduling, publish)
4. Reviews (sync, AI replies)
5. Magic QR + public feedback page
6. Cron publisher + settings polish
