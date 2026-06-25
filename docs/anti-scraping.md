# Anti-scraping / data protection

Goal: make it hard for competitor sites to bulk-grab our gold-rate data —
especially the hard-won historical backfill — without hurting SEO.

## The honest threat model

Our rates are rendered as **public HTML** on pages that **must** stay public
and Google-indexable (homepage, city pages, `/gold-rate-history/[year]`). The
year pages are our entire strategy to outrank keralagold.com. Anything Googlebot
can read, a scraper spoofing Googlebot can read too. **So we cannot truly hide
the data.** What we *can* do is remove the easy bulk grabs and slow everyone
else down. Defense is layered:

| Layer | What it does | Where |
|-------|--------------|-------|
| 1. No bulk CSV | Removed the one-`curl` full-dataset export (`/api/gold-rate-history`). | code (done) |
| 2. Bot UA blocking | 403 known scrapers, competitor-intel crawlers (Ahrefs/Semrush), AI crawlers, and raw HTTP libraries. | `src/proxy.ts` (done) |
| 3. WAF rate limiting | Throttle per-IP request bursts so nobody can sweep all pages quickly. | Vercel dashboard (**manual — see below**) |

Layers 1–2 are shipped in code. Layer 3 is the one that actually slows a
determined scraper, and it **must be configured in the Vercel dashboard** —
there is no CLI/config-file API for the firewall.

## Layer 3 — Vercel WAF rate limiting (do this in the dashboard)

> Rate-limiting rules require the **Vercel Pro** plan (Firewall custom rules).
> Bot UA blocking (layer 2) works on any plan since it's in our own code.

1. Vercel → your project → **Firewall** tab → **Configure** → **+ Add Rule**.
2. **Name:** `Rate limit page scraping`.
3. **If** (conditions):
   - `Request Path` · `starts with` · `/gold-rate-history`
   - (add an OR group for `/news` and `/` and the city pages if you want
     broader coverage — start narrow on the history pages, which are the moat).
4. **Then:** choose **Rate Limit**.
   - Limit: **~30 requests per 60 seconds** per IP (a real human browsing never
     hits this; a scraper sweeping year pages does).
   - Action when exceeded: **Deny** (or **Challenge** if you'd rather show a
     check than hard-block).
   - Keys: **IP address** (default).
5. Save and **Deploy** the firewall config (Vercel prompts you).
6. Optionally add a second rule: **Bot Protection** → enable Vercel's managed
   ruleset to catch known bad bots at the edge (belt-and-suspenders with
   `proxy.ts`).

### Tuning
- Watch the Firewall **Observability** graph for a few days. If real users get
  caught (unlikely at 30/min), raise the limit. If scrapers still get through,
  lower it or widen the path match.
- Vercel rate-limit state is global across the edge (unlike our in-proxy code,
  which is why rate limiting lives here and not in `proxy.ts`).

## What is intentionally NOT protected

- **Page HTML / embedded chart JSON** — public by design (SEO). The year pages
  must be crawlable to rank.
- **Search-engine & social crawlers** — `proxy.ts` never blocks Googlebot,
  Bingbot, or WhatsApp/Twitter/Facebook/Slack preview bots.
- **The OG rate-card image** (`/api/og/gold-rate-card`) — social crawlers fetch
  it for link previews; the `proxy.ts` matcher excludes `/api`.

## If a competitor still scrapes us

UA blocking is spoofable and rate limits only slow bulk sweeps. If a specific
site is clearly mirroring our data:
- Block their crawler IP ranges with a Vercel Firewall **Deny** rule.
- File a DMCA if they republish the dataset verbatim (the backfill + daily
  AKGSMA compilation is our original work).
