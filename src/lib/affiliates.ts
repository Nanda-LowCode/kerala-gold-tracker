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

export function getAffiliateOffers(): AffiliateOffer[] {
  const offers: AffiliateOffer[] = [];

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
