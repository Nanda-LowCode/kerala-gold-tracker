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

// Editorial categories for the Knowledge Hub. Keyed by slug so post
// frontmatter stays untouched; new posts default to "Buying Guides".
export const POST_CATEGORIES = [
  "Buying Guides",
  "Festivals & Seasons",
  "Money & Tax",
  "Investing",
  "Rates & Data",
] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

const CATEGORY_MAP: Record<string, PostCategory> = {
  "22k-vs-24k-gold-which-to-buy-in-kerala": "Buying Guides",
  "best-time-to-buy-gold-in-kerala": "Buying Guides",
  "buy-gold-coins-kerala-guide": "Buying Guides",
  "how-to-check-gold-purity-at-home": "Buying Guides",
  "gold-hallmarking-bis-916-guide": "Buying Guides",
  "wedding-gold-shopping-kerala": "Buying Guides",
  "onam-gold-buying-guide-kerala-2026": "Festivals & Seasons",
  "akshaya-tritiya-2026-gold-buying-guide": "Festivals & Seasons",
  "should-you-buy-gold-in-karkidakam-kerala": "Festivals & Seasons",
  "gold-tax-gst-kerala-2026": "Money & Tax",
  "gst-on-gold-jewellery-india-2026": "Money & Tax",
  "gold-making-charges-explained-kerala": "Money & Tax",
  "how-to-read-gold-jewellery-bill-india": "Money & Tax",
  "how-to-sell-old-gold-kerala": "Money & Tax",
  "gold-loan-kerala-guide": "Money & Tax",
  "nri-gold-rules-india-2026": "Money & Tax",
  "digital-gold-india-guide": "Investing",
  "gold-etf-vs-physical-gold-india": "Investing",
  "gold-vs-fixed-deposit-india": "Investing",
  "sovereign-gold-bond-vs-physical-gold-india": "Investing",
  "gold-rate-per-pavan-kerala-explained": "Rates & Data",
  "kerala-board-rate-vs-global-spot-price": "Rates & Data",
  "kerala-gold-rate-history-2025-2026": "Rates & Data",
  "silver-rate-kerala-guide": "Rates & Data",
};

export interface PostMeta {
  title: string;
  date: string;
  description: string;
  slug: string;
  coverImage?: string;
  category: PostCategory;
  readingMinutes: number;
}

export interface Post extends PostMeta {
  content: string;
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): PostMeta {
  return {
    title: (data.title as string) ?? "",
    date: (data.date as string) ?? "",
    description: (data.description as string) ?? "",
    slug,
    coverImage: data.coverImage as string | undefined,
    category: CATEGORY_MAP[slug] ?? "Buying Guides",
    readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 220)),
  };
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
      const { data, content } = matter(raw);
      return toMeta(filename.replace(/\.mdx$/, ""), data, content);
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return { ...toMeta(slug, data, content), content };
}
