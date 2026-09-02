-- ROLES ---------------------------------------------------------------
create type public.app_role as enum ('admin', 'sales_rep');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
revoke all on function public.has_role(uuid, public.app_role) from public;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

create policy user_roles_select_self on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy user_roles_admin_write on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- TEAM MEMBERS --------------------------------------------------------
create table public.crm_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  can_view_all boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.crm_members to authenticated;
grant all on public.crm_members to service_role;
alter table public.crm_members enable row level security;
create trigger crm_members_touch before update on public.crm_members
  for each row execute function public.touch_updated_at();

create policy crm_members_select on public.crm_members for select to authenticated using (true);
create policy crm_members_admin_write on public.crm_members for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.crm_can_view_all(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(_user_id, 'admin')
    or exists (select 1 from public.crm_members where user_id = _user_id and can_view_all and active)
$$;
revoke all on function public.crm_can_view_all(uuid) from public;
grant execute on function public.crm_can_view_all(uuid) to authenticated, service_role;

create or replace function public.crm_is_member(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.crm_members where user_id = _user_id and active)
$$;
revoke all on function public.crm_is_member(uuid) from public;
grant execute on function public.crm_is_member(uuid) to authenticated, service_role;

-- STAGES --------------------------------------------------------------
create table public.crm_stages (
  key text primary key,
  label text not null,
  position integer not null default 0,
  kind text not null default 'open',
  created_at timestamptz not null default now()
);
grant select on public.crm_stages to authenticated;
grant all on public.crm_stages to service_role;
alter table public.crm_stages enable row level security;
create policy crm_stages_select on public.crm_stages for select to authenticated using (true);
create policy crm_stages_admin_write on public.crm_stages for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.crm_stages (key, label, position, kind) values
  ('new', 'New', 1, 'open'),
  ('contacted', 'Contacted', 2, 'open'),
  ('demo_scheduled', 'Demo Scheduled', 3, 'open'),
  ('demo_completed', 'Demo Completed', 4, 'open'),
  ('proposal_sent', 'Proposal Sent', 5, 'open'),
  ('negotiation', 'Negotiation', 6, 'open'),
  ('won', 'Won', 7, 'won'),
  ('lost', 'Lost', 8, 'lost');

-- LEADS ---------------------------------------------------------------
create table public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null default '',
  phone text not null default '',
  company text not null default '',
  job_title text,
  source text not null default 'website_demo',
  status text not null default 'new' references public.crm_stages(key) on update cascade,
  assigned_to uuid references auth.users(id) on delete set null,
  requested_demo_at timestamptz,
  requested_demo_label text,
  message text,
  source_page text,
  follow_up_on date,
  tags text[] not null default '{}',
  lost_reason text,
  last_contacted_at timestamptz,
  booking_id uuid references public.demo_bookings(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index crm_leads_status_idx on public.crm_leads (status);
create index crm_leads_assigned_idx on public.crm_leads (assigned_to);
create index crm_leads_follow_up_idx on public.crm_leads (follow_up_on);
create unique index crm_leads_booking_idx on public.crm_leads (booking_id) where booking_id is not null;

grant select, insert, update, delete on public.crm_leads to authenticated;
grant all on public.crm_leads to service_role;
alter table public.crm_leads enable row level security;
create trigger crm_leads_touch before update on public.crm_leads
  for each row execute function public.touch_updated_at();

create policy crm_leads_select on public.crm_leads for select to authenticated
  using (public.crm_can_view_all(auth.uid()) or assigned_to = auth.uid());
create policy crm_leads_insert on public.crm_leads for insert to authenticated
  with check (public.crm_is_member(auth.uid()) or public.has_role(auth.uid(), 'admin'));
create policy crm_leads_update on public.crm_leads for update to authenticated
  using (public.crm_can_view_all(auth.uid()) or assigned_to = auth.uid())
  with check (public.crm_can_view_all(auth.uid()) or assigned_to = auth.uid());
create policy crm_leads_delete on public.crm_leads for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ACTIVITIES ----------------------------------------------------------
create table public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  actor_name text not null default '',
  type text not null default 'note',
  body text not null default '',
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index crm_activities_lead_idx on public.crm_activities (lead_id, created_at desc);
grant select, insert on public.crm_activities to authenticated;
grant all on public.crm_activities to service_role;
alter table public.crm_activities enable row level security;

create policy crm_activities_select on public.crm_activities for select to authenticated
  using (exists (
    select 1 from public.crm_leads l where l.id = lead_id
      and (public.crm_can_view_all(auth.uid()) or l.assigned_to = auth.uid())
  ));
create policy crm_activities_insert on public.crm_activities for insert to authenticated
  with check (exists (
    select 1 from public.crm_leads l where l.id = lead_id
      and (public.crm_can_view_all(auth.uid()) or l.assigned_to = auth.uid())
  ));

-- PROPOSAL TEMPLATES --------------------------------------------------
create table public.crm_proposal_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scope text not null default '',
  deliverables text[] not null default '{}',
  pricing jsonb not null default '[]'::jsonb,
  notes text not null default '',
  terms text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.crm_proposal_templates to authenticated;
grant all on public.crm_proposal_templates to service_role;
alter table public.crm_proposal_templates enable row level security;
create trigger crm_proposal_templates_touch before update on public.crm_proposal_templates
  for each row execute function public.touch_updated_at();
create policy crm_templates_select on public.crm_proposal_templates for select to authenticated
  using (public.crm_is_member(auth.uid()) or public.has_role(auth.uid(), 'admin'));
create policy crm_templates_write on public.crm_proposal_templates for all to authenticated
  using (public.crm_is_member(auth.uid()) or public.has_role(auth.uid(), 'admin'))
  with check (public.crm_is_member(auth.uid()) or public.has_role(auth.uid(), 'admin'));

insert into public.crm_proposal_templates (name, scope, deliverables, pricing, notes, terms) values
  ('GMB Automation Retainer',
   'End-to-end Google Business Profile automation: AI posts, review replies, Magic QR and monthly reporting.',
   array['4-8 AI-written GBP posts per month','AI review replies within 24 hours','Magic QR feedback funnel setup','Monthly ranking and insights report'],
   '[{"item":"Growth plan (quarterly)","qty":1,"price":14999}]'::jsonb,
   'Pricing is per location. Onboarding is completed within 3 working days of confirmation.',
   'All fees are non-refundable. Invoices are payable in advance of each billing cycle.'),
  ('Local SEO Retainer',
   'Local SEO program covering GBP optimisation, citations, on-page SEO and local link building.',
   array['GBP optimisation and weekly posting','20 local citations per month','On-page SEO for 5 priority pages','Monthly rank tracking report'],
   '[{"item":"Local SEO retainer (monthly)","qty":1,"price":19999}]'::jsonb,
   'Minimum engagement of 3 months for measurable ranking movement.',
   'All fees are non-refundable. Invoices are payable in advance of each billing cycle.');

-- PROPOSALS -----------------------------------------------------------
create table public.crm_proposals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  template_id uuid references public.crm_proposal_templates(id) on delete set null,
  title text not null default 'Vizogen Proposal',
  client_name text not null default '',
  client_company text not null default '',
  client_email text not null default '',
  scope text not null default '',
  deliverables text[] not null default '{}',
  pricing jsonb not null default '[]'::jsonb,
  currency text not null default 'INR',
  notes text not null default '',
  terms text not null default '',
  valid_until date,
  status text not null default 'draft',
  version integer not null default 1,
  share_token text not null default replace(gen_random_uuid()::text, '-', ''),
  sent_at timestamptz,
  viewed_at timestamptz,
  decided_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index crm_proposals_token_idx on public.crm_proposals (share_token);
create index crm_proposals_lead_idx on public.crm_proposals (lead_id, created_at desc);
grant select, insert, update, delete on public.crm_proposals to authenticated;
grant all on public.crm_proposals to service_role;
alter table public.crm_proposals enable row level security;
create trigger crm_proposals_touch before update on public.crm_proposals
  for each row execute function public.touch_updated_at();

create policy crm_proposals_select on public.crm_proposals for select to authenticated
  using (exists (
    select 1 from public.crm_leads l where l.id = lead_id
      and (public.crm_can_view_all(auth.uid()) or l.assigned_to = auth.uid())
  ));
create policy crm_proposals_write on public.crm_proposals for all to authenticated
  using (exists (
    select 1 from public.crm_leads l where l.id = lead_id
      and (public.crm_can_view_all(auth.uid()) or l.assigned_to = auth.uid())
  ))
  with check (exists (
    select 1 from public.crm_leads l where l.id = lead_id
      and (public.crm_can_view_all(auth.uid()) or l.assigned_to = auth.uid())
  ));

-- public proposal viewing by share token
create or replace function public.crm_view_proposal(_token text)
returns table (
  title text, client_name text, client_company text, scope text,
  deliverables text[], pricing jsonb, currency text, notes text,
  terms text, valid_until date, status text, sent_at timestamptz
)
language plpgsql security definer set search_path = public as $$
begin
  update public.crm_proposals
     set viewed_at = coalesce(viewed_at, now()),
         status = case when status = 'sent' then 'viewed' else status end
   where share_token = _token and status <> 'draft';

  return query
    select p.title, p.client_name, p.client_company, p.scope, p.deliverables,
           p.pricing, p.currency, p.notes, p.terms, p.valid_until, p.status, p.sent_at
      from public.crm_proposals p
     where p.share_token = _token and p.status <> 'draft';
end;
$$;
revoke all on function public.crm_view_proposal(text) from public;
grant execute on function public.crm_view_proposal(text) to anon, authenticated, service_role;

-- NOTIFICATIONS -------------------------------------------------------
create table public.crm_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'info',
  title text not null,
  body text not null default '',
  lead_id uuid references public.crm_leads(id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index crm_notifications_user_idx on public.crm_notifications (user_id, created_at desc);
grant select, insert, update, delete on public.crm_notifications to authenticated;
grant all on public.crm_notifications to service_role;
alter table public.crm_notifications enable row level security;
create policy crm_notifications_own on public.crm_notifications for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- WEBSITE BOOKING -> LEAD ---------------------------------------------
create or replace function public.crm_lead_from_booking()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.crm_leads (
    name, email, phone, company, source, status, requested_demo_at,
    requested_demo_label, message, source_page, booking_id, created_at
  ) values (
    new.name, new.email, new.phone, new.business_name,
    case when new.source = 'popup' then 'website_popup' else 'website_demo' end,
    'new',
    (new.slot_date::timestamp)::timestamptz,
    new.slot_date::text || ' · ' || new.slot_time,
    new.note, new.source, new.id, new.created_at
  )
  on conflict do nothing;
  return new;
end;
$$;
revoke all on function public.crm_lead_from_booking() from public, anon, authenticated;

create trigger demo_bookings_to_crm after insert on public.demo_bookings
  for each row execute function public.crm_lead_from_booking();

insert into public.crm_leads (
  name, email, phone, company, source, status, requested_demo_at,
  requested_demo_label, message, source_page, booking_id, created_at
)
select b.name, b.email, b.phone, b.business_name,
  case when b.source = 'popup' then 'website_popup' else 'website_demo' end,
  'new',
  (b.slot_date::timestamp)::timestamptz,
  b.slot_date::text || ' · ' || b.slot_time,
  b.note, b.source, b.id, b.created_at
from public.demo_bookings b
on conflict do nothing;