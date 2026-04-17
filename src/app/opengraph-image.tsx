import { ImageResponse } from "next/og";

export const alt = "LiveGold Kerala — Today's Gold Rate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "64px" }}>✨</span>
          <span
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "#18181B",
              letterSpacing: "-1px",
            }}
          >
            LiveGold{" "}
            <span style={{ color: "#D97706" }}>Kerala</span>
          </span>
        </div>
        <div
          style={{
            fontSize: "32px",
            fontWeight: 600,
            color: "#3F3F46",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          {"Today's 22K & 24K Gold Rate in Kerala"}
        </div>
        <div
          style={{
            marginTop: "16px",
            fontSize: "20px",
            color: "#71717A",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#22C55E",
            }}
          />
          Updated Daily · Verified Board Rate
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "18px",
            color: "#A1A1AA",
          }}
        >
          livegoldkerala.com
        </div>
      </div>
    ),
    { ...size }
  );
}
