import { MetadataRoute } from 'next'
import { createSupabaseClient } from "@/lib/supabase"

export const revalidate = 300 // Revalidate every 5 minutes

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("date")
    .eq("city", "Kochi")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  const lastModifiedDate = data?.date ? new Date(data.date) : new Date();

  return [
    {
      url: 'https://livegoldkerala.com',
      lastModified: lastModifiedDate,
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}
