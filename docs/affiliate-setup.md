# Affiliate / lead-gen setup

Affiliate & lead-gen pay **per action** (signup, loan lead, first purchase), not
per impression — so they can earn at low traffic, unlike AdSense, and without
hurting UX / Core Web Vitals. This is the right monetization for the gold-rate
audience while the site is young.

## How it works
- `src/lib/affiliates.ts` reads two env vars. Each one that's set adds a card to
  the **"Gold services"** block on the dashboard (`AffiliateOffers`).
- If neither is set, **nothing renders** — no dead links ever ship.
- Links are output `rel="sponsored nofollow"` (Google's requirement for paid /
  affiliate links — keeps your SEO clean) and disclosed inline.

## Step 1 — join a program (pick the ones that approve you)

**Gold loan** (high payouts per qualified lead; Kerala has huge demand):
- Rupeek partner / affiliate program
- Muthoot Finance / Manappuram lead programs
- Bajaj Markets, IndiaGold, or an aggregator like Cuelinks / vCommission /
  INRdeals that carries multiple gold-loan offers

**Digital gold / investing** (per-signup or per-first-purchase):
- Jar, Groww, MMTC-PAMP, Tanishq Digital Gold, or SafeGold partner programs
- Or via an affiliate network (Cuelinks / EarnKaro / vCommission) which bundles
  many fintech offers behind one account — easiest to get approved as a new site

> Tip: a network like **Cuelinks / EarnKaro** is the fastest start — one signup,
> many offers, and they approve small sites. You can graduate to direct programs
> (higher payouts) once you have traffic.

## Step 2 — add your links as env vars
Vercel → project → **Settings → Environment Variables** (Production):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_AFF_GOLD_LOAN` | your gold-loan affiliate URL |
| `NEXT_PUBLIC_AFF_DIGITAL_GOLD` | your digital-gold affiliate URL |

Set only the ones you have — the other card stays hidden.

## Step 3 — redeploy
`NEXT_PUBLIC_*` vars are inlined at build time, so trigger a redeploy (Vercel →
Deployments → Redeploy, or push any commit). The cards appear once live.

## Notes
- **Disclosure** is shown inline on the block and is required (ASCI/FTC). Keep it.
- The card copy lives in `src/lib/affiliates.ts` — edit titles/blurbs/CTAs there
  (avoid naming a specific brand unless your link actually goes there).
- Want these on blog posts too (e.g. the gold-loan and digital-gold guides)?
  Easy follow-up — drop `<AffiliateOffers />` or a single-offer variant into
  those MDX pages.
- Realistic earnings still scale with traffic — a few conversions/month at low
  traffic, growing as the site does. It complements, not replaces, the longer
  AdSense game once you pass ~15–25K pageviews/month.
