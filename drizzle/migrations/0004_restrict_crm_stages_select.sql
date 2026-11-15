DROP POLICY IF EXISTS "crm_stages_select" ON public.crm_stages;
CREATE POLICY "crm_stages_select" ON public.crm_stages FOR SELECT TO authenticated USING (public.crm_is_member(auth.uid()));