# Daily Reddit gold-rate post

Auto-posts the day's Kerala gold rate to your subreddit each morning via a
GitHub Action (`.github/workflows/daily-reddit.yml` → `scripts/post-to-reddit.mjs`).
Mirrors the existing daily-video workflow; nothing touches the Vercel site.

## What it posts
A daily text post: title with the date + 22K rate + change, body with a
22K/24K/18K table (per gram + per pavan), the change since yesterday, the AKGSMA
source line, and a link to livegoldkerala.com. It **skips cleanly** if today's
rate row isn't in Supabase yet (so it never posts a stale rate as "today's").

## One-time setup

### 1. Use a dedicated bot account (recommended)
Create/log in as the Reddit account that **moderates your subreddit** (posting
automated content to *your own* sub as a mod is within Reddit's rules). A
separate "…Bot" account keeps it tidy, but your main mod account works too.

### 2. Register a "script" app
1. Go to **https://www.reddit.com/prefs/apps** (logged in as that account).
2. **Create another app…** → type **script**.
3. Name: `livegoldkerala-rate-bot`. Redirect URI: `http://localhost:8080`
   (required but unused for script apps).
4. After creating, note:
   - **client id** — the string under the app name ("personal use script").
   - **secret** — the `secret` field.

### 3. Add GitHub repo secrets
Repo → **Settings → Secrets and variables → Actions → New repository secret**.
Add all seven:

| Secret | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | (same as your site / video workflow) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (same as your site / video workflow) |
| `REDDIT_CLIENT_ID` | app client id |
| `REDDIT_CLIENT_SECRET` | app secret |
| `REDDIT_USERNAME` | bot/mod account username |
| `REDDIT_PASSWORD` | that account's password |
| `REDDIT_SUBREDDIT` | your sub name, **without** `r/` (e.g. `LiveGoldKerala`) |

> If the account has 2FA on, Reddit's password grant needs it appended as
> `password:123456` — simpler to use an account without 2FA for the bot, or an
> app password. The Supabase secrets are the same two the daily-video workflow
> already uses.

### 4. Test it
Repo → **Actions → Daily Reddit Gold Rate Post → Run workflow** (tick **force**
if today's rate isn't in yet). Check the run log for `✓ Posted to r/...` and the
permalink. After that it runs automatically at **~10:45 AM IST** daily.

## Run locally instead
Put the same vars in `.env.local`, then:

```bash
REDDIT_FORCE=1 npm run post-reddit
```

## Tuning
- **Time:** edit the `cron` in the workflow (it's in UTC; `15 5 * * *` = 10:45 IST).
- **Cadence:** to post only on a notable move, gate the submit on
  `Math.abs(pct) >= 0.5` in `post-to-reddit.mjs`.
- **Format:** title/body are plain template strings near the top of the submit
  section — easy to reword, add flair (`flair_id`), etc.

## Notes / honest limits
- Automation keeps the sub fed with content (good for SEO — Reddit ranks well in
  Google, and a daily indexed post + backlink helps), but it does **not** grow
  members. Seed it with manual replies/discussion to build a real community.
- Reddit's password-grant OAuth is for script apps owned by the same account.
  If Reddit ever tightens this, switch to a stored refresh token (the script's
  auth step is the only part that changes).
