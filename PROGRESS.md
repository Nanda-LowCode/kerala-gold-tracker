# Kerala Gold Tracker — Progress Log

Last updated: 2026-04-07 (post code-review fixes)

## Status Overview

| Phase | Status |
|-------|--------|
| Phase 1: Environment & Database Setup | Complete |
| Phase 2: Automated Backend (Data Pipeline) | Complete |
| Phase 3: Frontend (User Interface) | Complete (Calculators & Ticker added) |
| Phase 4: Deployment & Security | Complete |
| Phase 5: SEO, Growth, & V2 | Complete (Programmatic City SEO, Canonical fixes) |
| Code Review Fixes | Complete |

---

## Phase 1: Environment & Database Setup — Done

- **Next.js 14 project** initialized in `d:\Nanda\Gold rate` with:
  - TypeScript
  - Tailwind CSS v4
  - ESLint
  - App Router
  - `src/` directory structure
- **Supabase client** (`@supabase/supabase-js`) installed
- **Supabase helper** created at [src/lib/supabase.ts](src/lib/supabase.ts) — exports `createSupabaseClient()` using service role key
- **Environment variables** set up in [.env.local](.env.local):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `CRON_SECRET` (generated via `openssl rand -hex 32`)
- **Supabase table** `daily_gold_rates` created manually in Supabase dashboard with:
  - `id`, `date`, `city`, `rate_22k_1g`, `rate_24k_1g`, `consensus_sources`, `created_at`
  - Unique constraint on `(date, city)` to prevent duplicate daily records

---

## Phase 2: Automated Backend — Done

### Cron API Route
**File:** [src/app/api/cron/update-rates/route.ts](src/app/api/cron/update-rates/route.ts)

**What it does:**
1. Verifies `Authorization: Bearer <CRON_SECRET>` header
2. Fetches from Malabar Gold endpoint in two steps:
   - First POST to get session cookie (site returns 302 redirect)
   - Second POST with cookie to get actual JSON
3. Parses rate strings like `"13,835.00 INR"` into integers (`13835`)
4. Upserts today's record into Supabase using IST date (Asia/Kolkata) with `onConflict: "date,city"`

**Tested locally:** Returns live data:
```json
{"success":true,"date":"2026-04-05","rate_22k_1g":13835,"rate_24k_1g":15093}
```

### Vercel Cron Schedule
**File:** [vercel.json](vercel.json)

Runs once daily (Vercel Hobby plan limit):
- 10:30 AM IST

```json
{
  "crons": [
    { "path": "/api/cron/update-rates", "schedule": "0 5 * * *" }
  ]
}
```

---

## Phase 3: Frontend — Done (extended scope)

### Homepage
**File:** [src/app/page.tsx](src/app/page.tsx)

Server component that fetches the last 30 days from Supabase and renders:
- **Date display** — last updated, formatted in en-IN locale
- **Rate cards** — 22K and 24K with purity badges (916/999), per-gram price, and daily change indicator (▲/▼)
- **Per Pavan section** — 8-gram (sovereign) equivalents for both karats
- **Price trend chart** (client component)
- **Historical data table** (client component)
- **FAQ section**
- **Empty state fallback** — shown when DB has no data yet
- ISR revalidation every 60 minutes (`export const revalidate = 3600`), plus instant revalidation via `revalidatePath` after cron updates

### Components

**[src/components/PriceChart.tsx](src/components/PriceChart.tsx)** — client component
- Chart.js line graph via `react-chartjs-2`
- 22K / 24K toggle buttons
- Filled area chart with tooltips showing `₹X/g`
- Shows a message if fewer than 2 days of data exist

**[src/components/HistoryTable.tsx](src/components/HistoryTable.tsx)** — client component
- Filterable time range: 7 / 14 / 30 days
- 22K / 24K toggle
- Columns: Date, Per Gram, Per Pavan (8g), Change
- Color-coded daily change (red = up, green = down)
- High/Low badges on the highest and lowest entries within visible range

