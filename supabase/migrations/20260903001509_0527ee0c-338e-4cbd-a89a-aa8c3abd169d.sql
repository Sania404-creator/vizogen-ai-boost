alter table public.posts add column if not exists video_url text;

create or replace function public.qr_review_context(_slug text)
returns table (business_name text, city text, category text, keywords text[])
language sql
stable
security definer
set search_path = public
as $$
  select q.business_name, b.city, b.category, coalesce(b.keywords, '{}')
  from public.qr_codes q
  join public.businesses b on b.id = q.business_id
  where q.slug = _slug and q.active = true
  limit 1
$$;

grant execute on function public.qr_review_context(text) to anon, authenticated, service_role;