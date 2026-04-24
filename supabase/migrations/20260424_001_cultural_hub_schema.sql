-- ============================================================
-- Cultural Hub: schema
-- Run in Supabase SQL editor
-- 2026-04-24
-- ============================================================

-- festivals master list
create table festivals (
  id                 bigserial primary key,
  slug               text unique not null,
  name_en            text not null,
  name_ml            text not null,
  category           text check (category in ('hindu','christian','muslim','cultural','national')),
  is_gold_buying_day boolean not null default false,
  description_en     text,
  description_ml     text
);

-- one row per year per festival
create table festival_dates (
  id            bigserial primary key,
  festival_id   bigint not null references festivals(id) on delete cascade,
  date          date not null,
  muhurat_start timestamptz,
  muhurat_end   timestamptz,
  notes         text,
  source_url    text,
  unique (festival_id, date)
);

-- ornament encyclopaedia
-- name_ml nullable: set null where Malayalam script unverified; fill after editor review
create table ornaments (
  id                       bigserial primary key,
  slug                     text unique not null,
  name_en                  text not null,
  name_ml                  text,
  transliteration          text,
  community_tags           text[],
  typical_weight_pavan_min numeric(5,2),
  typical_weight_pavan_max numeric(5,2),
  description_en           text,
  description_ml           text,
  symbolism_en             text,
  symbolism_ml             text,
  image_url                text,
  image_credit             text
);

-- temple directory
create table temples (
  id                  bigserial primary key,
  slug                text unique not null,
  name_en             text,
  name_ml             text,
  district            text,
  lat                 numeric(9,6),
  lng                 numeric(9,6),
  deity               text,
  primary_festival_id bigint references festivals(id),
  description_en      text,
  description_ml      text
);

-- wedding budget calculator presets (per community)
create table wedding_ornament_defaults (
  community     text not null check (community in (
    'nair', 'namboothiri', 'ezhava',
    'syrian-christian', 'latin-catholic', 'marthoma',
    'mappila-muslim', 'sunni-muslim'
  )),
  ornament_id   bigint not null references ornaments(id) on delete cascade,
  default_pavan numeric(5,2),
  is_required   boolean not null default false,
  notes         text,
  primary key (community, ornament_id)
);

-- every cultural claim must trace here before publishing
create table content_sources (
  id            bigserial primary key,
  page_slug     text not null,
  claim         text,
  source_url    text,
  source_name   text,
  retrieved_on  date,
  reviewer_name text
);

-- indexes
create index idx_festival_dates_festival_id on festival_dates(festival_id);
create index idx_festival_dates_date        on festival_dates(date);
create index idx_ornaments_community_tags   on ornaments using gin(community_tags);
create index idx_temples_district           on temples(district);
create index idx_content_sources_page_slug  on content_sources(page_slug);

-- festival × rate overlay view (used by FestivalRateOverlay chart component)
create or replace view festival_rate_history as
select
  f.slug,
  f.name_en,
  f.is_gold_buying_day,
  fd.date,
  fd.muhurat_start,
  fd.muhurat_end,
  dr.rate_22k_1g,
  dr.rate_24k_1g
from festival_dates fd
join  festivals          f  on f.id  = fd.festival_id
left join daily_gold_rates dr on dr.date = fd.date and dr.city = 'Kochi'
order by fd.date desc;
