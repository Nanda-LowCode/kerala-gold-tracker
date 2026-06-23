# Kerala Gold Rate — daily reel (Remotion)

Isolated Remotion subproject that renders a vertical **1080×1920** "Gold Rate Today"
video from the live Supabase data. It's **separate from the Next.js site** — its own
`package.json`, never bundled into the Vercel deploy.

## What it makes

`GoldRateReel` (6s, 30fps): brand → "Gold Rate Today in Kerala" + date → big 22K
₹/g → per-pavan → ▲/▼ change pill → 24K → 7-day sparkline → footer. Post it as an
Instagram Reel / YouTube Short / WhatsApp status.

## Local use

```bash
cd remotion
npm install

# Preview/edit in Remotion Studio (uses sample data):
npm run dev

# Render with TODAY's live data:
NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... npm run fetch
npm run render          # → out/kerala-gold-reel.mp4

# Quick one-frame sanity check (no full render):
npm run still           # → out/preview.png
```

(The `NEXT_PUBLIC_SUPABASE_*` values are the same read-only ones used by the site.)

## Automated daily render

`.github/workflows/daily-video.yml` runs every morning (after the rate cron),
renders the reel, and uploads it as a **workflow artifact** you download and post.

**Setup:** add two repo secrets in GitHub → Settings → Secrets and variables → Actions:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then trigger it manually once from the **Actions** tab (`workflow_dispatch`) to test.

## Notes

- Auto-**posting** to social isn't included (Instagram/YouTube APIs need separate
  auth/approval). v1 = render automatically, post manually (~30s/day).
- Editing the design: `src/GoldRateReel.tsx`. Animations follow Remotion rules
  (`interpolate` + `Easing`, no CSS transitions).
