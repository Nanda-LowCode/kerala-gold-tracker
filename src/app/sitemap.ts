import { MetadataRoute } from 'next'
import { KERALA_CITIES } from '@/components/DashboardLayout'
import { getAllPosts } from '@/lib/mdx'
import { createSupabaseReadClient } from '@/lib/supabase'

const BASE = 'https://www.livegoldkerala.com'

// Only temples with full rich content — stubs are noindexed and excluded
const RICH_TEMPLE_SLUGS = ['guruvayur', 'sabarimala', 'padmanabhaswamy']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic slugs from DB in parallel
  const supabase = createSupabaseReadClient()
  const [ornamentsRes, newsDatesRes] = await Promise.all([
    supabase.from('ornaments').select('slug, description_en, symbolism_en'),
    supabase.from('daily_gold_rates').select('date, consensus_sources').eq('city', 'Kochi'),
  ])
  // Only include ornaments that have real content (not stubs)
  const ornamentSlugs = (ornamentsRes.data ?? [])
    .filter((r) => r.description_en || r.symbolism_en)
    .map((r) => r.slug)
  const allRateRows = (newsDatesRes.data ?? []) as { date: string; consensus_sources: string | null }[]
  // News pages: real board-rate dates only (exclude estimated backfill).
  const newsDates = allRateRows
    .filter((r) => r.consensus_sources !== 'backfill-yahoo-calibrated')
    .map((r) => r.date)

  const rootRoute: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  ]

  const cityRoutes: MetadataRoute.Sitemap = KERALA_CITIES.map((city) => ({
    url: `${BASE}/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const TOOLS_DATE = new Date('2026-05-01')
  const toolRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/tools`, lastModified: TOOLS_DATE, changeFrequency: 'monthly' as const, priority: 0.85 },
    ...[
      'pavan-to-gram-calculator',
      'gold-making-charge-calculator',
      'old-gold-exchange-calculator',
      'gold-import-duty-calculator',
      'hallmark-gold-calculator',
    ].map((tool) => ({
      url: `${BASE}/tools/${tool}`,
      lastModified: TOOLS_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ]

  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    ...getAllPosts().map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  const LAUNCH_DATE = new Date('2026-04-10')

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/jewellers`,                   lastModified: new Date(),   changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/about`,                      lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE}/silver-rate-kerala`,          lastModified: new Date(),   changeFrequency: 'daily'   as const, priority: 0.85 },
    { url: `${BASE}/gold-rate-history`,           lastModified: new Date(),   changeFrequency: 'daily'   as const, priority: 0.75 },
    { url: `${BASE}/gold-rate-yesterday-kerala`,  lastModified: new Date(),   changeFrequency: 'daily'   as const, priority: 0.7 },
    { url: `${BASE}/contact`,                     lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE}/privacy`,                     lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE}/terms`,                       lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE}/disclaimer`,                  lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

  const cultureRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/culture`,                              lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.85 },
    { url: `${BASE}/culture/festivals`,                    lastModified: LAUNCH_DATE,  changeFrequency: 'weekly'  as const, priority: 0.8 },
    { url: `${BASE}/culture/temples`,                      lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/culture/weddings`,                     lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/culture/ornaments`,                    lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.75 },
    { url: `${BASE}/culture/weddings/budget-calculator`,   lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.85 },
    // Wedding community pages
    { url: `${BASE}/culture/weddings/hindu/nair`,          lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/hindu/namboothiri`,   lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/hindu/ezhava`,        lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/christian/syrian`,    lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/christian/latin`,     lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/christian/marthoma`,  lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/muslim/mappila`,      lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/culture/weddings/muslim/sunni`,        lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.7 },
    // Glossary terms
    { url: `${BASE}/culture/weddings/glossary/thali`,      lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/minnu`,      lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/mahr`,       lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/talikettu`,  lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/minnukettu`, lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/nikah`,      lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/valayidal`,  lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/manthrakodi`,lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/kumbla`,     lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: `${BASE}/culture/weddings/glossary/malarthi`,   lastModified: LAUNCH_DATE,  changeFrequency: 'monthly' as const, priority: 0.65 },
    // Individual temple pages — only those with full rich content
    ...RICH_TEMPLE_SLUGS.map((slug) => ({
      url: `${BASE}/culture/temples/${slug}`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    // Individual ornament pages — only those with description or symbolism content
    ...ornamentSlugs.map((slug) => ({
      url: `${BASE}/culture/ornaments/${slug}`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  const newsRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/news`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
    ...newsDates.map((date) => ({
      url: `${BASE}/news/${date}`,
      lastModified: new Date(date),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]

  // Historical year pages (/gold-rate-history/[year]) — one per year of data
  // (includes backfilled years, unlike the news routes above).
  const years = [...new Set(allRateRows.map((r) => r.date.slice(0, 4)))].sort()
  const yearRoutes: MetadataRoute.Sitemap = years.map((y) => ({
    url: `${BASE}/gold-rate-history/${y}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...rootRoute, ...toolRoutes, ...staticRoutes, ...cityRoutes, ...blogRoutes, ...cultureRoutes, ...newsRoutes, ...yearRoutes]
}
