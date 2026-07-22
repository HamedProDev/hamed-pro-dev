import { MetadataRoute } from 'next'
import { getDocuments } from '@/lib/firebase/firestore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hamedprodev.web.app'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/skills`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/achievements`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/startups`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/hire`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/newsletter`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/cv`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/open-source`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]

  try {
    const [projects, courses, jobs, posts] = await Promise.all([
      getDocuments('projects', { filters: [{ field: 'isPublished', operator: '==', value: true }] }),
      getDocuments('courses', { filters: [{ field: 'isPublished', operator: '==', value: true }] }),
      getDocuments('jobs'),
      getDocuments('blogPosts', { filters: [{ field: 'isPublished', operator: '==', value: true }] }),
    ])

    const dynamicPages: MetadataRoute.Sitemap = [
      ...projects.map(p => ({ url: `${baseUrl}/projects/${p.slug}`, lastModified: p.updatedAt?.toDate?.() || new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
      ...courses.map(c => ({ url: `${baseUrl}/courses/${c.slug}`, lastModified: c.updatedAt?.toDate?.() || new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
      ...jobs.map(j => ({ url: `${baseUrl}/jobs/${j.id}`, lastModified: j.updatedAt?.toDate?.() || new Date(), changeFrequency: 'weekly' as const, priority: 0.6 })),
      ...posts.map(p => ({ url: `${baseUrl}/blog/${p.slug}`, lastModified: p.updatedAt?.toDate?.() || new Date(), changeFrequency: 'monthly' as const, priority: 0.8 })),
    ]

    return [...staticPages, ...dynamicPages]
  } catch {
    return staticPages
  }
}
