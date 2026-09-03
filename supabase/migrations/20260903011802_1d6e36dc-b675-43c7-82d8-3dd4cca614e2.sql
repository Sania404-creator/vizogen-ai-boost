create or replace function public.grant_vizogen_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null
     and lower(new.email) = 'info.vizogen@gmail.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;

    insert into public.crm_members (user_id, full_name, email, can_view_all, active)
    values (new.id, 'Vizogen Admin', new.email, true, true)
    on conflict (user_id) do update
      set can_view_all = true, active = true;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_vizogen_admin on auth.users;
create trigger on_auth_user_created_vizogen_admin
after insert on auth.users
for each row execute function public.grant_vizogen_admin();

drop trigger if exists on_auth_user_confirmed_vizogen_admin on auth.users;
create trigger on_auth_user_confirmed_vizogen_admin
after update of email_confirmed_at on auth.users
for each row
when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
execute function public.grant_vizogen_admin();

insert into public.user_roles (user_id, role)
select u.id, 'admin'::app_role from auth.users u
where lower(u.email) = 'info.vizogen@gmail.com' and u.email_confirmed_at is not null
on conflict (user_id, role) do nothing;

update public.crm_members m
   set can_view_all = true, active = true
  from auth.users u
 where u.id = m.user_id and lower(u.email) = 'info.vizogen@gmail.com';