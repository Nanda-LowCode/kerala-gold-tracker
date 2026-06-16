# SEO & Growth Audit — June 2026

Based on Google Search Console data for the 3 months ending 2026-06-16
(~48 clicks / ~5,400 impressions, avg position ~21, CTR < 1%).

## TL;DR

The site is technically well-built (clean schema, FAQ markup, sitemap, programmatic
city routing). The problem is **what** ranks and **how** it converts, not crawlability.

- **Daily `news/[date]` pages are the engine** — they rank ~position 6 and drive ~38 of 48
  clicks. They are rich (356 lines), unique, and freshness-dated. Everything else should
  learn from them.
- **The homepage is the biggest leak** — 1,205 impressions → 3 clicks (0.25% CTR), avg
  position 27. It was titled/H1'd around "Kochi" on a site called *livegoldkerala*, so it
  under-claimed the high-volume "Kerala / today gold rate" head terms.
- **City pages are near-duplicate** — same `DashboardLayout`, same Kerala-wide rate numbers,
  only a small insight + FAQ differ. Google buries them at position 34–72.
- **Untapped demand we already rank for but had no dedicated page** — `gold tax in kerala`
  (172 impressions, pos 12), `gold gst in kerala` cluster, making-charges cluster.

## What the data says

### Winners (keep doing this)
| Page | Position | Clicks |
|---|---|---|
| `/news/2026-05-10` | 6.1 | 9 |
| `/news/2026-05-31` | 6.0 | 6 |
| `/news/2026-05-17` | 6.3 | 5 |
| `/news/2026-06-03` | 5.8 | 5 |

Daily, unique, freshness-dated, with `NewsArticle` schema. This is the formula.

### Losers (highest-impression underperformers)
| Page / Query | Impressions | Position |
|---|---|---|
| Homepage `/` | 1,205 | 27 |
| `gold rate today kozhikode` | 62 | 60 |
| `gold rate today in thrissur` | 45 | 67 |
| `gold rate in kochi today` | 34 | 60 |
| `gold rate today calicut` | 27 | 72 (no `/calicut` page existed) |

### Untapped queries (good position, no targeted content)
| Query | Impressions | Position |
|---|---|---|
| **gold tax in kerala** | **172** | **12.6** |
| 8 gram gold rate today | 80 | 10.5 |
| gold gst in kerala | 44 | 16.8 |
| gst for gold in kerala | 29 | 15.6 |
| making charge of gold in kerala (cluster) | ~85 | ~10 |
| 999 gold rate | 17 | 7.7 |
| live gold price | 36 | 9.9 |

### Segments
- **Mobile** position 10 / **Desktop** position 34 (2,252 desktop impressions). Worth a
  separate Core Web Vitals + desktop-layout pass.
- **India** is 85% of impressions; Gulf NRI countries (UAE, Saudi, Oman, Qatar, Kuwait,
  Bahrain) are a meaningful secondary audience — relevant to the 21K/22K and import-duty content.

## Prioritised plan

### P0 — Homepage CTR + head-term ranking *(implemented)*
- Re-point homepage title, description, and H1 from "Kochi" → "Kerala" so it claims
  `kerala gold rate today`, `today gold rate`, `gold rate today`. Kochi remains the
  reference data city.
- Keep the live rate + date in the title so the SERP snippet shows a concrete price.

### P0 — "Gold Tax & GST in Kerala" guide *(implemented)*
- New post targeting the 172-impression `gold tax in kerala` query (the existing post was
  generic *India* GST). Kerala-specific framing + `FAQPage` schema for the GST sub-queries.

### P1 — City-page uniqueness *(partially implemented)*
- Added `/calicut` (the anglicised Kozhikode search term had zero dedicated page).
- **Still recommended:** the core duplicate-content risk is that every city renders the
  identical Kerala-board numbers. Genuine fixes, in order of effort:
  1. Lead each city page with a substantial, city-specific intro paragraph + local FAQ
     above the (identical) rate table — push unique text higher.
  2. Add a city-specific 30-day mini-table/sparkline framed as "<City> 22K trend".
  3. Consider consolidating very-low-demand district pages and `rel=canonical`-ing
     duplicates if Google flags them as soft-duplicates in GSC's Pages report.

### P2 — Retention / "reuse" (turn searchers into repeat visitors)
Infra already exists (`/api/notifications/*`). Surface it:
- Prominent "Get the daily rate on WhatsApp / push alert" prompt.
- Price-drop / target-price alert (the `set-alert` route already exists).
- PWA "Add to Home Screen" so the daily check is one tap.
- WhatsApp share of the daily rate card (high virality in Kerala).

### P2 — Desktop diagnosis
Position 34 on desktop vs 10 on mobile is abnormal. Check CWV (LCP/CLS) and whether the
desktop layout pushes the rate below the fold.

## Notes / constraints
- `node_modules` is not installed in this working copy, so changes here were made to match
  existing in-repo conventions and **have not been verified with `npm run build`**. Run a
  local build + Rich Results Test before deploying.
