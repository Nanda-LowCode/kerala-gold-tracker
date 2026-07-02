import { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import BlogPostList from "@/components/BlogPostList";

export const metadata: Metadata = {
  title: "Gold Knowledge Hub — Kerala Gold Buying, Tax & Investing Guides",
  description:
    "Expert guides on buying gold in Kerala: making charges, GST and tax, hallmarking, pavan rates, festival buying (Onam, Akshaya Tritiya), gold loans, digital gold and investing.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Gold Knowledge Hub — Kerala Gold Guides",
    description:
      "Guides on buying gold in Kerala: making charges, tax, hallmarking, festival buying and investing.",
    url: "https://www.livegoldkerala.com/blog",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-14">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
        Gold Knowledge Hub
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        {posts.length} expert guides on gold rates, buying, tax and investing in Kerala — browse by
        topic below.
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-sm text-zinc-400">No articles yet. Check back soon!</p>
      ) : (
        <BlogPostList posts={posts} />
      )}
    </main>
  );
}
