import { getAffiliateOffers } from "@/lib/affiliates";

/**
 * Tasteful, env-gated affiliate/lead-gen block. Renders nothing until at least
 * one offer link is configured (NEXT_PUBLIC_AFF_*), so no dead links ship.
 * Links are marked rel="sponsored nofollow" (Google's requirement for paid /
 * affiliate links) and disclosed inline.
 */
export default function AffiliateOffers() {
  const offers = getAffiliateOffers();
  if (offers.length === 0) return null;

  return (
    <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Gold services</h2>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
          Sponsored
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {offers.map((o) => (
          <a
            key={o.id}
            href={o.url}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="group flex flex-col rounded-xl border border-zinc-200/70 bg-zinc-50/50 p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/50 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:border-amber-700/50 dark:hover:bg-amber-950/10"
          >
            <span className="text-lg">{o.emoji}</span>
            <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">{o.title}</p>
            <p className="mt-0.5 flex-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{o.blurb}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 group-hover:gap-1.5 dark:text-amber-400">
              {o.cta} <span aria-hidden>→</span>
            </span>
          </a>
        ))}
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500">
        Sponsored links. We may earn a commission if you sign up — at no extra cost to you. Not financial advice.
      </p>
    </section>
  );
}
