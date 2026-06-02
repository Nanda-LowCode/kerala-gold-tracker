# Daily Gold News Section — Design

**Date:** 2026-05-13
**Status:** Approved for implementation planning
**Author:** Nandakumar (with Claude)

## Goal

Add an auto-generated daily commentary section that produces one indexable page per date in `daily_gold_rates`. Each page is a ~250-word post built from a deterministic template that reads existing Supabase data. The purpose is to give Google a stream of fresh, unique content to crawl daily without adding new data sources, scrapers, or LLM dependencies.

## Non-Goals

- External news scraping, RSS aggregation, or third-party article republishing
- Per-city daily posts (Kerala has a uniform board rate — duplicate content risk)
- LLM-generated copy (variance, cost, hallucination risk)
- Email digest of daily posts (potential follow-up; out of scope here)
- Author bylines, commenting, social embeds, related-articles ML

## URL Structure

- `/news` — hub page listing the most recent ~30 daily posts with date and headline, plus a link to the full archive
- `/news/[date]` — individual day page, where `[date]` is an ISO date (e.g. `/news/2026-05-13`)

ISO date as slug is unambiguous across years and trivial to generate from DB rows. The natural-language alternative (`/news/kerala-gold-rate-13-may-2026`) reads better but adds slug-collision and parsing concerns for marginal SEO gain.

## Per-Day Page Structure

Each `/news/[date]` page renders:

1. **H1 + date** — e.g. `Kerala Gold Rate on May 13, 2026: 22K at ₹X/g`
2. **Today's prices block** — 22K, 24K, 21K, 18K per gram + per pavan, plus silver per gram
3. **Day-over-day change** — ₹ amount and % vs previous trading day; coloured up/down/flat
4. **Week summary** — 7-day high, low, average, net change
5. **Month context** — vs 30-day average ("today is X% above/below the monthly average")
6. **Commentary paragraphs** — 2–3 short paragraphs built by the template engine
7. **Prev/next nav** — yesterday and tomorrow links (when they exist) for crawl depth
8. **CTA bar** — link to homepage live rate, plus links to calculators

The first 5 items are pure data rendering. Item 6 is where the "writing" happens — see Commentary Engine.

## Commentary Engine

A deterministic template engine in `src/lib/commentary.ts`. Inputs: today's row, the prior 30 rows. Outputs: 2–3 paragraphs of prose.

The engine evaluates a set of conditions for the day:

- **Direction streak** — rising N days, falling N days, flat, mixed
- **Position vs 30-day range** — near high, near low, mid-range, new high, new low
- **Position vs 30-day average** — above/below by X%
- **Pavan-rate threshold crossing** — did 1-pavan cross a ₹1k bucket today?
- **Weekly trend** — net up/down vs 7 days ago
- **NRI context** — favorable AED/USD conversion (out of v1 unless trivial to wire from existing `ExchangeTicker` data; otherwise drop for v1)

For each condition, `commentaryBranches.ts` holds 6–8 phrasing variants. The engine picks a variant deterministically using a hash of the date string, so the same date always renders the same text (idempotent — important because pages are statically generated and may be re-rendered). Consecutive days produce different phrasing.

Variants must be written so any combination reads coherently. Each variant is a one- or two-sentence string with no template holes; paragraphs are assembled by concatenating selected variants in a fixed order.

## Rendering & Build

- Server components throughout. No client-side data fetching for commentary content.
- `generateStaticParams()` in `[date]/page.tsx` returns every distinct date from `daily_gold_rates`.
- ISR revalidation triggered from the existing cron route at `src/app/api/cron/update-rates/route.ts` after it upserts today's rate. It already calls `revalidatePath` for the homepage; we add `revalidatePath('/news')` and `revalidatePath('/news/<today>')`.
- Hub page (`/news`) is statically rendered, revalidated on the same cron trigger.

## SEO Wiring

- **Article + BreadcrumbList JSON-LD** on each daily page, following the pattern in `src/components/DashboardLayout.tsx`.
- **`<title>` and meta description** generated per page with the date and 22K rate: `Kerala Gold Rate on May 13, 2026: 22K at ₹X/g, 24K at ₹Y/g`.
- **Canonical URL** set to the page's own URL — no canonical pointing elsewhere.
- **Sitemap** — append all `/news/[date]` URLs (one query against `daily_gold_rates` for distinct dates) to `src/app/sitemap.ts`.
- **`robots`** — indexable, follow.

## Internal Linking

This is what compounds the SEO value. Three changes:

1. **Homepage** — add a "Daily Market Updates" section showing the 3 most recent `/news/[date]` posts, peer to the existing "From the Blog" section.
2. **Per-day page** — yesterday/tomorrow prev/next links plus a "back to all daily updates" link to `/news`.
3. **Footer** — add a "Daily Updates" link to `/news` in the footer tool grid.

## Files Touched / Added

**Added:**
- `src/app/news/page.tsx` — hub
- `src/app/news/[date]/page.tsx` — per-day
- `src/lib/commentary.ts` — template engine
- `src/lib/commentaryBranches.ts` — phrasing variants

**Modified:**
- `src/app/sitemap.ts` — append `/news/[date]` URLs
- `src/app/api/cron/update-rates/route.ts` — add `revalidatePath` calls for `/news` and today's date
- `src/components/DashboardLayout.tsx` — add "Daily Market Updates" section + footer link

## Data Model

No schema changes. The feature reads only `daily_gold_rates` rows that already exist:
- `date`, `city`, `rate_18k_1g`, `rate_22k_1g`, `rate_24k_1g`, `rate_silver_1g`

Only `city = 'Kochi'` rows are used (Kerala-board representative).

## Testing

- Unit-test the commentary engine: feed synthetic 30-day windows covering each branch condition; assert the right variant family is picked and the output is non-empty.
- Snapshot-test variant determinism: same date + same data → same string.
- A quick local build with backfilled data to confirm `generateStaticParams` produces N pages where N matches DB row count.

## Open Questions Resolved During Brainstorming

| Decision | Choice | Why |
|----------|--------|-----|
| Scope | Kerala-wide only | Uniform board rate makes per-city duplicate content |
| Generation | Pure template | Free, deterministic, no API dep |
| Backfill | All historical days | Maximises day-one indexable surface area |
| URL slug | ISO date | Unambiguous, dedupe-safe |
| Variation | Date-hash variant picker | Idempotent + visibly varied |

## Risks & Mitigations

- **Risk: Google flags posts as thin / templated content.** Mitigation: 6–8 variants per branch, multiple branches combined, unique data per day, ~250 words minimum. If posts get flagged, fall back to LLM-polish hybrid (already designed as an alternative in brainstorming).
- **Risk: Variant strings read awkwardly when combined.** Mitigation: keep each variant a complete sentence with no template holes; assemble by concatenation in a fixed paragraph order; review the first ~10 generated posts manually before deployment.
- **Risk: Static generation slow if backfill grows large.** Mitigation: pagination on the hub page; ISR fallback `'blocking'` so pages beyond the build set are still generated on demand.
