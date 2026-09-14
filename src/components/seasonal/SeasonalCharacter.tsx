"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CharacterConfig, Line } from "./types";

/**
 * Reusable seasonal-character shell.
 *
 * All motion, tap-to-bless, share, dismiss, rate-reactive picker, mobile
 * behaviour — generic. The character SVG, blessings, tone, dates and theme
 * come from the CharacterConfig passed in. That means adding a new
 * character next season is an art file + a config, not another 500 lines
 * of interaction code.
 *
 * See OnamMahabali (Onam 2026) as the reference config, or DhanterasLakshmi
 * (Diwali 2026) for a floating variant with a different tone.
 */

// Where he waits off-screen before each crossing. Kept close to the edge so he
// walks into view within a few seconds — on mobile especially, sessions are
// short and a long entrance means most visitors never see him.
const START_X = -18;

interface Petal {
  id: number;
  dx: number;
  dy: number;
  rot: number;
  delay: number;
  color: string;
}

function makePetals(colors: string[]): Petal[] {
  return Array.from({ length: 14 }, (_, i) => ({
    id: Date.now() + i,
    dx: Math.round(Math.random() * 140 - 70),
    dy: Math.round(-30 - Math.random() * 85),
    rot: Math.round(Math.random() * 360 - 180),
    delay: Math.random() * 0.15,
    color: colors[i % colors.length],
  }));
}

