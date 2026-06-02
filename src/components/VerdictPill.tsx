import type { Verdict } from "@/lib/verdict";

const TONE_CLASSES = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-900/50",
    text: "text-emerald-700 dark:text-emerald-400",
    glow: "shadow-emerald-300/30",
    dot: "bg-emerald-500",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-900/50",
    text: "text-amber-700 dark:text-amber-400",
    glow: "shadow-amber-300/30",
    dot: "bg-amber-500",
  },
  coral: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-900/50",
    text: "text-red-700 dark:text-red-400",
    glow: "shadow-red-300/30",
    dot: "bg-red-500",
  },
} as const;

export function VerdictPill({
  verdict,
  size = "lg",
}: {
  verdict: Verdict;
  size?: "lg" | "sm";
}) {
  const tone = TONE_CLASSES[verdict.tone];

  if (size === "sm") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone.bg} ${tone.border} ${tone.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
        {verdict.headline}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex flex-col items-start gap-0.5 rounded-2xl border px-4 py-2.5 shadow-md ${tone.bg} ${tone.border} ${tone.text} ${tone.glow}`}
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${tone.dot}`}
          />
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${tone.dot}`}
          />
        </span>
        <span className="text-sm font-black uppercase tracking-widest">
          {verdict.headline}
        </span>
      </div>
      <p className="text-xs font-medium opacity-80">{verdict.sub}</p>
    </div>
  );
}

export function VerdictDot({ verdict }: { verdict: Verdict }) {
  const tone = TONE_CLASSES[verdict.tone];
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${tone.dot}`}
      title={verdict.headline}
      aria-label={verdict.headline}
    />
  );
}
