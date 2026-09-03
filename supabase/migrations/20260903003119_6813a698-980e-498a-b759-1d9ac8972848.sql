alter table public.businesses
  add column if not exists agent_enabled boolean not null default false,
  add column if not exists auto_reply_enabled boolean not null default false,
  add column if not exists auto_reply_min_rating integer not null default 4,
  add column if not exists auto_reply_send boolean not null default false,
  add column if not exists auto_post_enabled boolean not null default false;

create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  trigger text not null default 'manual',
  status text not null default 'ok',
  summary text not null default '',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists agent_runs_owner_created on public.agent_runs (owner_id, created_at desc);

grant select on public.agent_runs to authenticated;
grant all on public.agent_runs to service_role;

alter table public.agent_runs enable row level security;

drop policy if exists agent_runs_own on public.agent_runs;
create policy agent_runs_own on public.agent_runs
  for select to authenticated
  using (owner_id = auth.uid());