CREATE TABLE public.gbp_audits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL,
  business_id uuid REFERENCES public.businesses(id) ON DELETE SET NULL,
  business_name text NOT NULL,
  city text NOT NULL,
  category text NOT NULL,
  website text,
  score integer NOT NULL DEFAULT 0,
  grade text NOT NULL DEFAULT 'C',
  summary text NOT NULL DEFAULT '',
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  quick_wins jsonb NOT NULL DEFAULT '[]'::jsonb,
  action_plan jsonb NOT NULL DEFAULT '[]'::jsonb,
  keywords text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gbp_audits TO authenticated;
GRANT ALL ON public.gbp_audits TO service_role;

ALTER TABLE public.gbp_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gbp_audits_own" ON public.gbp_audits
  FOR ALL TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE TRIGGER gbp_audits_touch BEFORE UPDATE ON public.gbp_audits
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX gbp_audits_owner_created_idx ON public.gbp_audits (owner_id, created_at DESC);