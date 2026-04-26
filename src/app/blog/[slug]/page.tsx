import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, type PostMeta } from "@/lib/mdx";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const allPosts = getAllPosts();
  const post = allPosts.find((p) => p.slug === slug) ? getPostBySlug(slug) : null;
  if (!post) notFound();

  const relatedPosts = allPosts
    .filter((p: PostMeta) => p.slug !== slug)
    .slice(0, 3);

  const dateFormatted = new Date(post.date + "T00:00:00").toLocaleDateString(
    "en-IN",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

  // Escape < and > so MDX content can never break out of the <script> tag
  const articleJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://www.livegoldkerala.com/blog/${slug}`,
    author: { "@type": "Organization", name: "LiveGold Kerala", url: "https://www.livegoldkerala.com" },
    publisher: {
      "@type": "Organization",
      name: "LiveGold Kerala",
      url: "https://www.livegoldkerala.com",
      logo: { "@type": "ImageObject", url: "https://www.livegoldkerala.com/opengraph-image" },
    },
  }).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd }} />
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">✨</span>
            <div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg">
                LiveGold{" "}
                <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                  Kerala
                </span>
              </span>
            </div>
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            &larr; All Articles
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-14">
        <article>
          <header className="mb-8 border-b border-zinc-100 pb-6 dark:border-zinc-800">
            <time className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              {dateFormatted}
            </time>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
              {post.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {post.description}
            </p>
          </header>

          <div className="prose prose-amber lg:prose-xl mx-auto prose-headings:tracking-tight prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline dark:prose-invert dark:prose-a:text-amber-400">
            <MDXRemote source={post.content} />
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-bold tracking-tight text-zinc-900">
              Read Next
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {relatedPosts.map((p: PostMeta) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-xl border border-zinc-200/70 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-900 dark:shadow-none dark:hover:border-zinc-700"
                >
                  <time className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                    {new Date(p.date + "T00:00:00").toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <h3 className="mt-1 text-sm font-semibold leading-snug text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-6 text-center dark:border-amber-900/40 dark:bg-amber-950/20">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Want to check today&apos;s gold rate?
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition-all hover:brightness-110"
          >
            View Live Gold Rate &rarr;
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 bg-white/50 pt-6 pb-8 dark:border-zinc-800/60 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6 flex flex-wrap justify-center gap-3 text-xs font-medium">
            <Link href="/" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">Today&apos;s Rate</Link>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <Link href="/tools/gold-making-charge-calculator" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">Making Charge Calculator</Link>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <Link href="/tools/old-gold-exchange-calculator" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">Old Gold Exchange</Link>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <Link href="/tools/gold-import-duty-calculator" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">NRI Import Duty</Link>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <Link href="/blog" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">All Articles</Link>
          </div>
          <div className="text-center text-xs text-zinc-400">
            <p>&copy; 2026 LiveGold Kerala</p>
          </div>
        </div>
      </footer>
    </>
  );
}
