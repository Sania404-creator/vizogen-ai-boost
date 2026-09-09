create or replace function public.crm_protect_owner_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _email text;
  _uid uuid;
begin
  _uid := coalesce(old.user_id, new.user_id);
  select lower(u.email) into _email from auth.users u where u.id = _uid;
  if _email = 'info.vizogen@gmail.com' then
    if tg_op = 'DELETE' and old.role = 'admin' then
      raise exception 'The owner account must remain an Admin.';
    end if;
    if tg_op = 'UPDATE' and old.role = 'admin' and new.role <> 'admin' then
      raise exception 'The owner account must remain an Admin.';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists crm_protect_owner_role_del on public.user_roles;
create trigger crm_protect_owner_role_del
before delete on public.user_roles
for each row execute function public.crm_protect_owner_role();

drop trigger if exists crm_protect_owner_role_upd on public.user_roles;
create trigger crm_protect_owner_role_upd
before update on public.user_roles
for each row execute function public.crm_protect_owner_role();

create or replace function public.crm_protect_owner_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _email text;
begin
  select lower(u.email) into _email from auth.users u where u.id = new.user_id;
  if _email = 'info.vizogen@gmail.com' then
    new.active := true;
    new.can_view_all := true;
  end if;
  return new;
end;
$$;

drop trigger if exists crm_protect_owner_member_upd on public.crm_members;
create trigger crm_protect_owner_member_upd
before update on public.crm_members
for each row execute function public.crm_protect_owner_member();

drop trigger if exists crm_protect_owner_member_del on public.crm_members;
create or replace function public.crm_block_owner_member_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _email text;
begin
  select lower(u.email) into _email from auth.users u where u.id = old.user_id;
  if _email = 'info.vizogen@gmail.com' then
    raise exception 'The owner account cannot be removed from the team.';
  end if;
  return old;
end;
$$;
create trigger crm_protect_owner_member_del
before delete on public.crm_members
for each row execute function public.crm_block_owner_member_delete();

-- backfill: ensure the owner has an admin seat now
insert into public.user_roles (user_id, role)
select u.id, 'admin'::app_role from auth.users u
where lower(u.email) = 'info.vizogen@gmail.com'
on conflict (user_id, role) do nothing;

insert into public.crm_members (user_id, full_name, email, can_view_all, active)
select u.id, 'Vizogen Admin', u.email, true, true from auth.users u
where lower(u.email) = 'info.vizogen@gmail.com'
on conflict (user_id) do update set can_view_all = true, active = true;