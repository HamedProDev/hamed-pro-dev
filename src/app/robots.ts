import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hamedhussein.is-a.dev'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin-control', '/api', '/dashboard'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
