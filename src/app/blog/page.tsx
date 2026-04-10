import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Gold Knowledge Hub",
  description:
    "Learn about gold rates, Kerala board pricing, buying tips, and more.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">✨</span>
            <div>
              <span className="text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
                LiveGold{" "}
                <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                  Kerala
                </span>
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50"
          >
            Today&apos;s Rate &rarr;
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-14">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
          Gold Knowledge Hub
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Expert articles on gold rates, pricing, and buying tips in Kerala.
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 text-center text-sm text-zinc-400">
            No articles yet. Check back soon!
          </p>
        ) : (
          <div className="mt-8 grid gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-md shadow-amber-100/30 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-200/40"
              >
                <time className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  {new Date(post.date + "T00:00:00").toLocaleDateString(
                    "en-IN",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
                <h2 className="mt-1.5 text-lg font-bold text-zinc-900 group-hover:text-amber-700">
                  {post.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                  {post.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                  Read article
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200/60 bg-white/50 py-6 text-center text-xs text-zinc-400">
        <p>&copy; 2026 LiveGold Kerala</p>
      </footer>
    </>
  );
}
