import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";

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
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const dateFormatted = new Date(post.date + "T00:00:00").toLocaleDateString(
    "en-IN",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

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
            href="/blog"
            className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50"
          >
            &larr; All Articles
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-14">
        <article>
          <header className="mb-8 border-b border-zinc-100 pb-6">
            <time className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              {dateFormatted}
            </time>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
              {post.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              {post.description}
            </p>
          </header>

          <div className="prose prose-amber lg:prose-xl mx-auto prose-headings:tracking-tight prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline">
            <MDXRemote source={post.content} />
          </div>
        </article>

        <div className="mt-12 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-6 text-center">
          <p className="text-sm font-medium text-zinc-700">
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

      <footer className="border-t border-zinc-200/60 bg-white/50 py-6 text-center text-xs text-zinc-400">
        <p>&copy; 2026 LiveGold Kerala</p>
      </footer>
    </>
  );
}
