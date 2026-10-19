# Widget outreach playbook

**Goal:** every site that embeds the `/embed` widget gives livegoldkerala.com a
permanent, visible, dofollow backlink via the attribution `<a>` in the snippet.
Each embed = authority that compounds without any further work on our side.

Pairs with the shipped assets:
- `/widget` — landing page: live preview + copy snippet (what we send people to)
- `/embed` — the actual framable widget (what they iframe in)

This is a **self-serve** channel. We don't convince them to write about us; we
hand them a tiny thing they want and the link rides inside it. Different motion
from `backlink-outreach.md` (which is media + Quora/Reddit pitches).

---

## Target discovery

### Who we want (ranked by fit)

1. **Independent Kerala jewellery shops** with their own website — a family
   showroom in Thrissur, Kottayam, Palakkad etc. that has a "Today's Rate"
   corner on their homepage. They currently update it manually or show a static
   image. The widget saves them 2 minutes a day.
   - *Not* Malabar / Kalyan / Joyalukkas / Bhima / Chemmanur — they have their
     own feeds and will never embed a competitor's widget.
2. **Kerala wedding planners, bridal blogs, jewellery stylists** — audience is
   actively budgeting gold purchases. A live rate near their "wedding gold
   checklist" is useful content, not clutter.
3. **Malayalam news aggregators & local news sites** — regional outlets that
   publish local stories. A rate sidebar fits naturally.
4. **Kerala finance / investment / NRI bloggers** — Gulf-Malayali focused sites
   where readers ask "what's gold doing back home?" every week.
5. **Astrology / muhurtham / Kerala almanac sites** — they publish daily
   panchangam and wedding dates; a daily gold rate pairs well.

### Where to NOT target

- Direct rate-tracker competitors (goodreturns.in, bankbazaar, livepriceofgold)
- The large chain jewellers
- International bullion sites — our rate is Kerala-local, irrelevant to them
- News majors (Manorama, Mathrubhumi) — they'd want a formal data partnership,
  not an iframe. For those, pitch via the regular `backlink-outreach.md` route.

### Google dorks to find candidates (run these verbatim)

```
"today gold rate" site:*.in "kerala" -malabargold.com -kalyanjewellers.com -livegoldkerala.com
intitle:"gold rate" "thrissur" | "kottayam" | "palakkad" | "kozhikode"
"kerala wedding" blog "gold"
"jewellery" site:*.com inurl:kerala -site:malabargold.com
"ഇന്നത്തെ സ്വർണ്ണവില" site:*.in
inurl:panchangam kerala
```

For every candidate: open the site, confirm **(a) it's active (post in last 6
months) and (b) they'd plausibly care about a Kerala gold rate**. Half the
hits will be junk — move on.

Collect in the spreadsheet below as you go. Aim for **40-60 candidates**
before you start emailing — a cohort beats one-by-one.

---

## The pitch email

Keep it short. People read the first two sentences and the snippet; the rest is
reassurance.

### Subject lines (A/B two of these)

- `Free widget: today's live Kerala gold rate for <site-name>`
- `A tiny gift for <site-name> — live Kerala gold rate`
- `Quick thing for <site-name>'s gold-rate section`

### Body (initial pitch)

```
Hi <first-name>,

Saw <site-name> covers <specific-thing: Kerala jewellery / Kerala weddings /
Gulf Malayalis / etc.> — thought this might be useful.

I run livegoldkerala.com — a daily tracker that reads AKGSMA's board rate at
10 AM IST (same number used across Kerala showrooms). I made it embeddable,
free, no sign-up:

<iframe src="https://www.livegoldkerala.com/embed"
  width="340" height="180" loading="lazy"
  style="border:0;max-width:100%"
  title="Kerala Gold Rate Today"></iframe>
<p style="font:12px/1.4 sans-serif;margin:6px 0 0">
  <a href="https://www.livegoldkerala.com/">Kerala Gold Rate Today</a> by LiveGold Kerala
</p>

Preview + dark variant: https://www.livegoldkerala.com/widget

Paste anywhere, updates automatically every day, mobile-responsive.

If it fits <site-name>, use it. If not, totally fine — no follow-up needed.

— Nanda
livegoldkerala.com
```

