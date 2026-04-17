import { NextRequest, NextResponse } from "next/server";
import { createSupabaseReadClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint || typeof endpoint !== "string" || endpoint.length > 512) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseReadClient();

    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", endpoint);

    if (error) {
      console.error("Supabase Unsub Error:", error.message);
      return NextResponse.json({ error: "Storage error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unsubscribe Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
