import { getAffiliateOffers } from "@/lib/affiliates";

/**
 * Inline Amazon gold/silver-coins CTA for buying-guide blog posts. Pulls the
 * tagged URL from the shared affiliates lib (single source of truth for the
 * Associate tag) and renders nothing if the offer isn't configured. Marked
 * rel="sponsored nofollow" with inline disclosure, per Google/ASCI rules.
 * `not-prose` keeps it out of the surrounding prose typography.
 */
export default function CoinCTA() {
  const amazon = getAffiliateOffers().find((o) => o.id === "gold-coins");
  if (!amazon) return null;

  return (
    <aside className="not-prose my-6 rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none" aria-hidden>🪙</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Buy hallmarked gold &amp; silver coins online
          </p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            Shop BIS-hallmarked 24K (999.9) gold and silver coins from trusted brands on Amazon —
            delivered to your door.
          </p>
          <a
            href={amazon.url}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2 text-sm font-semibold text-white no-underline shadow-md shadow-amber-500/25 transition-all hover:brightness-110"
          >
            Shop coins on Amazon <span aria-hidden>→</span>
          </a>
          <p className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-400">
            Sponsored — we may earn a commission if you buy, at no extra cost to you.
          </p>
        </div>
      </div>
    </aside>
  );
}
