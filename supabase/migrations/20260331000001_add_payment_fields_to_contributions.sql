alter table contributions
  add column if not exists payment_method text,
  add column if not exists confirmation_url text;

insert into storage.buckets (id, name, public)
values ('payment-confirmations', 'payment-confirmations', false)
on conflict (id) do nothing;
