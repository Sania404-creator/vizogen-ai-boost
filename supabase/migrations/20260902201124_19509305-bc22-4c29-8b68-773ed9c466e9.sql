-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- businesses
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Local business',
  city TEXT NOT NULL DEFAULT '',
  brand_tone TEXT NOT NULL DEFAULT 'friendly',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  website TEXT,
  phone TEXT,
  posting_frequency TEXT NOT NULL DEFAULT 'weekly',
  google_account_id TEXT,
  google_location_id TEXT,
  google_location_name TEXT,
  review_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX businesses_owner_idx ON public.businesses(owner_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "businesses_own" ON public.businesses FOR ALL TO authenticated
USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE TRIGGER businesses_touch BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- google connections
CREATE TABLE public.google_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL UNIQUE,
  google_email TEXT,
  refresh_token TEXT,
  access_token TEXT,
  access_token_expires_at TIMESTAMPTZ,
  scopes TEXT,
  status TEXT NOT NULL DEFAULT 'connected',
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.google_connections TO authenticated;
GRANT ALL ON public.google_connections TO service_role;
ALTER TABLE public.google_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "google_connections_select_own" ON public.google_connections FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "google_connections_delete_own" ON public.google_connections FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE TRIGGER google_connections_touch BEFORE UPDATE ON public.google_connections
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  post_type TEXT NOT NULL DEFAULT 'update',
  headline TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  cta_label TEXT,
  cta_url TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  google_post_name TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX posts_owner_idx ON public.posts(owner_id);
CREATE INDEX posts_due_idx ON public.posts(status, scheduled_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_own" ON public.posts FOR ALL TO authenticated
USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE TRIGGER posts_touch BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  google_review_id TEXT,
  reviewer_name TEXT NOT NULL DEFAULT 'Google user',
  reviewer_photo TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reply_text TEXT,
  reply_status TEXT NOT NULL DEFAULT 'pending',
  replied_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX reviews_google_unique ON public.reviews(business_id, google_review_id) WHERE google_review_id IS NOT NULL;
CREATE INDEX reviews_owner_idx ON public.reviews(owner_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_own" ON public.reviews FOR ALL TO authenticated
USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE TRIGGER reviews_touch BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- qr codes
CREATE TABLE public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT 'How was your experience?',
  review_link TEXT,
  business_name TEXT NOT NULL DEFAULT '',
  scans INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX qr_codes_owner_idx ON public.qr_codes(owner_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.qr_codes TO authenticated;
GRANT SELECT ON public.qr_codes TO anon;
GRANT ALL ON public.qr_codes TO service_role;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qr_codes_own" ON public.qr_codes FOR ALL TO authenticated
USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "qr_codes_public_read" ON public.qr_codes FOR SELECT TO anon USING (active = true);
CREATE TRIGGER qr_codes_touch BEFORE UPDATE ON public.qr_codes
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- qr feedback
CREATE TABLE public.qr_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_id UUID NOT NULL REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  comment TEXT,
  customer_name TEXT,
  customer_contact TEXT,
  routed_to_google BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX qr_feedback_owner_idx ON public.qr_feedback(owner_id);
GRANT SELECT, DELETE ON public.qr_feedback TO authenticated;
GRANT ALL ON public.qr_feedback TO service_role;
ALTER TABLE public.qr_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qr_feedback_select_own" ON public.qr_feedback FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "qr_feedback_delete_own" ON public.qr_feedback FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- public helpers for the anonymous feedback page
CREATE OR REPLACE FUNCTION public.register_qr_scan(_slug TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.qr_codes SET scans = scans + 1 WHERE slug = _slug AND active = true;
$$;
GRANT EXECUTE ON FUNCTION public.register_qr_scan(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_qr_feedback(
  _slug TEXT,
  _rating INTEGER,
  _comment TEXT DEFAULT NULL,
  _customer_name TEXT DEFAULT NULL,
  _customer_contact TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  qr public.qr_codes;
BEGIN
  IF _rating < 1 OR _rating > 5 THEN
    RAISE EXCEPTION 'Invalid rating';
  END IF;
  SELECT * INTO qr FROM public.qr_codes WHERE slug = _slug AND active = true;
  IF qr.id IS NULL THEN
    RAISE EXCEPTION 'Unknown QR code';
  END IF;
  INSERT INTO public.qr_feedback (qr_id, owner_id, business_id, rating, comment, customer_name, customer_contact, routed_to_google)
  VALUES (qr.id, qr.owner_id, qr.business_id, _rating, NULLIF(left(coalesce(_comment,''), 1500), ''), NULLIF(left(coalesce(_customer_name,''), 120), ''), NULLIF(left(coalesce(_customer_contact,''), 160), ''), _rating >= 4);
END;
$$;
GRANT EXECUTE ON FUNCTION public.submit_qr_feedback(TEXT, INTEGER, TEXT, TEXT, TEXT) TO anon, authenticated;