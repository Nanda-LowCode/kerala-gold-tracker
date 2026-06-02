# News Pages Polish — Design

**Date:** 2026-05-13
**Status:** Approved for implementation planning
**Author:** Nandakumar (with Claude)

## Goal

Bring the freshly-built `/news` hub and `/news/[date]` daily pages up to the visual quality bar set by the homepage and other parts of the site. The current pages are functional but flat — plain lists, plain tiles, plain text. Users perceive them as low-quality. This iteration adds three new reusable components and restructures both pages so the focal point is the user's actual question: *"is now a good time?"*

No new data, no new routes, no schema changes. Pure presentation upgrade plus three new pure components.

## Non-Goals

- Redesigning the homepage
- New data fields, new tables, new Supabase queries
- Animations beyond existing amber-glow patterns already in the codebase
- Redesigning blog or culture pages

## Visual centerpiece: the verdict pill

The new dominant element on each daily page is a "verdict pill" answering the buyer's actual question. Computed from existing `DayStats`:

| `positionInMonthRange` + `monthPctDiff` | Verdict | Colour |
|------------------------------------------|---------|--------|
| `new-low` or `near-low`                   | **BUY ZONE — X% below monthly peak** | Emerald glow |
| `mid` (within ±0.5% of avg)              | **FAIR PRICING — at the monthly average** | Neutral amber |
| `mid` (outside ±0.5% of avg)             | **MID-RANGE — Y% above/below average** | Soft amber |
| `near-high` or `new-high`                 | **NEAR PEAK — X% above monthly average** | Coral/red glow |

The verdict is honest, not promotional ("BUY NOW!"). It tells buyers where the price sits, lets them decide.

## Daily page (`/news/[date]`) — section order

1. **Trust pill** (emerald, "Verified Kerala Board Rate" — reuse homepage pattern)
2. **H1** — "Kerala Gold Rate on Wednesday, May 13, 2026"
3. **Verdict pill** — the new hero, immediately under H1
4. **Range bar** — horizontal gradient from 30-day low to high with today's position as glowing dot
5. **Hero rate card** (22K gradient card, ★ Popular badge — reuse homepage `RateCard` styling)
6. **Mini rate board** (24K / 21K / 18K rows — reuse homepage `RateBoard` styling)
7. **Day-over-day change ribbon** — proper pill (red up / green down), not inline text
8. **Sparkline + 7-day summary card** — combined into one premium card with amber glow
9. **Commentary section** — first paragraph drop cap, inline stat pills, two paragraphs
10. **Prev/next nav** — card-style with date + rate preview (not plain text links)
11. **CTA bar** — same `CtaBanner`-style amber glow

## Hub page (`/news`) — section order

1. **Hero stats strip** — 4 gradient/glow cards: week high, week low, 30-day average, net change vs 30 days ago
2. **30-day sparkline card** — large sparkline with clickable points → per-day pages
3. **Day cards** (replacing flat list) — each card shows date, mini range-bar, 22K rate + pavan rate, change badge, verdict mini-pill
4. **Subtle week dividers** — "Week of May 5–11, 2026" between groups of 7 rows

## New shared components

Each component is a pure server-renderable React component (no client-side state unless noted).

### `src/components/VerdictPill.tsx`

Props:
- `position: RangePosition | null`
- `monthPctDiff: number | null`
- `size?: "lg" | "sm"` (default `"lg"`)

Returns a pill with icon, headline ("BUY ZONE" / "FAIR" / "NEAR PEAK"), and subtext (e.g. "6% below monthly peak"). `size="sm"` is for the hub day-cards.

### `src/components/RangeBar.tsx`

Props:
- `low: number`
- `high: number`
- `current: number`
- `lowLabel?: string` (default: formatted low value)
- `highLabel?: string`

Renders horizontal gradient bar (emerald → amber → coral) with a glowing dot at the `current` position. Width set by parent. Shows labels under the endpoints.

### `src/components/NewsSparkline.tsx`

Props:
- `data: { date: string; rate: number }[]` (chronological)
- `highlightDate?: string` — that point gets a glowing dot
- `height?: number` (default 120)

Client component (uses Chart.js — already a dep via `react-chartjs-2`). Small line chart, amber stroke, gradient fill, optional point highlight. Renders empty placeholder if fewer than 2 data points.

## Files Touched / Added

