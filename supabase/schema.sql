create table if not exists public.crm_records (
  id text primary key,
  kind text not null check (kind in ('leads', 'quotes')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.crm_records enable row level security;

create policy "service role full access"
  on public.crm_records
  for all
  to service_role
  using (true)
  with check (true);
