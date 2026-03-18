create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  email_verified_at timestamptz,
  email_verification_token_hash text,
  email_verification_expires_at timestamptz,
  password_reset_token_hash text,
  password_reset_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table users add column if not exists email_verified_at timestamptz;
alter table users add column if not exists email_verification_token_hash text;
alter table users add column if not exists email_verification_expires_at timestamptz;
alter table users add column if not exists password_reset_token_hash text;
alter table users add column if not exists password_reset_expires_at timestamptz;

create table if not exists heartbeats (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  workflow_name text not null,
  expected_frequency_hours integer not null check (expected_frequency_hours >= 1 and expected_frequency_hours <= 168),
  phone_number text,
  polar_checkout_id text unique,
  ping_key text not null unique,
  manage_token text not null unique,
  last_ping_at timestamptz,
  last_alert_sent_at timestamptz,
  status text not null default 'running' check (status in ('running', 'silent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists heartbeats_email_idx on heartbeats (email);
create index if not exists heartbeats_ping_key_idx on heartbeats (ping_key);
create index if not exists heartbeats_manage_token_idx on heartbeats (manage_token);
create index if not exists heartbeats_last_ping_at_idx on heartbeats (last_ping_at);
create index if not exists users_email_idx on users (email);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists heartbeats_set_updated_at on heartbeats;
drop trigger if exists users_set_updated_at on users;

create trigger heartbeats_set_updated_at
before update on heartbeats
for each row
execute function set_updated_at();

create trigger users_set_updated_at
before update on users
for each row
execute function set_updated_at();
