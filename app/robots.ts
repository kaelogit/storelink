import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/api', '/onboarding', '/update-password'],
      },
      {
        userAgent: ['Twitterbot', 'facebookexternalhit', 'WhatsApp'],
        allow: '/',
      }
    ],
    sitemap: 'https://storelink.ng/sitemap.xml',
  }
}