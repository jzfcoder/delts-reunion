create table if not exists contributions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  amount text not null,
  created_at timestamptz not null default now()
);
