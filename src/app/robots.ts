import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/search'],
    },
    sitemap: 'https://www.livegoldkerala.com/sitemap.xml',
  }
}
