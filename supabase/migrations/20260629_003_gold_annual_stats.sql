-- Annual 22K gold-rate aggregates for the "Kerala Gold Price Trends" data study
-- (/kerala-gold-price-trends). Aggregated in the database so the page isn't
-- capped by PostgREST's default 1,000-row response limit when summarising the
-- full multi-year series.
--
-- has_real = does the year contain at least one actual AKGSMA board-rate row
-- (vs. the estimated `backfill-yahoo-calibrated` history)? Used to label which
-- figures are observed vs. modelled, for transparency on the study page.

create or replace function public.kerala_gold_annual_stats()
returns table (
  yr integer,
  avg_22k numeric,
  low_22k numeric,
  high_22k numeric,
  n bigint,
  has_real boolean
)
language sql
stable
as $$
  select
    extract(year from date)::int as yr,
    round(avg(rate_22k_1g))      as avg_22k,
    min(rate_22k_1g)             as low_22k,
    max(rate_22k_1g)             as high_22k,
    count(*)                     as n,
    bool_or(consensus_sources is distinct from 'backfill-yahoo-calibrated') as has_real
  from public.daily_gold_rates
  where city = 'Kochi'
  group by 1
  order by 1;
$$;
