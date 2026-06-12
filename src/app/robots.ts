import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hamedpro.rw'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/dashboard'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
