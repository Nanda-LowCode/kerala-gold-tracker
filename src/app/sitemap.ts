import { MetadataRoute } from 'next'
import { KERALA_CITIES } from '@/components/DashboardLayout'
import { getAllPosts } from '@/lib/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://livegoldkerala.com'

  // 1. The main homepage route (Default Kochi)
  const rootRoute: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  // 2. The dynamic programmatic SEO city pages
  const cityRoutes: MetadataRoute.Sitemap = KERALA_CITIES.map((city) => ({
    url: `${baseUrl}/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // 3. Blog posts
  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...rootRoute, ...cityRoutes, ...blogRoutes]
}
