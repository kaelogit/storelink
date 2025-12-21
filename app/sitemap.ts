import { MetadataRoute } from 'next'

const BASE_URL = 'https://storelink.ng'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1, // THE GATE: Your landing page is always #1
    },
    {
      url: `${BASE_URL}/marketplace`, // Corrected to match your folder name exactly
      lastModified: new Date(),
      changeFrequency: 'always', // 'always' tells Google new products are added constantly
      priority: 0.9, // THE ENGINE: High priority for search discovery
    },
    {
      url: `${BASE_URL}/empire-coins`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8, // THE MANUAL: Essential for your brand authority
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

  return staticRoutes
}