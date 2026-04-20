import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 10) return true;
  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { endpoint, targetRate } = await request.json();

    if (!endpoint || typeof endpoint !== "string" || !endpoint.startsWith("https://")) {
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    }

    // targetRate null = clear the alert; otherwise must be a sensible gold price
    if (targetRate !== null) {
      if (typeof targetRate !== "number" || targetRate < 1000 || targetRate > 200000) {
        return NextResponse.json({ error: "Invalid target rate" }, { status: 400 });
      }
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("push_subscriptions")
      .update({ target_rate: targetRate })
      .eq("endpoint", endpoint);

    if (error) {
      console.error("[set-alert] Supabase error:", error.message);
      return NextResponse.json({ error: "Storage error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[set-alert] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
