"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/mdx";

/**
 * Category-filterable post grid for the Knowledge Hub. Client-side filter over
 * statically-rendered data — all posts are in the HTML for SEO; the chips just
 * toggle visibility.
 */
export default function BlogPostList({ posts }: { posts: PostMeta[] }) {
  const categories = [...new Set(posts.map((p) => p.category))];
  const [active, setActive] = useState<string | null>(null);

  const visible = active ? posts.filter((p) => p.category === active) : posts;

  return (
    <>
      {/* Category chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            active === null
              ? "bg-amber-600 text-white shadow-sm"
              : "border border-zinc-200 bg-white text-zinc-600 hover:border-amber-300 hover:text-amber-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
          }`}
        >
          All ({posts.length})
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(active === c ? null : c)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              active === c
                ? "bg-amber-600 text-white shadow-sm"
                : "border border-zinc-200 bg-white text-zinc-600 hover:border-amber-300 hover:text-amber-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Post grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-md shadow-amber-100/30 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-200/40 dark:border-zinc-800/70 dark:bg-zinc-900 dark:shadow-none dark:hover:border-zinc-700"
          >
            {post.coverImage && (
              <div className="relative h-36 w-full overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 336px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 backdrop-blur dark:bg-zinc-900/90 dark:text-amber-400">
                  {post.category}
                </span>
              </div>
            )}
            <div className="flex flex-1 flex-col p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                {new Date(post.date + "T00:00:00").toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                · {post.readingMinutes} min read
              </p>
              <h2 className="mt-1.5 flex-1 text-base font-bold leading-snug text-zinc-900 group-hover:text-amber-700 dark:text-zinc-100 dark:group-hover:text-amber-400">
                {post.title}
              </h2>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {post.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                Read article <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
