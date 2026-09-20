import { activeCharacter } from "./registry";

/**
 * Above-the-H1 seasonal ornamentation for the Diwali window.
 *
 * Two pieces, both gated on the Lakshmi window:
 * - A row of three small oil lamps (diyas) with a live flame flicker.
 *   The centrepiece Diwali icon that a gold ribbon alone can't say.
 * - On Dhanteras day itself, a small "Today is Dhanteras" badge appears
 *   above the diyas — the year's single most auspicious day for gold
 *   deserves more than a background wash.
 *
 * Renders nothing outside the Lakshmi window. Motion respects
 * prefers-reduced-motion (see .diya-flame in globals.css).
 */

// Dhanteras 2026: 8 November. Bump next year alongside the Lakshmi window.
const DHANTERAS_DATE = "2026-11-08";

function todayInIST(): string {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

export default function DhanterasOrnament() {
  const char = activeCharacter();
  if (char?.id !== "lakshmi") return null;

  const isDhanterasDay = todayInIST() === DHANTERAS_DATE;

  return (
    <div className="mb-3 flex flex-col items-center gap-2">
      {isDhanterasDay && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800 shadow-sm ring-1 ring-inset ring-amber-200/50 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/50">
          🪔 Today is Dhanteras · Most auspicious day for gold
        </span>
      )}
      <DiyaRow />
    </div>
  );
}

/**
 * Three lit diyas in a row. Each carries an independent animation-delay
 * so the flames don't pulse in lockstep — that's the difference between
 * "living" and "stamped".
 */
function DiyaRow() {
  // Staggered delays chosen to be prime-ish fractions of the 1.8s period —
  // ensures the three flames never re-align exactly.
  const delays = [0, 0.55, 1.15];
  return (
    <div className="flex items-end gap-3 sm:gap-4" aria-hidden>
      {delays.map((d, i) => (
        <Diya key={i} delay={d} />
      ))}
    </div>
  );
}

function Diya({ delay }: { delay: number }) {
  return (
    <svg
      viewBox="0 0 30 42"
      className="h-7 w-auto sm:h-8"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Diya (oil lamp)"
    >
      <defs>
        <radialGradient id={`flame-${delay}`} cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor="#fffbe6" />
          <stop offset="35%" stopColor="#fde047" />
          <stop offset="70%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.7" />
        </radialGradient>
        <linearGradient id={`bowl-${delay}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a97253" />
          <stop offset="50%" stopColor="#7a3f22" />
          <stop offset="100%" stopColor="#4a2306" />
        </linearGradient>
      </defs>

      {/* Flame — teardrop, flickers via CSS class */}
      <g
        className="diya-flame"
        style={{ animationDelay: `${delay}s` }}
        transform="translate(15 22)"
      >
        {/* soft outer glow */}
        <ellipse cx="0" cy="-6" rx="6" ry="10" fill={`url(#flame-${delay})`} opacity="0.35" />
        {/* main flame */}
        <path d="M 0 -18 Q -4.5 -6 0 -2 Q 4.5 -6 0 -18 Z" fill={`url(#flame-${delay})`} />
        {/* inner brighter core */}
        <path d="M 0 -12 Q -2 -5 0 -3 Q 2 -5 0 -12 Z" fill="#fef08a" opacity="0.85" />
      </g>

      {/* Wick */}
      <line x1="15" y1="22" x2="15" y2="28" stroke="#3f3f46" strokeWidth="0.9" strokeLinecap="round" />

      {/* Bowl — clay oil lamp */}
      <path
        d="M 2 28 Q 15 42 28 28 Q 24 32 15 32 Q 6 32 2 28 Z"
        fill={`url(#bowl-${delay})`}
        stroke="#3d1b04"
        strokeWidth="0.4"
      />
      {/* Bowl rim highlight */}
      <path d="M 3 28 Q 15 30 27 28" fill="none" stroke="#d9a679" strokeWidth="0.8" />
      {/* Small oil pool suggestion */}
      <ellipse cx="15" cy="29.2" rx="9" ry="1.1" fill="#3d1b04" opacity="0.55" />
    </svg>
  );
}
