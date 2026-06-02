# Project Roadmap: Kerala Gold Tracker 🏆

**Goal:** Build a fully automated, hands-off Next.js web application that tracks and displays the daily 22K and 24K gold rates for Kochi, Kerala, generating passive income via SEO and display ads.

**Current Strategy:** "Solo Anchor" Data Pipeline (100% Free Tier).
**Primary Data Source:** Malabar Gold Official JSON Endpoint.

---

## 🛠️ Tech Stack
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS (optionally shadcn/ui for fast components)
* **Database:** Supabase (PostgreSQL)
* **Hosting & Automation:** Vercel (Hosting + Vercel Cron Jobs)

---

## 📍 Phase 1: Environment & Database Setup
**Objective:** Prepare the foundation and data storage.

* [x] Initialize Next.js project (`npx create-next-app@latest kerala-gold-tracker`).
* [x] Install Supabase client (`npm install @supabase/supabase-js`).
* [ ] Create a free Supabase project.
* [ ] Run the following SQL script in Supabase SQL Editor to create the table:
    ```sql
    CREATE TABLE daily_gold_rates (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      city TEXT NOT NULL DEFAULT 'Kochi',
      rate_22k_1g INTEGER NOT NULL,
      rate_24k_1g INTEGER NOT NULL,
      consensus_sources INTEGER DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Ensure we don't duplicate data if the cron runs twice in one day
    ALTER TABLE daily_gold_rates ADD UNIQUE (date, city);
    ```
* [x] Grab `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` and save them in `.env.local`.

---

## ⚙️ Phase 2: The Automated Backend (Data Pipeline)
**Objective:** Build the engine that fetches and saves the data automatically.

* [x] Create API route: `app/api/cron/update-rates/route.ts`.
* [x] **Logic:** * Verify `CRON_SECRET` in the request headers.
    * `POST` fetch to `https://www.malabargoldanddiamonds.com/malabarprice/index/getrates/?country=IN&state=Kerala`.
    * Extract and clean the `22kt` and `24kt` strings into pure integers (e.g., `13835`).
    * Use `@supabase/supabase-js` to `upsert` the daily record into `daily_gold_rates` using today's date (Asia/Kolkata timezone).
* [x] Create `vercel.json` in the root directory to schedule the Cron Job:
    ```json
    {
      "crons": [
        {
          "path": "/api/cron/update-rates",
          "schedule": "30 10,16 * * 1-6" 
        }
      ]
    }
    ```

---

## 🎨 Phase 3: The Frontend (User Interface)
**Objective:** Display the data cleanly to users.

* [x] Update `app/page.tsx` to act as a Server Component.
* [x] Fetch the most recent row from the `daily_gold_rates` Supabase table.
* [x] **UI Requirements:**
    * Massive, clear display of today's 22K and 24K rate (per 1 gram and per 8 grams/sovereign).
    * Date of the last update visible.
    * Clean, mobile-first design with Tailwind CSS.
    * Loading skeletons or a graceful fallback if the database is currently empty.

---

## 🚀 Phase 4: Deployment & Security
**Objective:** Push the app live to the internet.

* [ ] Push local code to a GitHub repository.
* [ ] Import the repository into Vercel.
* [ ] Add the required Environment Variables in the Vercel dashboard:
    * `NEXT_PUBLIC_SUPABASE_URL`
    * `SUPABASE_SERVICE_ROLE_KEY`
    * `CRON_SECRET` (Generate a secure random string for this).
* [ ] Deploy. (Vercel will automatically read the `vercel.json` and activate the scheduled jobs).

---

## 📈 Phase 5: SEO, Growth, & V2 (Future Scope)
**Objective:** Drive traffic and scale the data pipeline.

* **SEO Architecture:** Create dynamic routes for other Kerala cities (e.g., `/gold-rate-trivandrum`) leveraging the same dataset, tailoring the meta tags for local search traffic.
* **Monetization:** Once daily traffic exceeds 500 visitors, apply for Google AdSense and integrate local jeweler/digital gold affiliate links.
* **V2 Upgrade (The Consensus Engine):** Revisit the Claude AI/Anthropic HTML parsing strategy to read from Goodreturns and BankBazaar as fallback sources if Malabar's API ever changes.