import { NextRequest } from 'next/server'
import { getDocuments } from '@/lib/firebase/firestore'
import { apiSuccess, apiError } from '@/lib/firebase/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    if (!q || q.length < 2) return apiSuccess({ projects: [], posts: [], courses: [], jobs: [] })

    const qLower = q.toLowerCase()
    const [projects, posts, courses, jobs] = await Promise.all([
      getDocuments('projects', { filters: [{ field: 'isPublished', operator: '==', value: true }] }),
      getDocuments('blogPosts', { filters: [{ field: 'isPublished', operator: '==', value: true }] }),
      getDocuments('courses', { filters: [{ field: 'isPublished', operator: '==', value: true }] }),
      getDocuments('jobs', { filters: [{ field: 'status', operator: '==', value: 'active' }] }),
    ])

    return apiSuccess({
      projects: projects.filter(p => (p.title || '').toLowerCase().includes(qLower) || (p.description || '').toLowerCase().includes(qLower)).slice(0, 5),
      posts: posts.filter(p => (p.title || '').toLowerCase().includes(qLower) || (p.excerpt || '').toLowerCase().includes(qLower)).slice(0, 5),
      courses: courses.filter(c => (c.title || '').toLowerCase().includes(qLower) || (c.description || '').toLowerCase().includes(qLower)).slice(0, 5),
      jobs: jobs.filter(j => (j.title || '').toLowerCase().includes(qLower) || (j.company || '').toLowerCase().includes(qLower)).slice(0, 5),
    })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