**Added:**
- `src/components/VerdictPill.tsx`
- `src/components/RangeBar.tsx`
- `src/components/NewsSparkline.tsx`
- `src/components/RateCards.tsx` — extracted `RateCard` and `RateBoard` from `DashboardLayout.tsx` for shared use
- `src/lib/verdict.ts` — pure helper `computeVerdict(stats: DayStats): { kind, headline, sub, tone }`. Keeps logic out of the JSX component.

**Modified:**
- `src/app/news/[date]/page.tsx` — full restructure following section order above
- `src/app/news/page.tsx` — full restructure following section order above
- `src/components/DashboardLayout.tsx` — replace inline `RateCard` and `RateBoard` definitions with imports from `RateCards.tsx`; `RecentDailyUpdates` cards get a small verdict dot per card (matches hub style)

## Re-use strategy

The homepage's `RateCard` and `RateBoard` are defined inline at the bottom of `DashboardLayout.tsx`. Two options:

1. **Inline copy** — paste the JSX into the news pages
2. **Extract** — move `RateCard` and `RateBoard` to `src/components/RateCards.tsx`, import on both sides

Extraction is the right call: it's a one-time cost, it eliminates two duplicated component definitions, and both pages get the same look. Targeted improvement, in scope.

## Verdict computation rules

```typescript
function computeVerdict(stats: DayStats): Verdict | null {
  if (!stats.positionInMonthRange) return null;
  const pct = stats.monthPctDiff ?? 0;
  const absPct = Math.abs(pct).toFixed(1);

  if (stats.positionInMonthRange === "new-low" || stats.positionInMonthRange === "near-low") {
    return {
      kind: "buy",
      headline: "Buy Zone",
      sub: `${absPct}% below monthly peak`,
      tone: "emerald",
    };
  }
  if (stats.positionInMonthRange === "near-high" || stats.positionInMonthRange === "new-high") {
    return {
      kind: "peak",
      headline: "Near Peak",
      sub: `${absPct}% above monthly average`,
      tone: "coral",
    };
  }
  // mid
  if (Math.abs(pct) <= 0.5) {
    return { kind: "fair", headline: "Fair Pricing", sub: "at the monthly average", tone: "amber" };
  }
  return {
    kind: "mid",
    headline: "Mid Range",
    sub: pct > 0 ? `${absPct}% above average` : `${absPct}% below average`,
    tone: "amber",
  };
}
```

## Visual style alignment

All new components follow the existing homepage conventions:
- **Borders & rings**: `border-zinc-200/70` light, `border-zinc-800` dark
- **Cards**: `rounded-2xl bg-white dark:bg-zinc-900` with `shadow-md shadow-amber-100/40`
- **Amber gradient**: `bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700` for emphasis text
- **Glow accents**: `bg-amber-300/50` blurred radial in card corners
- **Emerald for "good"**: matches the trust-badge style (`emerald-50` / `emerald-200` / `emerald-700`)
- **Coral/red for "expensive"**: `red-50` / `red-200` / `red-600`

## Testing

- Type-check passes (`npx tsc --noEmit`)
- Verify script for commentary still produces sensible output
- Manual visual review of hub page and at least 3 daily pages (cover buy/fair/peak verdicts)
- `npm run build` succeeds; `/news` and `/news/[date]` still statically generate

## Out of scope (intentional)

- A separate "About this verdict" tooltip / explanation modal
- Per-city verdict variation (Kerala-wide only, already locked in spec #1)
- Historical archive UI beyond the current hub (no pagination for now — 30 days is enough)
- Animation/transition library

## Risks & Mitigations

- **Risk: Verdict feels too prescriptive ("BUY ZONE" interpreted as investment advice).** Mitigation: phrasing is descriptive not imperative (e.g. "Buy Zone — 6% below monthly peak" reads as a fact about the price, not a recommendation). Add disclaimer in CTA bar / footer linking to existing `/disclaimer` page.
- **Risk: Range bar misrepresents small ranges (e.g. ₹50 spread looks too prominent).** Mitigation: show absolute high/low values under the bar so users can judge the actual size of the range themselves.
- **Risk: Sparkline component balloons the JS bundle on the daily page (currently zero client JS).** Mitigation: confirm bundle size after build. Chart.js is already in the homepage bundle, so it's a re-used chunk; cost should be marginal.
