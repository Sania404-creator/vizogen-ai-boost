drop function if exists public.crm_view_proposal(text);

create function public.crm_view_proposal(_token text)
returns table(title text, client_name text, client_company text, scope text, deliverables text[], pricing jsonb, currency text, notes text, terms text, valid_until date, status text, sent_at timestamp with time zone, version integer, created_at timestamp with time zone)
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  update public.crm_proposals p
     set viewed_at = coalesce(p.viewed_at, now()),
         status = case when p.status = 'sent' then 'viewed' else p.status end
   where p.share_token = _token and p.status <> 'draft';

  return query
    select p.title, p.client_name, p.client_company, p.scope, p.deliverables,
           p.pricing, p.currency, p.notes, p.terms, p.valid_until, p.status, p.sent_at,
           p.version, p.created_at
      from public.crm_proposals p
     where p.share_token = _token and p.status <> 'draft';
end;
$function$;

grant execute on function public.crm_view_proposal(text) to anon, authenticated, service_role;