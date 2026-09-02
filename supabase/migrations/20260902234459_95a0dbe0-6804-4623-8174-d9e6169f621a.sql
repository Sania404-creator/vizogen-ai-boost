DROP POLICY IF EXISTS crm_members_select ON public.crm_members;

CREATE POLICY crm_members_select
ON public.crm_members
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR user_id = auth.uid()
);