**[src/components/FAQ.tsx](src/components/FAQ.tsx)** — server component
- 8 static Q&A items about gold pricing in Kerala
- Inlines `<script type="application/ld+json">` with `schema.org/FAQPage` markup for Google rich results

### Styling & Metadata
- **[src/app/layout.tsx](src/app/layout.tsx)** — Geist font, SEO metadata (title, description, keywords), amber gradient background
- **[src/app/globals.css](src/app/globals.css)** — Tailwind v4 setup with custom font variable
- Mobile-first, amber/gold color scheme
- Sticky header with backdrop blur

---

## Phase 4: Deployment & Security — Done

### Done
- Git repository actively syncing with remote state.
- Production deployed and integrated with Vercel.
- Environment variables secured in deployment.
- Google Analytics integrated via `@next/third-parties/google`.
- `.env.local` safely excluded with automated Cron job successfully updating database.

---

## Phase 5: SEO, Growth, V2 — Done

### Done
- Programmatic SEO generated via `src/app/[city]/page.tsx` utilizing dynamic params.
- Global canonical logic debugged and fixed within `layout.tsx` enabling deep multi-city indexing.
- `sitemap.ts` and `robots.ts` standardized cleanly mapping all endpoints to absolute non-www domains.
- Search Console verified and XML submitted.
- Created **Gold Calculator** and **Old Gold Calculator** UI components directly supporting conversion workflows.
- Implemented real-time **Top Ticker**.

---

## Code Review Fixes — Done

### Security
- **Separated Supabase clients** — `createSupabaseReadClient()` (anon key) for server-component reads, `createSupabaseAdminClient()` (service role key) for cron writes only (`src/lib/supabase.ts`)

### Bug Fixes
- **Restored `vercel.json`** — was accidentally deleted; cron schedule now once-daily for Hobby plan (`0 5 * * *`)
- **Fixed `parseRate` decimal handling** — uses `parseFloat` + `Math.round` instead of `parseInt` to avoid silently losing paise
- **Fixed city page revalidation** — cron now calls `revalidatePath` for all 9 city routes, not just `/`
- **Fixed GA event spam** — `OldGoldCalculator` fires analytics event once on blur instead of every keystroke
- **Fixed metadata** — Twitter description corrected from "Hourly updates" to "Updated twice daily"
- **ISR revalidation** — increased from 5min to 60min to prevent stale cache issues

### Code Quality
- **Shared types** — extracted `GoldRate` interface to `src/lib/types.ts` (was duplicated 6 times)
- **Shared utilities** — extracted `formatCurrency` to `src/lib/format.ts` (was duplicated 6 times)
- **Removed `build_error.log`** from repo, added `*.log` to `.gitignore`

### UX
- **History table filter** — added 7D / 14D / 30D range toggle
- **City page disclaimer** — non-Kochi city pages show note about uniform Kerala board rates

### Remaining (Future Roadmap)
- AdSense implementation when traffic supports.
- Secondary Data Source engine fallback.
- Blog articles.
- Unit tests for `parseRate`, rate derivation, and `formatCurrency`.

---

## Tech Stack Installed

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.2 | Framework |
| `react` / `react-dom` | 19.2.4 | UI library |
| `@supabase/supabase-js` | ^2.101.1 | Database client |
| `chart.js` | ^4.5.1 | Charting |
| `react-chartjs-2` | ^5.3.1 | React wrapper for Chart.js |
| `tailwindcss` | ^4 | Styling |
| `typescript` | ^5 | Type safety |

---

## Open Questions / Notes

- **Malabar API quirk:** The endpoint returns a 302 redirect on first request. The cron route handles this with a two-step fetch that captures cookies from the first response and sends them with the second. If this ever breaks, check whether Malabar's cookie flow has changed.
- **Chart data requirement:** The price chart only appears meaningfully once there are at least 2 days of data in the database. Until then it shows a placeholder.
- **Revalidation:** Homepage revalidates every 60 minutes via ISR. The cron triggers instant revalidation via `revalidatePath` after each update.
- **Vercel Hobby plan:** Limited to once-daily cron. Upgrade to Pro for twice-daily updates.
