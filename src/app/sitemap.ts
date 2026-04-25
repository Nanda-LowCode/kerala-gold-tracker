import { MetadataRoute } from 'next'
import { KERALA_CITIES } from '@/components/DashboardLayout'
import { getAllPosts } from '@/lib/mdx'

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

  // 3. Tool pages
  const toolRoutes: MetadataRoute.Sitemap = [
    'pavan-to-gram-calculator',
    'gold-making-charge-calculator',
    'old-gold-exchange-calculator',
    'gold-import-duty-calculator',
    'hallmark-gold-calculator',
  ].map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // 4. Blog index
  const blogIndexRoute: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // 5. Blog posts
  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // 6. Static info pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/silver-rate-kerala`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.85 },
    { url: `${baseUrl}/gold-rate-history`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.75 },
    { url: `${baseUrl}/gold-rate-yesterday-kerala`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

  // 7. Culture hub pages
  const cultureRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/culture`,                               lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.85 },
    { url: `${baseUrl}/culture/festivals`,                     lastModified: new Date(), changeFrequency: 'weekly' as const,  priority: 0.8 },
    { url: `${baseUrl}/culture/temples`,                       lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/culture/weddings`,                      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/culture/ornaments`,                     lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.75 },
    { url: `${baseUrl}/culture/weddings/budget-calculator`,    lastModified: new Date(), changeFrequency: 'daily' as const,   priority: 0.85 },
    // Wedding community pages
    { url: `${baseUrl}/culture/weddings/hindu/nair`,           lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/culture/weddings/hindu/namboothiri`,    lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/culture/weddings/hindu/ezhava`,         lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/culture/weddings/christian/syrian`,     lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/culture/weddings/christian/latin`,      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/culture/weddings/christian/marthoma`,   lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/culture/weddings/muslim/mappila`,       lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/culture/weddings/muslim/sunni`,         lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    // Glossary terms
    { url: `${baseUrl}/culture/weddings/glossary/thali`,       lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${baseUrl}/culture/weddings/glossary/minnu`,       lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${baseUrl}/culture/weddings/glossary/mahr`,        lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${baseUrl}/culture/weddings/glossary/talikettu`,   lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${baseUrl}/culture/weddings/glossary/minnukettu`,  lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${baseUrl}/culture/weddings/glossary/nikah`,       lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${baseUrl}/culture/weddings/glossary/valayidal`,   lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${baseUrl}/culture/weddings/glossary/manthrakodi`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${baseUrl}/culture/weddings/glossary/kumbla`,      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${baseUrl}/culture/weddings/glossary/malarthi`,    lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
  ]

  return [...rootRoute, ...toolRoutes, ...staticRoutes, ...cityRoutes, ...blogIndexRoute, ...blogRoutes, ...cultureRoutes]
}
