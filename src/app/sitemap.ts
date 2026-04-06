import { MetadataRoute } from 'next'
import { KERALA_CITIES } from '@/components/DashboardLayout'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.livegoldkerala.com'

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

  return [...rootRoute, ...cityRoutes]
}
