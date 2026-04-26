import { MetadataRoute } from 'next'
import { KERALA_CITIES } from '@/components/DashboardLayout'
import { getAllPosts } from '@/lib/mdx'
import { createSupabaseReadClient } from '@/lib/supabase'

const BASE = 'https://www.livegoldkerala.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic slugs from DB in parallel
  const supabase = createSupabaseReadClient()
  const [templesRes, ornamentsRes] = await Promise.all([
    supabase.from('temples').select('slug'),
    supabase.from('ornaments').select('slug'),
  ])
  const templeSlugs = (templesRes.data ?? []).map((r) => r.slug)
  const ornamentSlugs = (ornamentsRes.data ?? []).map((r) => r.slug)

  const rootRoute: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  ]

  const cityRoutes: MetadataRoute.Sitemap = KERALA_CITIES.map((city) => ({
    url: `${BASE}/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const toolRoutes: MetadataRoute.Sitemap = [
    'pavan-to-gram-calculator',
    'gold-making-charge-calculator',
    'old-gold-exchange-calculator',
    'gold-import-duty-calculator',
    'hallmark-gold-calculator',
  ].map((tool) => ({
    url: `${BASE}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    ...getAllPosts().map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/about`,                      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE}/silver-rate-kerala`,          lastModified: new Date(), changeFrequency: 'daily'   as const, priority: 0.85 },
    { url: `${BASE}/gold-rate-history`,           lastModified: new Date(), changeFrequency: 'daily'   as const, priority: 0.75 },
    { url: `${BASE}/gold-rate-yesterday-kerala`,  lastModified: new Date(), changeFrequency: 'daily'   as const, priority: 0.7 },
    { url: `${BASE}/contact`,                     lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE}/privacy`,                     lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE}/terms`,                       lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE}/disclaimer`,                  lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

  const cultureRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/culture`,                              lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.85 },
    { url: `${BASE}/culture/festivals`,                    lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.8 },
    { url: `${BASE}/culture/temples`,                      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/culture/weddings`,                     lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/culture/ornaments`,                    lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.75 },
    { url: `${BASE}/culture/weddings/budget-calculator`,   lastModified: new Date(), changeFrequency: 'daily'   as const, priority: 0.85 },
    // Wedding community pages
    { url: `${BASE}/culture/weddings/hindu/nair`,          lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/hindu/namboothiri`,   lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/hindu/ezhava`,        lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/christian/syrian`,    lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/christian/latin`,     lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/christian/marthoma`,  lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/muslim/mappila`,      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/muslim/sunni`,        lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    // Glossary terms
    { url: `${BASE}/culture/weddings/glossary/thali`,      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/minnu`,      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/mahr`,       lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/talikettu`,  lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/minnukettu`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/nikah`,      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/valayidal`,  lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/manthrakodi`,lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/kumbla`,     lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/malarthi`,   lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.65 },
    // Individual temple pages (from DB)
    ...templeSlugs.map((slug) => ({
      url: `${BASE}/culture/temples/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    // Individual ornament pages (from DB)
    ...ornamentSlugs.map((slug) => ({
      url: `${BASE}/culture/ornaments/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  return [...rootRoute, ...toolRoutes, ...staticRoutes, ...cityRoutes, ...blogRoutes, ...cultureRoutes]
}