### Why this works

- **Personalised first line** (one specific observation about their site) — not
  a template blast. Rewrite it for every single email.
- **Clear value for them, not us** — "saves you two minutes a day" is implicit,
  "it helps my SEO" is never mentioned.
- **Snippet is in the email itself** — no download, no account, no CTA button.
  They can paste it in 30 seconds.
- **Explicit opt-out line** at the end — removes the "will this guy chase me?"
  friction and bumps response rate.

### Follow-up (ONE time, 7 days later, if no reply)

```
Hi <first-name> — just floating this back up in case it got buried.
Totally fine either way. Snippet below if useful:

<iframe src="https://www.livegoldkerala.com/embed" width="340" height="180"
  loading="lazy" style="border:0;max-width:100%"
  title="Kerala Gold Rate Today"></iframe>
<p style="font:12px/1.4 sans-serif;margin:6px 0 0">
  <a href="https://www.livegoldkerala.com/">Kerala Gold Rate Today</a> by LiveGold Kerala
</p>

— Nanda
```

Then stop. Two touches, no third.

---

## Alternative channels (same ask, different medium)

- **Instagram DM** — Kerala jewellery shops with a website in their bio. Shorter
  version:
  > Hey, love <shop-name>. I run livegoldkerala.com and made a free embeddable
  > daily rate widget for Kerala sites. Would it be useful for your site?
  > Here's the preview: livegoldkerala.com/widget
- **WhatsApp Business numbers** on jewellery shop sites — same copy as the DM
  above. Keep it short. These convert well because it's a human-to-human
  channel.
- **Facebook business pages** — a comment "DM'd you" after a 1-line pitch via
  message often works where a cold email would be ignored.
- **Jewellery forum threads / FB groups** — share once, pinned post, don't spam.

---

## Tracking spreadsheet

Make a Google Sheet with these columns and keep it as the single source of
truth. Copy this header row verbatim.

| site | url | tier | contact-name | contact-email | contact-channel | pitched-on | followup-on | installed | notes |
|---|---|---|---|---|---|---|---|---|---|

- `tier`: 1 (independent jeweller), 2 (wedding blog), 3 (news/aggregator),
  4 (finance/NRI blog), 5 (almanac/astro).
- `contact-channel`: `email`, `instagram-dm`, `whatsapp`, `fb-message`,
  `contact-form`.
- `installed`: date they put it live (verify by viewing their page source —
  `grep` for `livegoldkerala.com/embed`).

### Verifying installs

Once a week, run:

```bash
# For each site you pitched, check if the embed is live on their page.
for site in $(cat pitched-sites.txt); do
  curl -s "$site" | grep -o 'livegoldkerala.com/embed' > /dev/null \
    && echo "✓ $site" || echo "✗ $site"
done
```

(For the GSC-level signal — look at referrers to `/embed` in Vercel Analytics;
each unique external referrer = an active embed.)

---

## Realistic expectations

- Cold email response rate for a free, non-ask offer like this: **10-25%**
- Of responders, **40-60%** will actually paste the snippet (people say yes
  more easily than they ship)
- So out of **50 pitches** → **~8-12 installs**
- Each install = **1 permanent backlink** from a referring domain in your
  niche. That's a materially better link profile than you'll build from
  10 blog posts in the same timeframe.

Don't expect it all in one week. Pace: **8-12 outreach emails per day** over
a week, then stop and track. Second cohort a month later with the sites you
missed.

---

## When to stop

If after 3 cohorts (~150 pitches) installs are below 10, something's wrong
with the targeting (not the widget). Revisit who you're pitching before
sending any more.

If installs are 10+, keep the funnel open — the compound is real; one install
a week forever adds 50 referring domains a year.
