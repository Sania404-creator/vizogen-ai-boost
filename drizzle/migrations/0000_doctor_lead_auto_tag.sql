create or replace function public.crm_tag_doctor_lead()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  haystack text;
begin
  haystack := lower(coalesce(new.name,'') || ' ' || coalesce(new.company,'') || ' ' || coalesce(new.job_title,''));
  if haystack ~ '(^|[^a-z0-9])(dr|drs|doctor)([^a-z0-9]|$)' then
    if not ('Doctor' = any(coalesce(new.tags, '{}'::text[]))) then
      new.tags := array_append(coalesce(new.tags, '{}'::text[]), 'Doctor');
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists crm_leads_doctor_tag on public.crm_leads;
create trigger crm_leads_doctor_tag
before insert or update of name, company, job_title on public.crm_leads
for each row execute function public.crm_tag_doctor_lead();

update public.crm_leads
set tags = array_append(coalesce(tags, '{}'::text[]), 'Doctor')
where lower(coalesce(name,'') || ' ' || coalesce(company,'') || ' ' || coalesce(job_title,''))
      ~ '(^|[^a-z0-9])(dr|drs|doctor)([^a-z0-9]|$)'
  and not ('Doctor' = any(coalesce(tags, '{}'::text[])));