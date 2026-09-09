import { NextRequest } from 'next/server'
import { getDocuments } from '@/lib/supabase/db'
import { apiSuccess } from '@/lib/supabase/helpers'

const EMPTY = { projects: [], courses: [], lessons: [] }

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  if (q.length < 2) return apiSuccess(EMPTY)
  const qLower = q.toLowerCase()

  const matches = (fields: (string | undefined | null)[]) =>
    fields.some(f => (f || '').toLowerCase().includes(qLower))

  try {
    const [projects, courses, lessons] = await Promise.all([
      getDocuments('projects', { filters: [{ field: 'is_published', operator: 'eq', value: true }] }),
      getDocuments('courses', { filters: [{ field: 'is_published', operator: 'eq', value: true }] }),
      getDocuments('lessons', { filters: [{ field: 'is_published', operator: 'eq', value: true }] }),
    ])

    // Resolve course slugs for lesson results.
    const courseIds = Array.from(new Set(lessons.map((l: any) => l.course_id).filter(Boolean)))
    const courseRows = courseIds.length
      ? await getDocuments('courses', { filters: [{ field: 'id', operator: 'in', value: courseIds }] })
      : []
    const courseById = Object.fromEntries(courseRows.map((c: any) => [c.id, c]))

    const lessonResults = lessons
      .filter((l: any) => matches([l.title, l.content?.slice(0, 300)]))
      .slice(0, 5)
      .map((l: any) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        courseId: l.course_id,
        courseTitle: courseById[l.course_id]?.title || 'Course',
        courseSlug: courseById[l.course_id]?.slug || '',
      }))

    return apiSuccess({
      projects: projects.filter(p => matches([p.title, p.description])).slice(0, 5),
      courses: courses.filter(c => matches([c.title, c.description])).slice(0, 5),
      lessons: lessonResults,
    })
  } catch {
    return apiSuccess(EMPTY)
  }
}
