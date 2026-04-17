import { NextRequest, NextResponse } from "next/server";
import { createSupabaseReadClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    if (
      !endpoint || typeof endpoint !== "string" || endpoint.length > 512 ||
      !keys?.p256dh || typeof keys.p256dh !== "string" || keys.p256dh.length > 100 ||
      !keys?.auth || typeof keys.auth !== "string" || keys.auth.length > 100
    ) {
      return NextResponse.json(
        { error: "Invalid subscription payload" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseReadClient();

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
