import type { Verdict } from "@/lib/verdict";

const TONE_CLASSES: Record<Verdict["tone"], { dot: string; text: string; ring: string; bg: string }> = {
  emerald: {
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    ring: "ring-emerald-200/60 dark:ring-emerald-800/40",
    bg: "bg-emerald-50/60 dark:bg-emerald-950/20",
  },
  amber: {
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    ring: "ring-amber-200/60 dark:ring-amber-800/40",
    bg: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  coral: {
    dot: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-400",
    ring: "ring-rose-200/60 dark:ring-rose-800/40",
    bg: "bg-rose-50/60 dark:bg-rose-950/20",
  },
};

/**
 * "Should you buy today?" — surfaces the same verdict the daily news pages
 * compute, plus a 30-day percentile buy-timing signal. A daily reason to
 * come back; server-rendered from data already on hand.
 */
export default function BuyTodayCard({
  verdict,
  cheaperThanPct,
  windowDays,
}: {
  verdict: Verdict | null;
  /** % of the recent window whose rate was HIGHER than today's (i.e. today is cheaper than this share). */
  cheaperThanPct: number | null;
  windowDays: number;
}) {
  if (!verdict && cheaperThanPct === null) return null;
  const tone = TONE_CLASSES[verdict?.tone ?? "amber"];

  return (
    <section
      className={`rounded-2xl border border-zinc-200/70 p-5 shadow-sm ring-1 ring-inset dark:border-zinc-800 ${tone.ring} ${tone.bg}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        Should you buy today?
      </p>

      {verdict && (
        <p className="mt-2 flex items-center gap-2">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${tone.dot}`} aria-hidden />
          <span className={`text-lg font-extrabold tracking-tight ${tone.text}`}>{verdict.headline}</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">— {verdict.sub}</span>
        </p>
      )}

      {cheaperThanPct !== null && (
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {cheaperThanPct >= 50 ? (
            <>
              Today&apos;s 22K rate is <strong>cheaper than {cheaperThanPct}%</strong> of the last{" "}
              {windowDays} days.
            </>
          ) : (
            <>
              Today&apos;s 22K rate is <strong>higher than {100 - cheaperThanPct}%</strong> of the
              last {windowDays} days.
            </>
          )}
        </p>
      )}

      <p className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-400">
        Based on the recent board-rate range · Not financial advice
      </p>
    </section>
  );
}
