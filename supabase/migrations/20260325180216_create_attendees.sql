create table if not exists attendees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  graduation_date text,
  days_attending text[] not null default '{}',
  willing_to_pay text not null default 'no',
  willing_to_pay_other text,
  dietary_restrictions text[] not null default '{}',
  dietary_other text,
  plus_one boolean not null default false,
  plus_one_count int default 0,
  plus_one_names text,
  wants_to_sponsor boolean not null default false,
  sponsorship_interest text,
  donation_amount text,
  anything_else text,
  session_token text unique not null,
  referral_code text unique not null,
  referred_by text,
  profile_pic_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_attendees_session_token on attendees (session_token);
create index if not exists idx_attendees_referral_code on attendees (referral_code);

