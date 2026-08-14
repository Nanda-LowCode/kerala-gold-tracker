import { NextRequest, NextResponse } from "next/server";
import { createSupabaseReadClient } from "@/lib/supabase";

/**
 * Resolves historical board rates for a set of purchase dates.
 *
 * The portfolio tracker keeps holdings in localStorage, so the server has no
 * way to know the dates at render time — the client collects its distinct
 * purchase dates and resolves them all here in one round-trip.
 *
 * Board rates are published ~6 days/week, so a purchase date may land on a
 * Sunday or a festival closure. Each requested date therefore resolves to the
 * nearest *preceding* trading day, and the response echoes which date was
 * actually used so the UI can say "board rate of 11 Mar".
 */

/** Earliest board rate in daily_gold_rates. */
const EARLIEST_DATE = "2020-04-06";

/** Max distinct dates per request — bounds both the row count and URL length. */
const MAX_DATES = 30;

/**
 * Calendar days to search back for the nearest preceding trading day. The
 * board publishes ~6 days/week, so 10 comfortably covers a Sunday plus any
 * consecutive festival closure.
 */
const LOOKBACK_DAYS = 10;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(s: string): boolean {
  if (!DATE_RE.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  // Round-trip guards against non-dates that still match the shape (2021-02-30).
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function addDaysUTC(s: string, delta: number): string {
  const d = new Date(s + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

/** Today in IST — the board rate day boundary, matching the update cron. */
function todayIST(): string {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

interface RateRow {
  date: string;
  rate_18k_1g: number;
  rate_22k_1g: number;
  rate_24k_1g: number;
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("dates");
  if (!raw) {
    return NextResponse.json({ error: "Missing ?dates" }, { status: 400 });
  }

  const today = todayIST();
  const requested = [...new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))];

  if (requested.length > MAX_DATES) {
    return NextResponse.json(
      { error: `Too many dates (max ${MAX_DATES})` },
      { status: 400 }
    );
  }

  const invalid = requested.filter(
    (d) => !isValidDate(d) || d < EARLIEST_DATE || d > today
  );
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: `Invalid or out-of-range dates: ${invalid.join(", ")}` },
      { status: 400 }
    );
  }

  // Expand each requested date into itself plus the preceding LOOKBACK_DAYS, then
  // dedupe. Querying this explicit set (rather than one wide gte/lte range) keeps
  // the result bounded: a portfolio spanning 2020–2026 would otherwise ask for
  // ~2,000 rows and be silently truncated by Supabase's 1,000-row response cap.
  const candidates = new Set<string>();
  for (const d of requested) {
    for (let i = 0; i <= LOOKBACK_DAYS; i++) {
      const c = addDaysUTC(d, -i);
      if (c >= EARLIEST_DATE) candidates.add(c);
    }
  }

  try {
    const supabase = createSupabaseReadClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("date, rate_18k_1g, rate_22k_1g, rate_24k_1g")
      .eq("city", "Kochi")
      .in("date", [...candidates])
      .order("date", { ascending: true });

    if (error) {
      console.error("[rates/lookup] Supabase error:", error.message);
      return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
    }

    const rows = (data ?? []) as RateRow[];
    const byDate = new Map(rows.map((r) => [r.date, r]));

    // For each requested date walk backwards to the first day that has a rate.
    const result: Record<string, RateRow | null> = {};
    for (const d of requested) {
      let hit: RateRow | null = null;
      for (let i = 0; i <= LOOKBACK_DAYS; i++) {
        const row = byDate.get(addDaysUTC(d, -i));
        if (row) {
          hit = row;
          break;
        }
      }
      result[d] = hit;
    }

    return NextResponse.json(result, {
      headers: {
        // Historical board rates never change once published, so this is safe to
        // cache hard. Today's date is the only moving target and it re-resolves
        // within the day via stale-while-revalidate.
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("[rates/lookup] Unexpected error:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
