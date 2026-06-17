import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// City "today's rate" posts that now 301 to their city pages (see next.config.ts).
// Excluded from the blog index, related posts, and sitemap to end cannibalisation.
const RETIRED_SLUGS = new Set([
  "gold-rate-kozhikode-today",
  "gold-rate-thrissur-today",
  "gold-rate-trivandrum-today",
]);

export interface PostMeta {
  title: string;
  date: string;
  description: string;
  slug: string;
  coverImage?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    // Hidden from the blog index/sitemap: these city "today's rate" posts are
    // 301-redirected to their city pages (see next.config.ts) to avoid
    // cannibalising them. Files kept in-repo so the change is reversible.
    .filter((f) => !RETIRED_SLUGS.has(f.replace(/\.mdx$/, "")))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        title: data.title ?? "",
        date: data.date ?? "",
        description: data.description ?? "",
        slug: filename.replace(/\.mdx$/, ""),
        coverImage: data.coverImage,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    title: data.title ?? "",
    date: data.date ?? "",
    description: data.description ?? "",
    slug,
    coverImage: data.coverImage,
    content,
  };
}
