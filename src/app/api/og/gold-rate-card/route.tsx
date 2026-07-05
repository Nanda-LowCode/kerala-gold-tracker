import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { createSupabaseReadClient } from "@/lib/supabase";

export const runtime = "nodejs";

function fmt(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export async function GET() {
  const supabase = createSupabaseReadClient();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  const { data } = await supabase
    .from("daily_gold_rates")
    .select("rate_22k_1g, rate_24k_1g")
    .eq("date", today)
    .eq("city", "Kochi")
    .single();

  const rate22k = data?.rate_22k_1g ?? 0;
  const rate24k = data?.rate_24k_1g ?? 0;
  const pavan22k = rate22k * 8;
  const pavan24k = rate24k * 8;

  const dateFormatted = new Date(today + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const qrDataUrl = await QRCode.toDataURL("https://www.livegoldkerala.com", {
    width: 160,
    margin: 1,
    color: { dark: "#f5c842", light: "#0d0500" },
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          background: "linear-gradient(160deg, #0d0500 0%, #2a1200 45%, #0d0500 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "70px 64px",
          position: "relative",
        }}
      >
        {/* Outer gold border */}
        <div
          style={{
            position: "absolute",
            inset: "22px",
            border: "2px solid #b8860b",
            borderRadius: "28px",
            opacity: 0.5,
            display: "flex",
          }}
        />
        {/* Inner subtle border */}
        <div
          style={{
            position: "absolute",
            inset: "28px",
            border: "1px solid #f5c842",
            borderRadius: "22px",
            opacity: 0.15,
            display: "flex",
          }}
        />

        {/* Header branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
          <svg width="56" height="56" viewBox="0 0 64 64">
            <path d="M50 20 A 24 24 0 1 0 56 32" fill="none" stroke="#f5c842" strokeWidth="6.5" strokeLinecap="round" />
            <rect x="34" y="29" width="22" height="7" rx="3.5" fill="#F7C948" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "48px", fontWeight: 800, color: "#f5c842", lineHeight: "1" }}>
              LiveGold Kerala
            </span>
            <span style={{ fontSize: "17px", color: "#a08030", letterSpacing: "5px", marginTop: "6px" }}>
              DAILY GOLD RATE UPDATE
            </span>
          </div>
        </div>

        {/* Date */}
        <div style={{ fontSize: "24px", color: "#d4a843", marginBottom: "52px", letterSpacing: "1px" }}>
          {dateFormatted}
        </div>

        {/* Rate cards */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "44px" }}>
          {/* 22K card */}
          <div
            style={{
              background: "linear-gradient(145deg, #7a5c00, #d4a017, #8a6800)",
              borderRadius: "22px",
              padding: "36px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "456px",
              boxShadow: "0 12px 40px rgba(212,160,23,0.35)",
            }}
          >
            <span style={{ fontSize: "19px", fontWeight: 800, color: "#1a0a00", letterSpacing: "3px", marginBottom: "4px" }}>
              22 KARAT GOLD
            </span>
            <span style={{ fontSize: "13px", color: "#3d2000", marginBottom: "22px", letterSpacing: "1.5px" }}>
              916 PURITY · JEWELLERY GRADE
            </span>
            <span style={{ fontSize: "62px", fontWeight: 800, color: "#0d0500", lineHeight: "1" }}>
              {fmt(rate22k)}
            </span>
            <span style={{ fontSize: "18px", color: "#4a2800", marginBottom: "18px" }}>per gram</span>
            <div style={{ width: "85%", height: "1px", background: "#5a3d00", display: "flex", marginBottom: "18px" }} />
            <span style={{ fontSize: "34px", fontWeight: 700, color: "#1a0a00" }}>
              {fmt(pavan22k)}
            </span>
            <span style={{ fontSize: "15px", color: "#3d2000", marginTop: "4px" }}>per pavan (8 grams)</span>
          </div>

          {/* 24K card */}
          <div
            style={{
              background: "linear-gradient(145deg, #4a3800, #b8852a, #4a3800)",
              borderRadius: "22px",
              padding: "36px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "456px",
              boxShadow: "0 12px 40px rgba(184,133,42,0.35)",
            }}
          >
            <span style={{ fontSize: "19px", fontWeight: 800, color: "#fff8e0", letterSpacing: "3px", marginBottom: "4px" }}>
              24 KARAT GOLD
            </span>
            <span style={{ fontSize: "13px", color: "#ffe5a0", marginBottom: "22px", letterSpacing: "1.5px" }}>
              999 PURITY · INVESTMENT GRADE
            </span>
            <span style={{ fontSize: "62px", fontWeight: 800, color: "#fff8e0", lineHeight: "1" }}>
              {fmt(rate24k)}
            </span>
            <span style={{ fontSize: "18px", color: "#ffe0a0", marginBottom: "18px" }}>per gram</span>
            <div style={{ width: "85%", height: "1px", background: "#7a5c20", display: "flex", marginBottom: "18px" }} />
            <span style={{ fontSize: "34px", fontWeight: 700, color: "#fff8e0" }}>
              {fmt(pavan24k)}
            </span>
            <span style={{ fontSize: "15px", color: "#ffe5a0", marginTop: "4px" }}>per pavan (8 grams)</span>
          </div>
        </div>

        {/* Source line */}
        <div style={{ fontSize: "16px", color: "#6a4c10", marginBottom: "22px", textAlign: "center", letterSpacing: "0.5px" }}>
          Source: Kerala Gold &amp; Silver Merchants Association Board Rate
        </div>

        {/* Website footer + QR code */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            borderTop: "1px solid #3d2800",
            paddingTop: "22px",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {/* QR code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} width={110} height={110} alt="QR" style={{ borderRadius: "10px" }} />
            <span style={{ fontSize: "11px", color: "#8a6520", letterSpacing: "1px" }}>SCAN TO VISIT</span>
          </div>
          {/* URL */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
            <svg width="26" height="26" viewBox="0 0 64 64">
              <path d="M50 20 A 24 24 0 1 0 56 32" fill="none" stroke="#f5c842" strokeWidth="7" strokeLinecap="round" />
              <rect x="34" y="29" width="22" height="7" rx="3.5" fill="#F7C948" />
            </svg>
            <span style={{ fontSize: "30px", fontWeight: 700, color: "#f5c842", letterSpacing: "1.5px" }}>
              livegoldkerala.com
            </span>
            <span style={{ fontSize: "14px", color: "#7a5c20", letterSpacing: "0.5px" }}>
              Live Kerala gold rates · Free · Daily
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Type": "image/png",
      },
    }
  );
}
