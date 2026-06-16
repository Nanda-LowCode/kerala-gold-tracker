import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const CITIES = [
  "trivandrum", "ernakulam", "kozhikode", "calicut", "thrissur", "kollam",
  "palakkad", "kannur", "alappuzha", "kottayam", "malappuram",
  "pathanamthitta", "idukki", "wayanad", "kasaragod",
];

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/gold-rate-history");
  revalidatePath("/gold-rate-yesterday-kerala");
  revalidatePath("/silver-rate-kerala");
  for (const city of CITIES) {
    revalidatePath(`/${city}`);
  }

  return NextResponse.json({ success: true, revalidated: ["/", ...CITIES] });
}
