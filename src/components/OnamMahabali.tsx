"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Onam easter egg — King Mahabali strolls across the bottom of the screen and
 * waves. Tap him and he stops to bless you with a (gold-themed, tongue-in-cheek)
 * Onam greeting. Only appears during the Onam window and can be dismissed for
 * the season. All motion is disabled under prefers-reduced-motion (he then just
 * sits in the corner, still tappable).
 *
 * Thiruvonam 2026 falls on ~26 Aug; the window below covers the celebration and
 * auto-retires him afterwards. Bump the dates (and the storage key) next year.
 */
export const ONAM_START = new Date("2026-08-11T00:00:00+05:30");
export const ONAM_END = new Date("2026-09-06T23:59:59+05:30");
const DISMISS_KEY = "onam-2026-mahabali-dismissed";

// Blessings — a mix of Onam warmth and gentle gold-site humour.
const BLESSINGS = [
  "ഓണാശംസകൾ! 🌼 May your gold rate dip the day *before* you buy.",
  "Blessings, my child! 🙏 Even in Pataala I check livegoldkerala.com.",
  "Onam greetings! ✨ May your making charges be low and your wastage lower.",
  "I rise but once a year — unlike the gold rate, which climbs every day. 📈",
  "May your sadhya be grand 🍛 and your 22K be a true 916.",
  "Blessed be! 💰 I ruled all Kerala and *still* can't afford a full pavan today.",
  "Happy Onam! 🌸 Buy gold if you must — but read the bill line by line.",
];

/** Lines that react to today's actual rate — he *knows* the board rate. */
function buildRateLines(rate22k: number | null, change: number | null): string[] {
  if (rate22k == null) return [];
  const rate = `₹${rate22k.toLocaleString("en-IN")}`;
  const lines = [`Today's 22K is ${rate}/g. In my day the whole kingdom cost less. 👑`];
  if (change != null && change < 0) {
    const d = `₹${Math.abs(change).toLocaleString("en-IN")}`;
    lines.push(
      `The heavens smile! 🌤️ 22K is down ${d} today — go forth and bargain, my child.`,
      `A dip of ${d}! Not even Vamana pushes things down this well. 😄`,
    );
  } else if (change != null && change > 0) {
    const d = `₹${change.toLocaleString("en-IN")}`;
    lines.push(
      `Up ${d} today, my child. Even I wait for a dip — and I own Pataala. 🥲`,
      `22K rose ${d} overnight. It climbs faster than I climb out of the netherworld. 📈`,
    );
  } else if (change === 0) {
    lines.push("The rate hasn't moved today — a rare moment of peace. Savour it. ⚖️");
  }
  return lines;
}

// Pookalam palette — marigold, jasmine, a touch of red.
const PETAL_COLORS = ["#fbbf24", "#f59e0b", "#fb923c", "#f97316", "#fde68a", "#fff7ed", "#ef4444"];

interface Petal {
  id: number;
  dx: number;
  dy: number;
  rot: number;
  delay: number;
  color: string;
}

/** A fresh burst of petals, scattered up and outward from his crown. */
function makePetals(): Petal[] {
  return Array.from({ length: 14 }, (_, i) => ({
    id: Date.now() + i,
    dx: Math.round(Math.random() * 140 - 70),
    dy: Math.round(-30 - Math.random() * 85),
    rot: Math.round(Math.random() * 360 - 180),
    delay: Math.random() * 0.15,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
  }));
}

interface OnamMahabaliProps {
  rate22k?: number | null;
  change?: number | null;
}

