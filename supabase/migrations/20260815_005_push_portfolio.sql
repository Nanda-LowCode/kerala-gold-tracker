-- Portfolio push notifications: extend push_subscriptions with the small amount
-- of state needed to personalise the daily broadcast for /my-gold users.
--
-- Holdings themselves stay in localStorage (no login, no dates or labels ever
-- reach the server). Only the aggregated totals the cron needs to compute a
-- portfolio value live here — and they arrive only when the user explicitly
-- opts in via the toggle on /my-gold. When present, the daily cron sends
-- "your gold is up ₹X today" instead of the generic rate broadcast.

alter table public.push_subscriptions
  add column if not exists portfolio_grams_18k numeric,
  add column if not exists portfolio_grams_22k numeric,
  add column if not exists portfolio_grams_24k numeric,
  -- Sum of what the user paid across priced holdings, in rupees. Null means the
  -- user has holdings but no cost basis, so the notification omits % gain.
  add column if not exists portfolio_cost numeric,
  add column if not exists portfolio_updated_at timestamptz;

-- Existing table already has RLS on with no policies (server-only via service
-- role) — added columns inherit that.
