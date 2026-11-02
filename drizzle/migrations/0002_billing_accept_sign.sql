alter table public.crm_proposals
  add column if not exists expires_at timestamptz,
  add column if not exists token_used_at timestamptz,
  add column if not exists billing_number text unique,
  add column if not exists gst_rate numeric not null default 18,
  add column if not exists signer_designation text,
  add column if not exists signed_ip text,
  add column if not exists signed_user_agent text,
  add column if not exists document_hash text,
  add column if not exists signature_path text,
  add column if not exists signed_pdf_path text,
  add column if not exists change_request text,
  add column if not exists change_requested_at timestamptz,
  add column if not exists confirmed_at timestamptz;

create sequence if not exists public.crm_billing_seq start 1001;

create or replace function public.crm_next_billing_number()
returns text language sql security definer set search_path = public as $$
  select 'VZ-' || to_char(now() at time zone 'Asia/Kolkata','YYYY') || '-' || nextval('public.crm_billing_seq');
$$;
revoke all on function public.crm_next_billing_number() from public, anon;
grant execute on function public.crm_next_billing_number() to authenticated, service_role;

-- Signed billings are immutable.
create or replace function public.crm_lock_confirmed_proposal()
returns trigger language plpgsql set search_path = public as $$
begin
  if old.status = 'confirmed' and (
       new.pricing is distinct from old.pricing or new.scope is distinct from old.scope
    or new.deliverables is distinct from old.deliverables or new.terms is distinct from old.terms
    or new.notes is distinct from old.notes or new.title is distinct from old.title
    or new.currency is distinct from old.currency or new.gst_rate is distinct from old.gst_rate
    or new.status is distinct from old.status or new.signature_path is distinct from old.signature_path
    or new.document_hash is distinct from old.document_hash or new.share_token is distinct from old.share_token) then
    raise exception 'This billing is signed and locked. Create a new version instead.';
  end if;
  return new;
end;
$$;
drop trigger if exists crm_lock_confirmed_proposal on public.crm_proposals;
create trigger crm_lock_confirmed_proposal before update on public.crm_proposals
  for each row execute function public.crm_lock_confirmed_proposal();

-- Older one-click accept is replaced by the secure signing flow.
revoke execute on function public.crm_accept_proposal(text,text,text,boolean) from anon, authenticated;