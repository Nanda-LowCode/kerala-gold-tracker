const faqs = [
  {
    q: "What is today's gold rate in Kochi, Kerala?",
    a: "Today's gold rate in Kochi is updated daily on this page. We display both 22 Karat (916 purity) and 24 Karat (999 purity) prices per gram and per pavan (8 grams), sourced from Malabar Gold & Diamonds.",
  },
  {
    q: "How often are gold rates updated?",
    a: "Gold rates on this site are updated twice daily — at 10:30 AM and 4:30 PM IST, Monday through Saturday. Gold markets are closed on Sundays.",
  },
  {
    q: "What is the difference between 22K and 24K gold?",
    a: "24 Karat gold is 99.9% pure gold and is softer, typically used for gold coins and bars. 22 Karat gold is 91.6% pure gold mixed with other metals for durability, making it the standard for jewelry in Kerala.",
  },
  {
    q: "What is a pavan (sovereign) of gold?",
    a: "In Kerala, a pavan (also called sovereign) is a traditional unit of gold measurement equal to 8 grams. It is the most common unit used when buying gold jewelry in Kerala.",
  },
  {
    q: "Why do gold rates vary between cities in Kerala?",
    a: "Gold rates can slightly vary between cities due to differences in local taxes, transportation costs, and jeweler margins. However, the base gold rate set by the India Bullion and Jewellers Association (IBJA) remains the same across the state.",
  },
  {
    q: "What factors influence gold prices in Kerala?",
    a: "Gold prices in Kerala are influenced by international gold prices (set in USD), the USD-INR exchange rate, domestic demand (especially during wedding and festival seasons), import duties, and GST. Global events, inflation, and central bank policies also play a role.",
  },
  {
    q: "Is this the final price I pay at a jewelry shop?",
    a: "No. The rates shown here are the base gold rates. At a jewelry shop, you will additionally pay making charges (varies by design), 3% GST on the gold value, and hallmarking charges. The final price depends on the jeweler and the complexity of the design.",
  },
  {
    q: "When is the best time to buy gold in Kerala?",
    a: "Gold prices fluctuate daily. Historically, prices tend to dip during off-seasons (outside wedding and festival periods). Many people buy on auspicious days like Akshaya Tritiya. Tracking the price trend on this page can help you find a good entry point.",
  },
];

// Static JSON-LD for FAQ structured data (no user input — safe to inline)
const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
});

export default function FAQ() {
  return (
    <section className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Frequently Asked Questions
      </h2>
      <dl className="divide-y divide-gray-100">
        {faqs.map((faq, i) => (
          <div key={i} className="py-4 first:pt-0 last:pb-0">
            <dt className="text-sm font-medium text-gray-900">{faq.q}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-gray-600">
              {faq.a}
            </dd>
          </div>
        ))}
      </dl>
      {/* eslint-disable-next-line -- static hardcoded JSON-LD, no user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
    </section>
  );
}
