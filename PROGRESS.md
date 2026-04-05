# Kerala Gold Tracker — Progress Log

Last updated: 2026-04-05

## Status Overview

| Phase | Status |
|-------|--------|
| Phase 1: Environment & Database Setup | Complete |
| Phase 2: Automated Backend (Data Pipeline) | Complete |
| Phase 3: Frontend (User Interface) | Complete (extended beyond original scope) |
| Phase 4: Deployment & Security | Pending (git initialized, not yet pushed) |
| Phase 5: SEO, Growth, & V2 | Partial (FAQ schema + metadata done) |

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

Runs twice daily, Monday through Saturday:
- 10:30 AM IST
- 4:30 PM IST

```json
{
  "crons": [
    { "path": "/api/cron/update-rates", "schedule": "30 10,16 * * 1-6" }
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
- Revalidation every 5 minutes (`export const revalidate = 300`)

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

## Phase 4: Deployment & Security — Pending

### Done
- Git repository initialized
- Initial commit created on `master` branch (later moved to `main`)
- `.gitignore` properly excludes `.env.local` and other secrets

### Remaining
- [ ] Log into GitHub CLI (`gh auth login`) — user has installed `gh` at `/c/Program Files/GitHub CLI/gh.exe`
- [ ] Create GitHub repository and push
- [ ] Import project into Vercel
- [ ] Add environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `CRON_SECRET`
- [ ] Deploy — Vercel auto-reads `vercel.json` and activates cron jobs

---

## Phase 5: SEO, Growth, V2 — Partial

### Done
- SEO metadata in layout (title, description, keywords)
- FAQ with `schema.org/FAQPage` structured data
- Clean URL structure and semantic HTML

### Remaining
- Dynamic routes for other Kerala cities (e.g., `/gold-rate-trivandrum`)
- Google AdSense integration once traffic > 500/day
- V2: Consensus engine reading from multiple sources (Goodreturns, BankBazaar fallback)
- Gram-to-pavan converter tool
- Making charges calculator
- Blog section

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
- **Revalidation:** Homepage revalidates every 5 minutes — the cron only updates twice daily, so this is generous.
