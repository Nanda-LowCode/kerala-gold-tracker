-- Email price alerts: notify a user by email when the 22K Kerala board rate
-- drops to (or below) their target. Complements the existing web-push alerts
-- (push_subscriptions) with a more universal channel. The cron checks these
-- after each rate update and emails matches via Resend, then deletes the fired
-- alert (one-shot). Only the service-role key (admin client) touches this table.

create table if not exists public.email_alerts (
  id          bigint generated always as identity primary key,
  email       text        not null,
  target_rate numeric      not null,
  token       uuid         not null default gen_random_uuid(),
  created_at  timestamptz  not null default now(),
  unique (email)
);

-- RLS on, no public policies → table is private to the service role.
alter table public.email_alerts enable row level security;

create index if not exists email_alerts_target_idx on public.email_alerts (target_rate);