export default function SeasonalCharacter({
  character,
  rate22k = null,
  change = null,
}: {
  character: CharacterConfig;
  rate22k?: number | null;
  change?: number | null;
}) {
  const [show, setShow] = useState(false);
  const [blessing, setBlessing] = useState<Line | null>(null);
  const [petals, setPetals] = useState<Petal[]>([]);
  const [moving, setMoving] = useState(false);
  // On the Malayalam site each character speaks only Malayalam; elsewhere they
  // mix languages — closer to how Malayalis actually talk.
  const isMlSite = (usePathname() ?? "").startsWith("/ml");
  const tappedOnce = useRef(false);
  const walkerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const xRef = useRef(START_X);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blessingRef = useRef(false);

  const { window: charWindow, storageKey, blessings, buildRateLines, ariaLabel, tapHint,
    shareIntro, shareLabel, particleColors, hasGait = true, containerStyle, Art } = character;

  // Gate on mount: only render inside the window, and not if dismissed.
  useEffect(() => {
    const now = new Date();
    if (now < charWindow.start || now > charWindow.end) return;
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch {
      /* private mode — just show */
    }
    const t = setTimeout(() => setShow(true), 700);
    return () => clearTimeout(t);
  }, [charWindow.start, charWindow.end, storageKey]);

  // Auto-clear blessing so the stroll can resume.
  useEffect(() => {
    if (!blessing) return;
    const t = setTimeout(() => setBlessing(null), 8000);
    return () => clearTimeout(t);
  }, [blessing]);

  // Blessing freezes the walker mid-stride; releasing resumes.
  useEffect(() => {
    blessingRef.current = !!blessing;
    const a = animRef.current;
    if (!a) return;
    if (blessing && a.playState === "running") a.pause();
    else if (!blessing && a.playState === "paused") a.play();
  }, [blessing]);

  // The stroll: enter left, stop once or twice, walk on, exit right, breathe,
  // repeat — with randomised stops so no two crossings look alike. Web
  // Animations API (not CSS keyframes) so the blessing pause/resume lands
  // exactly where the character stands.
  useEffect(() => {
    if (!show) return;
    const el = walkerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "translateX(16px)"; // stand near the corner
      return;
    }
    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timerRef.current = setTimeout(resolve, ms);
      });

    async function walkTo(target: number) {
      const speed = 4.6 + Math.random() * 1.6; // vw/s — a stroll, not a march
      const duration = (Math.abs(target - xRef.current) / speed) * 1000;
      setMoving(true);
      const a = el!.animate(
        [
          { transform: `translateX(${xRef.current}vw)` },
          { transform: `translateX(${target}vw)` },
        ],
        { duration, easing: "cubic-bezier(0.3, 0.05, 0.7, 0.95)", fill: "forwards" },
      );
      animRef.current = a;
      if (blessingRef.current) a.pause();
      try {
        await a.finished;
      } catch {
        return;
      }
      el!.style.transform = `translateX(${target}vw)`;
      a.cancel();
      animRef.current = null;
      xRef.current = target;
      setMoving(false);
    }

    (async () => {
      while (!cancelled) {
        xRef.current = START_X;
        el.style.transform = `translateX(${START_X}vw)`;
        const stops =
          Math.random() < 0.5
            ? [10 + Math.random() * 14, 105]
            : [8 + Math.random() * 12, 46 + Math.random() * 22, 105];
        for (const target of stops) {
          if (cancelled) return;
          while (blessingRef.current) await wait(250);
          await walkTo(target);
          if (cancelled) return;
          if (target < 100) await wait(1700 + Math.random() * 1800);
        }
        await wait(5000 + Math.random() * 5000);
      }
    })();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      animRef.current?.cancel();
      animRef.current = null;
    };
  }, [show]);

  function dismiss(e: React.MouseEvent) {
    e.stopPropagation();
    setShow(false);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
  }

  function bless() {
    setPetals(makePetals(particleColors));
    const rateLines = buildRateLines(rate22k, change, isMlSite);
    setBlessing((prev) => {
      let candidates: Line[];
      if (!tappedOnce.current && rateLines.length > 0) {
        // First tap always reacts to today's board rate.
        candidates = rateLines;
      } else if (isMlSite) {
        candidates = [...blessings.ml, ...rateLines];
      } else {
        // Main site: English default with occasional Malayalam as a treat.
        candidates =
          Math.random() < 0.25 ? blessings.ml : [...blessings.en, ...rateLines];
      }
      const pool = candidates.filter((b) => b.text !== prev?.text);
      tappedOnce.current = true;
      return pool[Math.floor(Math.random() * pool.length)];
    });
  }

  if (!show) return null;

  // Share: blessing + today's rate + link back. User-initiated, opens the
  // WhatsApp composer — nothing sent automatically.
  const shareMl = blessing?.ml ?? false;
  const delta =
    change != null && change !== 0
      ? ` (${change > 0 ? "▲" : "▼"} ₹${Math.abs(change).toLocaleString("en-IN")})`
      : "";
  const shareText = blessing
    ? [
        `${shareIntro} ${blessing.text.replace(/\*/g, "")}`,
        rate22k != null
          ? shareMl
            ? `ഇന്നത്തെ കേരള 22K സ്വർണ്ണവില: ₹${rate22k.toLocaleString("en-IN")}/ഗ്രാം${delta}`
            : `Today's 22K in Kerala: ₹${rate22k.toLocaleString("en-IN")}/g${delta}`
          : null,
        shareMl
          ? "തത്സമയ നിരക്ക്: https://www.livegoldkerala.com"
          : "Live rate: https://www.livegoldkerala.com",
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
      <div
        ref={walkerRef}
        className="absolute left-0 will-change-transform"
        style={{
          transform: `translateX(${START_X}vw)`,
          // Clear the iOS home indicator so feet aren't cut off on phones.
          bottom: "calc(0.25rem + env(safe-area-inset-bottom, 0px))",
          ...containerStyle,
        }}
      >
        {/* Gait class only applies when the character opts in (mb-moving is
            the shared CSS hook — reused across all characters that walk). */}
        <div className={hasGait && moving && !blessing ? "mb-moving" : ""}>
          <div className="mahabali-bob relative">
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
            {blessing && (
              <div
                lang={blessing.ml ? "ml" : undefined}
                className={`animate-rise absolute bottom-[105%] left-1/2 -translate-x-1/3 rounded-2xl border border-amber-300 bg-white px-3.5 py-2.5 font-medium text-zinc-800 shadow-xl dark:border-amber-500/50 dark:bg-zinc-900 dark:text-zinc-100 ${
                  blessing.ml ? "w-64 text-[13px] leading-relaxed" : "w-56 text-[13px] leading-snug"
                }`}
              >
                {blessing.text}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="pointer-events-auto mt-1.5 flex w-fit items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                  {blessing.ml ? shareLabel.ml : shareLabel.en}
                </a>
                <span className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 border-b border-r border-amber-300 bg-white dark:border-amber-500/50 dark:bg-zinc-900" />
              </div>
            )}

            <button
              type="button"
              onClick={bless}
              aria-label={isMlSite ? ariaLabel.ml : ariaLabel.en}
              title={isMlSite ? tapHint.ml : tapHint.en}
              className="pointer-events-auto block cursor-pointer bg-transparent p-0"
            >
              <Art />
            </button>

            <button
              type="button"
              onClick={dismiss}
              aria-label={isMlSite ? "ദൂരെ പോകൂ" : "Dismiss the seasonal greeting"}
              className="pointer-events-auto absolute -right-1 top-0 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 bg-white/90 text-[10px] text-zinc-500 shadow hover:text-zinc-800 dark:border-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-400"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
