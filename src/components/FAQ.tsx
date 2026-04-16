export default function FAQ({ cityName = "Kochi" }: { cityName?: string }) {
  const faqs = [
    {
      q: `What is today's gold rate in ${cityName}, Kerala?`,
      a: `Today's gold rate in ${cityName} is updated daily on this page. We display both 22 Karat (916 purity) and 24 Karat (999 purity) prices per gram and per pavan (8 grams), sourced directly.`,
    },
    {
      q: `How often are gold rates updated in ${cityName}?`,
      a: `Gold rates on this site for ${cityName} are updated twice daily — at 10:30 AM and 4:30 PM IST, Monday through Saturday. Gold markets in Kerala are closed on Sundays.`,
    },
    {
      q: "What is the difference between 22K and 24K gold?",
      a: "24 Karat gold is 99.9% pure gold and is softer, typically used for gold coins and bars. 22 Karat gold is 91.6% pure gold mixed with other metals for durability, making it the standard for jewelry.",
    },
    {
      q: "What is a pavan (sovereign) of gold?",
      a: "In Kerala, a pavan (also called sovereign) is a traditional unit of gold measurement equal to 8 grams. It is the most common unit used when buying gold jewelry in showrooms.",
    },
    {
      q: `Why do gold rates vary between cities like ${cityName}?`,
      a: `Gold rates can slightly vary between cities like ${cityName} due to differences in local taxes, transportation costs, and jeweler margins. However, the base gold rate set by the India Bullion and Jewellers Association remains the same across the state.`,
    },
    {
      q: `What factors influence gold prices in ${cityName}?`,
      a: `Gold prices in ${cityName} are influenced by international gold prices (set in USD), the USD-INR exchange rate, local domestic demand (especially during weddings), import duties, and GST.`,
    },
    {
      q: "Is this the final price I pay at a jewelry shop?",
      a: "No. The rates shown here are the base gold rates. At a jewelry shop, you will additionally pay making charges (varies by design), 3% GST on the gold value, and hallmarking charges.",
    },
    {
      q: `When is the best time to buy gold in ${cityName}?`,
      a: `Gold prices fluctuate daily. Historically, prices tend to dip during off-seasons. Many people in ${cityName} buy on auspicious days like Akshaya Tritiya. Tracking the price trend on this page can help you find a good entry point.`,
    },
  ];

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  });

  return (
    <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
        Frequently Asked Questions
      </h2>
      <dl className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
        {faqs.map((faq, i) => (
          <div key={i} className="py-4 first:pt-0 last:pb-0">
            <dt className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{faq.q}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {faq.a}
            </dd>
          </div>
        ))}
      </dl>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
    </section>
  );
}
