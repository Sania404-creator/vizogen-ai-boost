ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS agent_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auto_reply_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_reply_min_rating integer NOT NULL DEFAULT 4,
  ADD COLUMN IF NOT EXISTS auto_reply_send boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auto_post_enabled boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS public.agent_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL,
  business_id uuid REFERENCES public.businesses(id) ON DELETE SET NULL,
  trigger text NOT NULL DEFAULT 'manual',
  status text NOT NULL DEFAULT 'ok',
  summary text NOT NULL DEFAULT '',
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.agent_runs TO authenticated;
GRANT ALL ON public.agent_runs TO service_role;

ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_runs_own_read" ON public.agent_runs
  FOR SELECT TO authenticated USING (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS agent_runs_owner_created_idx
  ON public.agent_runs (owner_id, created_at DESC);