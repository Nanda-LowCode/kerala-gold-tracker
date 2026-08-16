import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

/**
 * Uploads the small amount of portfolio state the daily cron needs to send a
 * personalised push notification: just the total grams per karat and, if the
 * user chose to include it, the sum of what they invested. Dates and labels
 * stay in localStorage — the server never sees them.
 *
 * Called from /my-gold when the user toggles "notify me about my portfolio"
 * on, and whenever the totals change while the toggle is on. A payload with
 * every gram field zero clears the row (toggle off).
 */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 20) return true;
  entry.count++;
  return false;
}

/** Reject implausible weights early so we can't corrupt a row. */
const MAX_GRAMS_PER_KARAT = 100_000; // 12,500 pavan — well past any personal holding
const MAX_COST = 1_000_000_000; // ₹100 crore — same

function validGrams(v: unknown): v is number {
  return (
    typeof v === "number" &&
    Number.isFinite(v) &&
    v >= 0 &&
    v <= MAX_GRAMS_PER_KARAT
  );
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { endpoint, grams18k, grams22k, grams24k, cost } = await request.json();

    if (!endpoint || typeof endpoint !== "string" || !endpoint.startsWith("https://")) {
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    }
    if (!validGrams(grams18k) || !validGrams(grams22k) || !validGrams(grams24k)) {
      return NextResponse.json({ error: "Invalid grams" }, { status: 400 });
    }
    // Cost is optional; the notification just omits % gain when it's absent.
    if (cost !== null && cost !== undefined) {
      if (typeof cost !== "number" || !Number.isFinite(cost) || cost < 0 || cost > MAX_COST) {
        return NextResponse.json({ error: "Invalid cost" }, { status: 400 });
      }
    }

    // All-zero totals mean the user turned the feature off — clear the row.
    const cleared = grams18k === 0 && grams22k === 0 && grams24k === 0;

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("push_subscriptions")
      .update({
        portfolio_grams_18k: cleared ? null : grams18k,
        portfolio_grams_22k: cleared ? null : grams22k,
        portfolio_grams_24k: cleared ? null : grams24k,
        portfolio_cost: cleared ? null : cost ?? null,
        portfolio_updated_at: cleared ? null : new Date().toISOString(),
      })
      .eq("endpoint", endpoint);

    if (error) {
      console.error("[set-portfolio] Supabase error:", error.message);
      return NextResponse.json({ error: "Storage error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[set-portfolio] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
