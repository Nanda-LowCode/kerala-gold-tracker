import { MetadataRoute } from 'next'
import { KERALA_CITIES } from '@/components/DashboardLayout'
import { getAllPosts } from '@/lib/mdx'
import { createSupabaseReadClient } from '@/lib/supabase'

const BASE = 'https://www.livegoldkerala.com'

// Only temples with full rich content — stubs are noindexed and excluded
const RICH_TEMPLE_SLUGS = ['guruvayur', 'sabarimala', 'padmanabhaswamy']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic slugs from DB in parallel. NOTE: Supabase caps any single
  // response at 1,000 rows, and daily_gold_rates has ~2,000 — so we must never
  // fetch "all rate rows" here. News dates are filtered server-side (~100 real
  // rows), and year/month archives are enumerated from min/max date instead
  // (the series is contiguous).
  const supabase = createSupabaseReadClient()
  const [ornamentsRes, newsDatesRes, firstRes, lastRes] = await Promise.all([
    supabase.from('ornaments').select('slug, description_en, symbolism_en'),
    supabase
      .from('daily_gold_rates')
      .select('date')
      .eq('city', 'Kochi')
      .neq('consensus_sources', 'backfill-yahoo-calibrated')
      .order('date', { ascending: true }),
    supabase.from('daily_gold_rates').select('date').eq('city', 'Kochi').order('date', { ascending: true }).limit(1),
    supabase.from('daily_gold_rates').select('date').eq('city', 'Kochi').order('date', { ascending: false }).limit(1),
  ])
  // Only include ornaments that have real content (not stubs)
  const ornamentSlugs = (ornamentsRes.data ?? [])
    .filter((r) => r.description_en || r.symbolism_en)
    .map((r) => r.slug)
  // News pages: real board-rate dates only (excluded estimated backfill server-side).
  const newsDates = (newsDatesRes.data ?? []).map((r) => r.date as string)
  const firstDate = firstRes.data?.[0]?.date as string | undefined
  const lastDate = lastRes.data?.[0]?.date as string | undefined

  const rootRoute: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/ml`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
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
      'silver-price-calculator',
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
    { url: `${BASE}/kerala-gold-price-trends`,    lastModified: new Date(),   changeFrequency: 'monthly' as const, priority: 0.75 },
    { url: `${BASE}/widget`,                       lastModified: new Date(),   changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE}/gold-rate-yesterday-kerala`,  lastModified: new Date(),   changeFrequency: 'daily'   as const, priority: 0.7 },
    { url: `${BASE}/old-gold-rate-kerala`,        lastModified: new Date(),   changeFrequency: 'daily'   as const, priority: 0.75 },
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

  // Historical year + month archive pages, enumerated from the (contiguous)
  // data range so they cover the full backfill — a "fetch all rows" approach
  // silently truncates at Supabase's 1,000-row cap.
  const yearRoutes: MetadataRoute.Sitemap = []
  const monthRoutes: MetadataRoute.Sitemap = []
  if (firstDate && lastDate) {
    const MONTH_SLUGS = ['january','february','march','april','may','june','july','august','september','october','november','december']
    const start = new Date(firstDate + 'T00:00:00')
    const end = new Date(lastDate + 'T00:00:00')
    for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
      yearRoutes.push({
        url: `${BASE}/gold-rate-history/${y}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })
    }
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1)
    while (cursor <= endMonth) {
      monthRoutes.push({
        url: `${BASE}/gold-rate-history/${cursor.getFullYear()}/${MONTH_SLUGS[cursor.getMonth()]}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.55,
      })
      cursor.setMonth(cursor.getMonth() + 1)
    }
  }

  return [...rootRoute, ...toolRoutes, ...staticRoutes, ...cityRoutes, ...blogRoutes, ...cultureRoutes, ...newsRoutes, ...yearRoutes, ...monthRoutes]
}
