import { ImageResponse } from "next/og";
import { createSupabaseReadClient } from "@/lib/supabase";

export const alt = "LiveGold Kerala — Today's Gold Rate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  let rate22k: number | null = null;
  let rate24k: number | null = null;
  let dateLabel = "";

  try {
    const supabase = createSupabaseReadClient();
    const { data } = await supabase
      .from("daily_gold_rates")
      .select("date, rate_22k_1g, rate_24k_1g")
      .eq("city", "Kochi")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      rate22k = data.rate_22k_1g;
      rate24k = data.rate_24k_1g;
      dateLabel = new Date(data.date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  } catch {
    // fall through to static fallback
  }

  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 40%, #FDE68A 100%)",
          fontFamily: "sans-serif",
          padding: "48px",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <span style={{ fontSize: "56px" }}>✨</span>
          <span style={{ fontSize: "52px", fontWeight: 800, color: "#18181B", letterSpacing: "-1px" }}>
            LiveGold <span style={{ color: "#D97706" }}>Kerala</span>
          </span>
        </div>

        {rate22k && rate24k ? (
          /* Live rate cards */
          <div style={{ display: "flex", gap: "32px", marginBottom: "28px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "white",
                border: "2px solid #FCD34D",
                borderRadius: "20px",
                padding: "24px 40px",
                boxShadow: "0 8px 32px rgba(251,191,36,0.25)",
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: 700, color: "#92400E", letterSpacing: "2px" }}>
                22K GOLD
              </span>
              <span style={{ fontSize: "52px", fontWeight: 900, color: "#D97706", letterSpacing: "-2px", marginTop: "4px" }}>
                {fmt(rate22k)}
              </span>
              <span style={{ fontSize: "16px", color: "#A1A1AA", marginTop: "4px" }}>per gram</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "white",
                border: "2px solid #E4E4E7",
                borderRadius: "20px",
                padding: "24px 40px",
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: 700, color: "#52525B", letterSpacing: "2px" }}>
                24K GOLD
              </span>
              <span style={{ fontSize: "52px", fontWeight: 900, color: "#3F3F46", letterSpacing: "-2px", marginTop: "4px" }}>
                {fmt(rate24k)}
              </span>
              <span style={{ fontSize: "16px", color: "#A1A1AA", marginTop: "4px" }}>per gram</span>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: "32px", fontWeight: 600, color: "#3F3F46", textAlign: "center", marginBottom: "28px" }}>
            {"Today's 22K & 24K Gold Rate in Kerala"}
          </div>
        )}

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "18px", color: "#71717A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#22C55E" }} />
            {dateLabel ? `Updated ${dateLabel}` : "Updated Daily · Verified Board Rate"}
          </div>
          <span style={{ color: "#D4D4D8" }}>·</span>
          <span>livegoldkerala.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
