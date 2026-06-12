import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hamedpro.rw'

  const staticPages = [
    '/', '/projects', '/courses', '/blog', '/jobs', '/about', '/contact',
    '/hire', '/tools', '/open-source', '/community', '/newsletter', '/cv',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : 0.8,
  }))

  return [...staticPages]
}
