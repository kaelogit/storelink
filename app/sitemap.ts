import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://storelink.ng'

export const revalidate = 0; // Force-revalidate every single time
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. MANUALLY CREATE CLIENT TO BYPASS IMPORT ISSUES
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 2. STATIC ROUTES
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/marketplace`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${BASE_URL}/empire-coins`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  try {
    // 3. FETCH STOREFRONTS
    // 3. FETCH STOREFRONTS
    const { data: stores, error } = await supabase
      .from('stores')
      .select('slug, created_at'); // Changed updated_at to created_at
    
    if (error) {
      console.error("❌ SITEMAP DATABASE ERROR:", error.message);
      return staticRoutes;
    }

    // ... inside the .map function ...
    const storefrontRoutes: MetadataRoute.Sitemap = stores.map((store) => ({
      url: `${BASE_URL}/${store.slug}`,
      lastModified: new Date(store.created_at || new Date()), // Use created_at here
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    console.log(`✅ SITEMAP SUCCESS: Generated ${storefrontRoutes.length} storefront links.`)
    return [...staticRoutes, ...storefrontRoutes]

  } catch (err) {
    console.error("💥 SITEMAP CRITICAL CRASH:", err)
    return staticRoutes
  }
}