CREATE TABLE public.demo_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  business_name text NOT NULL,
  slot_date date NOT NULL,
  slot_time text NOT NULL,
  timezone text NOT NULL DEFAULT 'Asia/Kolkata',
  note text,
  source text NOT NULL DEFAULT 'website',
  admin_email_sent boolean NOT NULL DEFAULT false,
  customer_email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.demo_bookings TO service_role;
ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;
CREATE INDEX demo_bookings_slot_idx ON public.demo_bookings (slot_date, slot_time);