import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = 'https://storelink.ng'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // 1. THE STATIC FOUNDATION
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1, // THE GATE: Your landing page is always #1
    },
    {
      url: `${BASE_URL}/marketplace`,
      lastModified: new Date(),
      changeFrequency: 'always', 
      priority: 0.9, // THE ENGINE: High priority for search discovery
    },
    {
      url: `${BASE_URL}/empire-coins`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // 2. THE STOREFRONT DISCOVERY ENGINE
  // Fetching all stores that are NOT expired to ensure Google sees fresh warehouses.
  const { data: stores } = await supabase
    .from('stores')
    .select('slug, updated_at')
    .neq('subscription_status', 'expired');

  const storefrontRoutes: MetadataRoute.Sitemap = (stores || []).map((store) => ({
    url: `${BASE_URL}/${store.slug}`,
    lastModified: new Date(store.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.7, // High priority so storefronts rank well
  }))

  // 3. THE MERGE
  // Combining the static foundation with the dynamic storefronts
  return [...staticRoutes, ...storefrontRoutes]
}