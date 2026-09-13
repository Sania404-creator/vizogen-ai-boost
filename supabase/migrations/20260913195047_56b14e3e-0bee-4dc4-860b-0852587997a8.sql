ALTER TABLE public.partner_applications
  ADD COLUMN IF NOT EXISTS approval_email_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rejection_email_sent boolean NOT NULL DEFAULT false;

-- Partner accounts
CREATE TABLE public.partner_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.partner_applications(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  program text NOT NULL DEFAULT '',
  manager_name text NOT NULL DEFAULT 'Vizogen Partnerships Desk',
  manager_email text NOT NULL DEFAULT 'info.vizogen@gmail.com',
  manager_phone text NOT NULL DEFAULT '+91 84889 18358',
  exclusive_city text NOT NULL DEFAULT '',
  commission_rate numeric NOT NULL DEFAULT 20,
  min_payout numeric NOT NULL DEFAULT 999,
  active boolean NOT NULL DEFAULT true,
  approved_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (application_id)
);
CREATE UNIQUE INDEX partner_accounts_email_key ON public.partner_accounts (lower(email));

GRANT SELECT ON public.partner_accounts TO authenticated;
GRANT ALL ON public.partner_accounts TO service_role;
ALTER TABLE public.partner_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_accounts_own_select" ON public.partner_accounts
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
CREATE POLICY "partner_accounts_admin_all" ON public.partner_accounts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER partner_accounts_touch BEFORE UPDATE ON public.partner_accounts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Training resources
CREATE TABLE public.partner_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Training',
  resource_type text NOT NULL DEFAULT 'pdf',
  url text NOT NULL,
  programs text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partner_resources TO authenticated;
GRANT ALL ON public.partner_resources TO service_role;
ALTER TABLE public.partner_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_resources_read_active" ON public.partner_resources
  FOR SELECT TO authenticated USING (active);
CREATE POLICY "partner_resources_admin_all" ON public.partner_resources
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER partner_resources_touch BEFORE UPDATE ON public.partner_resources
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Earnings ledger
CREATE TABLE public.partner_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partner_accounts(id) ON DELETE CASCADE,
  period_month date NOT NULL DEFAULT date_trunc('month', now())::date,
  description text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT partner_earnings_status_check CHECK (status IN ('pending','approved','paid'))
);
CREATE INDEX partner_earnings_partner_idx ON public.partner_earnings (partner_id, period_month DESC);

GRANT SELECT ON public.partner_earnings TO authenticated;
GRANT ALL ON public.partner_earnings TO service_role;
ALTER TABLE public.partner_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_earnings_own_select" ON public.partner_earnings
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.partner_accounts a
    WHERE a.id = partner_id
      AND (a.user_id = auth.uid() OR lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  ));
CREATE POLICY "partner_earnings_admin_all" ON public.partner_earnings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER partner_earnings_touch BEFORE UPDATE ON public.partner_earnings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Clients onboarded by partners
CREATE TABLE public.partner_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partner_accounts(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  city text NOT NULL DEFAULT '',
  contact_name text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  plan text NOT NULL DEFAULT 'Starter',
  monthly_value numeric NOT NULL DEFAULT 0,
  started_on date NOT NULL DEFAULT current_date,
  status text NOT NULL DEFAULT 'trial',
  confirmation text NOT NULL DEFAULT 'pending',
  admin_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT partner_clients_status_check CHECK (status IN ('trial','active','churned')),
  CONSTRAINT partner_clients_confirmation_check CHECK (confirmation IN ('pending','confirmed','rejected'))
);
CREATE INDEX partner_clients_partner_idx ON public.partner_clients (partner_id, created_at DESC);

GRANT SELECT, INSERT ON public.partner_clients TO authenticated;
GRANT ALL ON public.partner_clients TO service_role;
ALTER TABLE public.partner_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_clients_own_select" ON public.partner_clients
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.partner_accounts a
    WHERE a.id = partner_id
      AND (a.user_id = auth.uid() OR lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  ));
CREATE POLICY "partner_clients_own_insert" ON public.partner_clients
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.partner_accounts a
    WHERE a.id = partner_id AND a.active
      AND (a.user_id = auth.uid() OR lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  ));
CREATE POLICY "partner_clients_admin_all" ON public.partner_clients
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER partner_clients_touch BEFORE UPDATE ON public.partner_clients
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.partner_resources (title, description, category, resource_type, url, sort_order) VALUES
  ('Vizogen Partner Playbook', 'Positioning, pricing and objection handling for GMB automation deals.', 'Onboarding', 'pdf', 'https://www.vizogen.in/partner', 1),
  ('Demo Script & Walkthrough', 'Step-by-step script to run a 12-minute Vizogen demo that closes.', 'Sales', 'pdf', 'https://www.vizogen.in/demo', 2),
  ('GMB Audit Cheat Sheet', 'Run a free audit for prospects and turn findings into a proposal.', 'Sales', 'pdf', 'https://www.vizogen.in/services/local-seo', 3),
  ('Magic QR Field Guide', 'How to pitch and deploy Magic QR review collection at client locations.', 'Product', 'pdf', 'https://www.vizogen.in/features/magic-qr', 4),
  ('Commission & Payout Policy', 'Commission tiers, payout cycles, minimum payout and invoicing rules.', 'Policy', 'pdf', 'https://www.vizogen.in/terms-and-conditions', 5);