ALTER TABLE public.partner_applications
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS admin_notes text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS reference_code text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_status_check;
ALTER TABLE public.partner_applications
  ADD CONSTRAINT partner_applications_status_check
  CHECK (status IN ('new','reviewing','approved','rejected'));

UPDATE public.partner_applications
   SET reference_code = 'VZP-' || upper(substr(md5(id::text), 1, 6))
 WHERE reference_code IS NULL;

ALTER TABLE public.partner_applications
  ALTER COLUMN reference_code SET DEFAULT 'VZP-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));

UPDATE public.partner_applications SET reference_code = reference_code WHERE false;

CREATE UNIQUE INDEX IF NOT EXISTS partner_applications_reference_code_key
  ON public.partner_applications (reference_code);

DROP TRIGGER IF EXISTS partner_applications_touch ON public.partner_applications;
CREATE TRIGGER partner_applications_touch
  BEFORE UPDATE ON public.partner_applications
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

GRANT ALL ON public.partner_applications TO service_role;