export default function OnamMahabali({ rate22k = null, change = null }: OnamMahabaliProps) {
  const [show, setShow] = useState(false);
  const [blessing, setBlessing] = useState<string | null>(null);
  const [petals, setPetals] = useState<Petal[]>([]);
  const tappedOnce = useRef(false);

  // Gate on mount: only render inside the Onam window, and not if dismissed.
  // Entrance is deferred a beat so the page settles first (and so setState
  // runs from a timer callback, not synchronously in the effect body).
  useEffect(() => {
    const now = new Date();
    if (now < ONAM_START || now > ONAM_END) return;
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      /* private mode — just show him */
    }
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Auto-stop blessing after a few seconds so he resumes his stroll.
  // Long enough to read the line and reach the share button.
  useEffect(() => {
    if (!blessing) return;
    const t = setTimeout(() => setBlessing(null), 8000);
    return () => clearTimeout(t);
  }, [blessing]);

  function dismiss(e: React.MouseEvent) {
    e.stopPropagation();
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  function bless() {
    setPetals(makePetals());
    const rateLines = buildRateLines(rate22k, change);
    setBlessing((prev) => {
      // First tap gets a rate-aware line (he knows today's board rate);
      // after that, pick fresh from the full pool.
      const pool = (
        !tappedOnce.current && rateLines.length > 0 ? rateLines : [...BLESSINGS, ...rateLines]
      ).filter((b) => b !== prev);
      tappedOnce.current = true;
      return pool[Math.floor(Math.random() * pool.length)];
    });
  }

  if (!show) return null;

  // WhatsApp share — the blessing + today's rate + a link back. User-initiated,
  // opens WhatsApp's own composer (nothing is sent automatically).
  const shareText = blessing
    ? [
        `🪔 ${blessing.replace(/\*/g, "")}`,
        rate22k != null
          ? `Today's 22K in Kerala: ₹${rate22k.toLocaleString("en-IN")}/g${
              change != null && change !== 0
                ? ` (${change > 0 ? "▲" : "▼"} ₹${Math.abs(change).toLocaleString("en-IN")})`
                : ""
            }`
          : null,
        "Live rate: https://www.livegoldkerala.com",
      ]
        .filter(Boolean)
        .join("\n")
    : "";
  const waHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-0 select-none"
      aria-hidden={false}
    >
      {/* Walk = horizontal stroll; freezes while blessing. */}
      <div
        className={`mahabali-walk absolute bottom-1 left-0 ${blessing ? "is-blessing" : ""}`}
      >
        {/* Bob = walking bounce; also freezes while blessing. */}
        <div className={`mahabali-bob relative ${blessing ? "is-blessing" : ""}`}>
          {/* Pookalam petal burst — re-keyed per blessing so each tap re-fires. */}
          {petals.map((p) => (
            <span
              key={p.id}
              className="mahabali-petal left-1/2 top-5 h-2.5 w-1.5 rounded-full"
              style={
                {
                  background: p.color,
                  animationDelay: `${p.delay}s`,
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  "--rot": `${p.rot}deg`,
                } as React.CSSProperties
              }
            />
          ))}
          {/* Speech bubble */}
          {blessing && (
            <div className="animate-rise absolute bottom-[105%] left-1/2 w-56 -translate-x-1/3 rounded-2xl border border-amber-300 bg-white px-3.5 py-2.5 text-[13px] font-medium leading-snug text-zinc-800 shadow-xl dark:border-amber-500/50 dark:bg-zinc-900 dark:text-zinc-100">
              {blessing}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto mt-1.5 flex w-fit items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Share the blessing 🪔
              </a>
              <span className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 border-b border-r border-amber-300 bg-white dark:border-amber-500/50 dark:bg-zinc-900" />
            </div>
          )}

          <button
            type="button"
            onClick={bless}
            aria-label="Tap King Mahabali for an Onam blessing"
            title="Onaashamsakal! Tap me 🙏"
            className="pointer-events-auto block cursor-pointer bg-transparent p-0"
          >
            <MahabaliSvg />
          </button>

          {/* Send-him-away control */}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss the Onam greeting"
            className="pointer-events-auto absolute -right-1 top-0 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 bg-white/90 text-[10px] text-zinc-500 shadow hover:text-zinc-800 dark:border-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-400"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Stylised King Mahabali — original artwork modelled on the classic jolly
 * depiction: golden sun disc behind him, tall jewelled crown, big curled
 * mustache, bare round belly with gold ornaments, kasavu-bordered white mundu,
 * sash across the chest, mid-stride with one hand raised in blessing.
 */
function MahabaliSvg() {
  return (
    <svg
      viewBox="0 0 120 152"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-[64px] drop-shadow-md sm:w-[86px]"
      role="img"
      aria-label="King Mahabali"
    >
      <defs>
        <radialGradient id="mb-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd75e" />
          <stop offset="78%" stopColor="#fdb813" />
          <stop offset="100%" stopColor="#f2a50a" />
        </radialGradient>
        <linearGradient id="mb-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffdf6b" />
          <stop offset="55%" stopColor="#f3b93a" />
          <stop offset="100%" stopColor="#cf8a15" />
        </linearGradient>
      </defs>

      {/* Golden sun disc behind him */}
      <circle cx="60" cy="52" r="41" fill="url(#mb-sun)" opacity="0.95" />

      {/* Ground shadow */}
      <ellipse cx="60" cy="149" rx="26" ry="2.6" fill="#000" opacity="0.1" />

      {/* ---- Legs & sandals (mid-stride, behind mundu) ---- */}
      <rect x="48.5" y="138" width="6.5" height="8" rx="3" fill="#d67a40" />
      <rect x="65" y="138" width="6.5" height="8" rx="3" fill="#d67a40" />
      <ellipse cx="51" cy="147.5" rx="5.5" ry="2.3" fill="#8a5a2b" />
      <ellipse cx="68.5" cy="147.5" rx="5.5" ry="2.3" fill="#8a5a2b" />

      {/* ---- Mundu (white dhoti with kasavu border) ---- */}
      <path
        d="M37.5 101 Q33 122 37.5 140 L82.5 140 Q87 122 82.5 101 Q60 109 37.5 101 Z"
        fill="#fbf8ee"
        stroke="#e9e2cc"
        strokeWidth="0.8"
      />
      {/* pleats */}
      <path d="M60 108 L60 134" stroke="#e9e2cc" strokeWidth="1.3" />
      <path d="M49 104.5 L46.5 134 M71 104.5 L73.5 134" stroke="#efe9d6" strokeWidth="1" />
      {/* kasavu (gold) hem */}
      <path d="M37.8 135 L82.2 135" stroke="url(#mb-gold)" strokeWidth="2.4" />
      <path d="M38 138.5 L82 138.5" stroke="url(#mb-gold)" strokeWidth="1.2" />

      {/* ---- Torso (jolly potbelly) ---- */}
      <ellipse cx="60" cy="69" rx="18" ry="11" fill="#e08a4e" />
      <ellipse cx="60" cy="87" rx="23.5" ry="19" fill="#e08a4e" />
      {/* belly shading + navel */}
      <path d="M39 92 Q60 106.5 81 92 Q60 100.5 39 92 Z" fill="#cf7a3e" opacity="0.5" />
      <ellipse cx="60" cy="93" rx="1.3" ry="2" fill="#b9682f" />

      {/* Sash (angavastram) across the chest, gold-trimmed */}
      <path d="M43 58 L53 55 L76 95 L66.5 99 Z" fill="#faf3e3" stroke="#eadfc4" strokeWidth="0.7" />
      <path d="M45.5 57.2 L68.5 97.7" stroke="url(#mb-gold)" strokeWidth="1.6" />
      <path d="M50.5 55.8 L73.5 96" stroke="url(#mb-gold)" strokeWidth="1.6" />

      {/* Gold collar necklace + pendant */}
      <path d="M45.5 59 Q60 72 74.5 59" fill="none" stroke="url(#mb-gold)" strokeWidth="4.5" />
      <path d="M48.5 59 Q60 67.5 71.5 59" fill="none" stroke="#ffdf6b" strokeWidth="2" />
      <circle cx="60" cy="71.5" r="3.4" fill="url(#mb-gold)" stroke="#a86a10" strokeWidth="0.8" />
      <circle cx="60" cy="71.5" r="1.3" fill="#d3382c" />

      {/* ---- Resting arm (screen-left) with armlet + bangle ---- */}
      <path d="M43 63 Q31 72 34 88" fill="none" stroke="#e08a4e" strokeWidth="9" strokeLinecap="round" />
      <circle cx="34.5" cy="89.5" r="5.2" fill="#e08a4e" />
      <path d="M37.8 65.2 L45.2 68.8" stroke="url(#mb-gold)" strokeWidth="3.4" />
      <path d="M31.4 83.4 L38.4 84.8" stroke="url(#mb-gold)" strokeWidth="2.6" />

      {/* ---- Blessing arm (screen-right) — the animated group ---- */}
      <g className="mahabali-wave">
        <path d="M77 63 Q87 54 89.5 38" fill="none" stroke="#e08a4e" strokeWidth="9" strokeLinecap="round" />
        {/* armlet + bangles */}
        <path d="M76.5 59.5 L84 62.5" stroke="url(#mb-gold)" strokeWidth="3.4" />
        <path d="M85.6 41.2 L93 39.8" stroke="url(#mb-gold)" strokeWidth="2.4" />
        <path d="M85.2 44.4 L92.6 43" stroke="url(#mb-gold)" strokeWidth="2" />
        {/* open palm, fingers spread in blessing */}
        <circle cx="90.5" cy="30.5" r="6" fill="#e08a4e" />
        <path
          d="M86 27.5 L84 22.5 M89.5 25.5 L89 19.8 M93 26 L95.3 21 M85.5 32.5 L82 31"
          stroke="#e08a4e"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M87.5 31 Q90.5 33 93.5 31" fill="none" stroke="#c9743d" strokeWidth="1" />
      </g>

      {/* ---- Neck ---- */}
      <rect x="54.5" y="53.5" width="11" height="7" rx="3" fill="#d67a40" />

      {/* ---- Head ---- */}
      {/* hair puffs at the sides */}
      <path d="M46 31 Q43 34 43.6 40 Q44 46 47 49 L49 44 Q47.5 38 48.5 32 Z" fill="#241a12" />
      <path d="M74 31 Q77 34 76.4 40 Q76 46 73 49 L71 44 Q72.5 38 71.5 32 Z" fill="#241a12" />
      {/* ears + gold earrings */}
      <circle cx="45.3" cy="42.5" r="3" fill="#d67a40" />
      <circle cx="74.7" cy="42.5" r="3" fill="#d67a40" />
      <circle cx="45.3" cy="47" r="1.6" fill="none" stroke="url(#mb-gold)" strokeWidth="1.2" />
      <circle cx="74.7" cy="47" r="1.6" fill="none" stroke="url(#mb-gold)" strokeWidth="1.2" />
      {/* face */}
      <circle cx="60" cy="42" r="14.5" fill="#e08a4e" />
      {/* rosy cheeks */}
      <circle cx="49.5" cy="45.5" r="3" fill="#e2653f" opacity="0.45" />
      <circle cx="70.5" cy="45.5" r="3" fill="#e2653f" opacity="0.45" />
      {/* brows */}
      <path d="M49.5 34.5 Q53.5 33 57 34.6 M63 34.6 Q66.5 33 70.5 34.5" fill="none" stroke="#241a12" strokeWidth="1.8" strokeLinecap="round" />
      {/* big joyful eyes */}
      <ellipse cx="53.5" cy="39" rx="2.7" ry="3.2" fill="#fff" />
      <ellipse cx="66.5" cy="39" rx="2.7" ry="3.2" fill="#fff" />
      <circle cx="53.8" cy="39.6" r="1.6" fill="#3a2417" />
      <circle cx="66.8" cy="39.6" r="1.6" fill="#3a2417" />
      <circle cx="54.3" cy="39" r="0.5" fill="#fff" />
      <circle cx="67.3" cy="39" r="0.5" fill="#fff" />
      {/* bindi */}
      <circle cx="60" cy="33.5" r="1.7" fill="#d3382c" />
      {/* nose */}
      <path d="M60 40.5 L58.4 45.6 Q60 46.8 61.6 45.6 Z" fill="#c9743d" />
      {/* open laughing mouth (below the mustache) */}
      <path d="M53 50.8 Q60 58.5 67 50.8 Z" fill="#8a3f2a" />
      <path d="M54.5 51 Q60 53.6 65.5 51 Z" fill="#fff" />
      {/* big handlebar mustache, tips curling up */}
      <path
        d="M60 48 Q51 51.5 44.5 49.5 Q40.5 48 41.5 44 Q43.5 46.5 47.5 46.5 Q54.5 46.4 60 44.8 Q65.5 46.4 72.5 46.5 Q76.5 46.5 78.5 44 Q79.5 48 75.5 49.5 Q69 51.5 60 48 Z"
        fill="#241a12"
        transform="translate(0,-1.5)"
      />

      {/* ---- Tall jewelled crown ---- */}
      <path
        d="M45 26 L48.5 13 L54 21 L60 7 L66 21 L71.5 13 L75 26 Z"
        fill="url(#mb-gold)"
        stroke="#a86a10"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* finials */}
      <circle cx="48.5" cy="12" r="1.6" fill="url(#mb-gold)" stroke="#a86a10" strokeWidth="0.6" />
      <circle cx="60" cy="6.2" r="2" fill="url(#mb-gold)" stroke="#a86a10" strokeWidth="0.6" />
      <circle cx="71.5" cy="12" r="1.6" fill="url(#mb-gold)" stroke="#a86a10" strokeWidth="0.6" />
      {/* band + jewels */}
      <rect x="43.5" y="25" width="33" height="7" rx="2.5" fill="url(#mb-gold)" stroke="#a86a10" strokeWidth="0.9" />
      <circle cx="60" cy="28.5" r="2.3" fill="#d3382c" />
      <circle cx="51" cy="28.5" r="1.5" fill="#2f9e63" />
      <circle cx="69" cy="28.5" r="1.5" fill="#2f9e63" />

      {/* ---- Gold waist belt with medallion (over mundu top) ---- */}
      <path
        d="M37.5 96 Q60 103.5 82.5 96 L82.5 103 Q60 110.5 37.5 103 Z"
        fill="url(#mb-gold)"
        stroke="#a86a10"
        strokeWidth="0.7"
      />
      <circle cx="60" cy="103" r="4.2" fill="#ffdf6b" stroke="#a86a10" strokeWidth="0.8" />
      <circle cx="60" cy="103" r="1.5" fill="#d3382c" />
    </svg>
  );
}
