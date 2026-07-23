// Curated Amazon gold-product showcase (Associate links — tag baked in).
//
// Text-only cards by design: Amazon's Operating Agreement only permits product
// IMAGES via the Product Advertising API (needs 3 qualifying sales first) or the
// SiteStripe "Text+Image" tool. These are plain text links (linkCode=ll2), so we
// show the title + a "View on Amazon" link. Swap in image/price cards once
// PA-API access is granted. All links are rel="sponsored nofollow" with inline
// disclosure, per Google + ASCI rules.

type Product = { title: string; emoji: string; url: string };

const PRODUCTS: Product[] = [
  {
    title: "PNG Jewellers Vedhani Gold Coin",
    emoji: "🪙",
    url: "https://www.amazon.in/PNG-Jewellers-Vedhani-Gold-coin/dp/B0BYKSXHYK?dib=eyJ2IjoiMSJ9.tRL4X0RsEW1pyp7cKcjIO2u9j8vAvRPhDsPkD3EtH0vPvg56il9V_41Np7R465oR3VNj_rSreYP51tgPUSK1bw-b4XU8qYphu_6Uy2_4eikNOi3Uafv8-GCZIevD_uTSFAGubTzo6sUZvIvdHIi7FiO0Ak7O5ft-QoaWKvWk0bJk7a_8Eni8yYWM1h1LQX_sdZUDr5Qy7_yzFU8rWpqmP6A3SBN0X7IxRsYlm6tEPTR5EfFYOY4No6dlGiBMnv4QOoonnCsELrUW4V9SPIJSbfcw-uIjQdy27Vm8egN6ySw.Mrp24wVqDN9vTn4qydxy5pGqbQP64qk1wK1I_dpj6Vw&dib_tag=se&qid=1784776033&s=jewelry&sr=1-2&linkCode=ll2&tag=dashcamheros-21&linkId=39022a6b1eea00525ce84bca05008046&ref_=as_li_ss_tl",
  },
  {
    title: "Kalyan Jewellers Gold Ayodhya Pendant",
    emoji: "✨",
    url: "https://www.amazon.in/Kalyan-Jewellers-Purity-Ayodhya-Pendant/dp/B0DHVV7Y79?&linkCode=ll2&tag=dashcamheros-21&linkId=60a81b5ecd629e1e03021ab0fdaf9c23&ref_=as_li_ss_tl",
  },
  {
    title: "Kalyan Jewellers Gold Ganesh Pendant",
    emoji: "✨",
    url: "https://www.amazon.in/Kalyan-Jewellers-Purity-Ganesh-Pendant/dp/B0DHVXQYZB?&linkCode=ll2&tag=dashcamheros-21&linkId=911d5cb0c5406cf7eee297e2d734f0cb&ref_=as_li_ss_tl",
  },
  {
    title: "Kalyan Jewellers Gold Goddess Lakshmi Pendant",
    emoji: "✨",
    url: "https://www.amazon.in/KALYAN-JEWELLERS-Goddess-Lakshmi-Pendant/dp/B0DHVSJCXY?&linkCode=ll2&tag=dashcamheros-21&linkId=10709d2f6a7b333ff3482ed5f29fe7a6&ref_=as_li_ss_tl",
  },
  {
    title: "Kalyan Jewellers Gold Pendant",
    emoji: "✨",
    url: "https://www.amazon.in/KALYAN-JEWELLERS-Purity-Gold-Pendant/dp/B0DHVW65NP?&linkCode=ll2&tag=dashcamheros-21&linkId=e169d52dc6d5722b7e9ec82e5d6c8ada&ref_=as_li_ss_tl",
  },
];

export default function AmazonGoldProducts() {
  if (PRODUCTS.length === 0) return null;

  return (
    <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Gold coins &amp; pendants on Amazon</h2>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          Sponsored
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PRODUCTS.map((p) => (
          <a
            key={p.url}
            href={p.url}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="group flex items-center gap-3 rounded-xl border border-zinc-200/70 bg-zinc-50/50 p-3 transition-colors hover:border-amber-300 hover:bg-amber-50/50 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:border-amber-700/50 dark:hover:bg-amber-950/10"
          >
            <span className="text-2xl leading-none" aria-hidden>{p.emoji}</span>
            <span className="flex-1">
              <span className="block text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-100">{p.title}</span>
              <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 group-hover:gap-1.5 dark:text-amber-400">
                View on Amazon <span aria-hidden>→</span>
              </span>
            </span>
          </a>
        ))}
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        Sponsored links. We may earn a commission if you buy — at no extra cost to you. Prices &amp; availability shown on Amazon.
      </p>
    </section>
  );
}
