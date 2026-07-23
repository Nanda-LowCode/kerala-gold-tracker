// Affiliate / lead-gen offers — env-gated so nothing renders until you paste
// your real referral links (set these in Vercel → Environment Variables, then
// redeploy; NEXT_PUBLIC_* are inlined at build time). See docs/affiliate-setup.md
// for which programs to join. Links are rendered rel="sponsored nofollow".

export type AffiliateOffer = {
  id: string;
  url: string;
  emoji: string;
  title: string;
  blurb: string;
  cta: string;
};

// Amazon.in gold & silver coins store. We only need the Associate tag from you;
// the URL is built here. Set NEXT_PUBLIC_AMAZON_TAG to your tracking id (e.g.
// "livegoldkerala-21") from affiliate-program.amazon.in.
const AMAZON_GOLD_COINS_BASE =
  "https://www.amazon.in/gold-silver-coins/b?ie=UTF8&node=8609763031";

export function getAffiliateOffers(): AffiliateOffer[] {
  const offers: AffiliateOffer[] = [];

  // Amazon.in Associates tag. Env var wins (set NEXT_PUBLIC_AMAZON_TAG in Vercel
  // to override, e.g. a site-specific tracking id); falls back to the account tag
  // so the offer ships without needing an env var. The tag is public by design.
  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_TAG ?? "dashcamheros-21";
  if (amazonTag) {
    offers.push({
      id: "gold-coins",
      url: `${AMAZON_GOLD_COINS_BASE}&tag=${encodeURIComponent(amazonTag)}`,
      emoji: "🪙",
      title: "Buy gold & silver coins",
      blurb: "Shop hallmarked 24K (999.9) gold and silver coins online — trusted brands, delivered to your door.",
      cta: "Shop on Amazon",
    });
  }

  const goldLoan = process.env.NEXT_PUBLIC_AFF_GOLD_LOAN;
  if (goldLoan) {
    offers.push({
      id: "gold-loan",
      url: goldLoan,
      emoji: "🏦",
      title: "Gold loan",
      blurb: "Need cash against your gold? Compare gold-loan options with competitive rates and quick disbursal.",
      cta: "Check eligibility",
    });
  }

  const digitalGold = process.env.NEXT_PUBLIC_AFF_DIGITAL_GOLD;
  if (digitalGold) {
    offers.push({
      id: "digital-gold",
      url: digitalGold,
      emoji: "📈",
      title: "Buy digital gold",
      blurb: "Start small — invest in 24K digital gold from as little as ₹10. No locker, no making charges.",
      cta: "Start investing",
    });
  }

  return offers;
}
