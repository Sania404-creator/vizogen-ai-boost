alter table public.crm_proposals
  add column if not exists signer_name text,
  add column if not exists signature_data text,
  add column if not exists terms_agreed_at timestamptz,
  add column if not exists accepted_at timestamptz,
  add column if not exists invoice_number text unique,
  add column if not exists invoice_sent_at timestamptz;

create sequence if not exists public.crm_invoice_seq start 1001;

drop function if exists public.crm_view_proposal(text);
create function public.crm_view_proposal(_token text)
returns table(title text, client_name text, client_company text, scope text, deliverables text[], pricing jsonb, currency text, notes text, terms text, valid_until date, status text, sent_at timestamptz, version integer, created_at timestamptz, signer_name text, accepted_at timestamptz, invoice_number text)
language plpgsql security definer set search_path to 'public'
as $$
begin
  update public.crm_proposals p
     set viewed_at = coalesce(p.viewed_at, now()),
         status = case when p.status = 'sent' then 'viewed' else p.status end
   where p.share_token = _token and p.status <> 'draft';
  return query
    select p.title, p.client_name, p.client_company, p.scope, p.deliverables, p.pricing, p.currency,
           p.notes, p.terms, p.valid_until, p.status, p.sent_at, p.version, p.created_at,
           p.signer_name, p.accepted_at, p.invoice_number
      from public.crm_proposals p
     where p.share_token = _token and p.status <> 'draft';
end;
$$;
grant execute on function public.crm_view_proposal(text) to anon, authenticated, service_role;

create or replace function public.crm_accept_proposal(_token text, _signer_name text, _signature text, _agreed boolean)
returns table(proposal_id uuid, invoice_number text, already boolean)
language plpgsql security definer set search_path to 'public'
as $$
declare r public.crm_proposals%rowtype; inv text;
begin
  if not coalesce(_agreed,false) then raise exception 'You must agree to the Terms & Conditions.'; end if;
  if length(trim(coalesce(_signer_name,''))) < 2 or length(_signer_name) > 120 then raise exception 'Please enter your full name.'; end if;
  if _signature is null or _signature not like 'data:image/png;base64,%' or length(_signature) > 400000 then raise exception 'Please add your signature.'; end if;
  select * into r from public.crm_proposals where share_token = _token and status <> 'draft' for update;
  if not found then raise exception 'Proposal not found.'; end if;
  if r.status = 'accepted' then return query select r.id, r.invoice_number, true; return; end if;
  if r.status = 'rejected' then raise exception 'This proposal is no longer open.'; end if;
  if r.valid_until is not null and r.valid_until < current_date then raise exception 'This proposal has expired. Please ask for a fresh one.'; end if;
  inv := 'VZ-INV-' || to_char(now() at time zone 'Asia/Kolkata','YYYY') || '-' || nextval('public.crm_invoice_seq');
  update public.crm_proposals set status='accepted', decided_at=now(), accepted_at=now(), terms_agreed_at=now(),
    signer_name=trim(_signer_name), signature_data=_signature, invoice_number=inv where id = r.id;
  insert into public.crm_activities(lead_id, actor_name, type, body, meta)
    values (r.lead_id, trim(_signer_name), 'proposal_status',
      'Client accepted "' || r.title || '", agreed to T&C and e-signed. Bill ' || inv || ' issued.',
      jsonb_build_object('invoice_number', inv));
  update public.crm_leads set status = 'won' where id = r.lead_id and status <> 'won';
  return query select r.id, inv, false;
end;
$$;
revoke all on function public.crm_accept_proposal(text,text,text,boolean) from public;
grant execute on function public.crm_accept_proposal(text,text,text,boolean) to anon, authenticated, service_role;