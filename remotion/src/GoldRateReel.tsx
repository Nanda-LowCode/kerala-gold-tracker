import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

export type GoldRateReelProps = {
  date: string; // "2026-06-23"
  city: string; // "Kerala"
  rate22k: number; // ₹ per gram
  rate24k: number; // ₹ per gram
  change22k: number; // ₹ vs yesterday (22K)
  pct: number; // percent change vs yesterday
  spark: number[]; // recent 22K values, oldest → newest
};

export const defaultProps: GoldRateReelProps = {
  date: "2026-06-23",
  city: "Kerala",
  rate22k: 13890,
  rate24k: 15153,
  change22k: 351,
  pct: 2.59,
  spark: [13539, 13665, 13600, 13710, 13800, 13755, 13890],
};

const FONT =
  'Geist, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

const formatDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** Eased 0→1 reveal starting at `delay` frames. */
const useReveal = (delay: number, dur = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

function Sparkline({ data, progress }: { data: number[]; progress: number }) {
  const w = 880;
  const h = 230;
  const pad = 10;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map((p) => p.join(",")).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ opacity: progress }}
    >
      <polyline
        points={line}
        fill="none"
        stroke="#b45309"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 3000,
          strokeDashoffset: interpolate(progress, [0, 1], [3000, 0]),
        }}
      />
      <circle cx={last[0]} cy={last[1]} r={14} fill="#b45309" opacity={progress} />
    </svg>
  );
}

export const GoldRateReel: React.FC<GoldRateReelProps> = ({
  date,
  city,
  rate22k,
  rate24k,
  change22k,
  pct,
  spark,
}) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const up = change22k > 0;
  const flat = change22k === 0;
  const changeColor = flat ? "#71717a" : up ? "#e11d48" : "#059669";
  const arrow = flat ? "—" : up ? "▲" : "▼";

  const header = useReveal(0);
  const title = useReveal(10);
  const big = useReveal(20, 20);
  const pavan = useReveal(34);
  const changeP = useReveal(42);
  const board = useReveal(52);
  const sparkP = useReveal(62, 40);
  const footer = useReveal(150);

  // Gentle scale-in for the hero number.
  const bigScale = interpolate(big, [0, 1], [0.8, 1]);
  // Subtle overall drift so the static frame feels alive.
  const drift = interpolate(frame, [0, durationInFrames], [0, -20]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        background: "linear-gradient(160deg, #fffbeb 0%, #fef3c7 55%, #fde68a 100%)",
        color: "#27272a",
        padding: 80,
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: header,
          translate: `0px ${interpolate(header, [0, 1], [-20, 0])}px`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>
          ✨ LiveGold <span style={{ color: "#d97706" }}>Kerala</span>
        </div>
        <div
          style={{
            marginTop: 16,
            display: "inline-block",
            fontSize: 28,
            fontWeight: 700,
            color: "#047857",
            background: "rgba(16,185,129,0.12)",
            border: "2px solid rgba(16,185,129,0.35)",
            borderRadius: 999,
            padding: "10px 26px",
          }}
        >
          ✓ Verified Kerala Board Rate
        </div>
      </div>

      {/* Center block */}
      <div style={{ textAlign: "center", translate: `0px ${drift}px` }}>
        <div
          style={{
            opacity: title,
            fontSize: 44,
            fontWeight: 700,
            color: "#52525b",
          }}
        >
          Gold Rate Today in {city}
        </div>
        <div
          style={{ opacity: title, fontSize: 30, color: "#a16207", marginTop: 8 }}
        >
          {formatDate(date)}
        </div>

        {/* Hero 22K */}
        <div
          style={{
            opacity: big,
            scale: bigScale,
            marginTop: 40,
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 700, color: "#92400e" }}>
            22 KARAT · 916 HALLMARK
          </div>
          <div
            style={{
              fontSize: 200,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -6,
              color: "#b45309",
            }}
          >
            {inr(rate22k)}
            <span style={{ fontSize: 64, fontWeight: 800 }}>/g</span>
          </div>
        </div>

        <div
          style={{
            opacity: pavan,
            fontSize: 46,
            fontWeight: 700,
            color: "#3f3f46",
            marginTop: 12,
          }}
        >
          {inr(rate22k * 8)} <span style={{ fontWeight: 500 }}>/ pavan (8g)</span>
        </div>

        {/* Change pill */}
        <div
          style={{
            opacity: changeP,
            translate: `0px ${interpolate(changeP, [0, 1], [16, 0])}px`,
            display: "inline-block",
            marginTop: 28,
            fontSize: 40,
            fontWeight: 800,
            color: changeColor,
            background: "rgba(255,255,255,0.7)",
            border: `2px solid ${changeColor}33`,
            borderRadius: 999,
            padding: "12px 34px",
          }}
        >
          {arrow}{" "}
          {flat
            ? "No change since yesterday"
            : `${up ? "Up" : "Down"} ${inr(Math.abs(change22k))}/g · ${Math.abs(pct).toFixed(2)}%`}
        </div>

        {/* 24K board */}
        <div
          style={{
            opacity: board,
            fontSize: 36,
            color: "#52525b",
            marginTop: 28,
          }}
        >
          24 Karat (999): <strong>{inr(rate24k)}/g</strong>
        </div>

        {/* Sparkline */}
        <div style={{ marginTop: 36, display: "flex", justifyContent: "center" }}>
          <Sparkline data={spark} progress={sparkP} />
        </div>
        <div style={{ opacity: sparkP, fontSize: 26, color: "#a1a1aa", marginTop: 4 }}>
          Last {spark.length} days · 22K trend
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          opacity: footer,
          textAlign: "center",
          fontSize: 30,
          fontWeight: 600,
          color: "#a16207",
        }}
      >
        livegoldkerala.com
        <div style={{ fontSize: 22, fontWeight: 400, color: "#a1a1aa", marginTop: 6 }}>
          AKGSMA board rate · For reference only
        </div>
      </div>
    </AbsoluteFill>
  );
};
