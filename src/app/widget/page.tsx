import { Metadata } from "next";
import Link from "next/link";
import EmbedCode from "@/components/EmbedCode";

export const metadata: Metadata = {
  title: "Free Kerala Gold Rate Widget — Embed Today's Rate on Your Site",
  description:
    "Add a live 'Kerala gold rate today' widget to your website or blog for free. Copy one line of code to show the daily AKGSMA 22K & 24K board rate, auto-updated.",
  alternates: { canonical: "/widget" },
  openGraph: {
    title: "Free Kerala Gold Rate Widget",
    description: "Embed today's live Kerala gold rate (22K & 24K) on your site with one snippet.",
    url: "https://www.livegoldkerala.com/widget",
  },
};

const SNIPPET = `<iframe src="https://www.livegoldkerala.com/embed"
  width="340" height="180" loading="lazy"
  style="border:0;max-width:100%"
  title="Kerala Gold Rate Today"></iframe>
<p style="font:12px/1.4 sans-serif;margin:6px 0 0">
  <a href="https://www.livegoldkerala.com/">Kerala Gold Rate Today</a> by LiveGold Kerala
</p>`;

const SNIPPET_DARK = `<iframe src="https://www.livegoldkerala.com/embed?theme=dark"
  width="340" height="180" loading="lazy"
  style="border:0;max-width:100%"
  title="Kerala Gold Rate Today"></iframe>`;

export default function WidgetPage() {
  return (
    <>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Embed the Kerala Gold Rate on Your Site
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
          Run a jewellery, finance or Kerala-focused site? Add today&apos;s live <strong>AKGSMA
          board rate</strong> (22K &amp; 24K) for free. It updates automatically every day — just
          paste the snippet below where you want it to appear.
        </p>

        {/* Live preview */}
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Preview</h2>
          <div className="mt-3 flex justify-center rounded-2xl border border-zinc-200/70 bg-zinc-50/60 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
            <iframe
              src="/embed"
              width={340}
              height={180}
              loading="lazy"
              style={{ border: 0, maxWidth: "100%" }}
              title="Kerala Gold Rate Today — preview"
            />
          </div>
        </section>

        {/* Embed code */}
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Copy this code</h2>
          <div className="mt-3">
            <EmbedCode code={SNIPPET} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            The attribution link is part of the snippet — please keep it so visitors (and we) know
            where the rate comes from. Prefer a dark background? Use this iframe instead:
          </p>
          <div className="mt-3">
            <EmbedCode code={SNIPPET_DARK} />
          </div>
        </section>

        {/* Notes */}
        <section className="mt-8 rounded-2xl border border-amber-200/60 bg-amber-50/40 p-5 text-sm leading-relaxed text-zinc-600 dark:border-amber-900/40 dark:bg-amber-950/10 dark:text-zinc-300">
          <p className="font-bold text-zinc-800 dark:text-zinc-100">Good to know</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Free to use. The widget auto-updates with the daily Kerala board rate — no maintenance.</li>
            <li>It&apos;s responsive (<code>max-width:100%</code>) and works on any site or CMS that allows an iframe.</li>
            <li>Questions or want a different size/style? <Link href="/contact" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">Get in touch</Link>.</li>
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Today&apos;s Rate
          </Link>
          <Link href="/kerala-gold-price-trends" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Gold Price Trends →
          </Link>
        </div>
      </main>

    </>
  );
}
