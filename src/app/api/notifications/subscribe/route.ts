import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

// Simple in-memory rate limiter: max 5 requests per IP per 60 seconds
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    if (
      !endpoint || typeof endpoint !== "string" || !endpoint.startsWith("https://") || endpoint.length > 512 ||
      !keys?.p256dh || typeof keys.p256dh !== "string" || keys.p256dh.length > 100 ||
      !keys?.auth || typeof keys.auth !== "string" || keys.auth.length > 100
    ) {
      return NextResponse.json(
        { error: "Invalid subscription payload" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    // Insert user's subscription info so we can broadcast later
    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      { onConflict: "endpoint" }
    );

    if (error) {
      console.error("Supabase Push Sub Error:", error.message);
      return NextResponse.json({ error: "Storage error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscription Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
