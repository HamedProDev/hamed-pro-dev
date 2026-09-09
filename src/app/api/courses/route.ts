import { NextRequest } from 'next/server'
import { getDocuments, createDocument, countDocuments, uniqueSlug } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, apiPaginated, mapFormToDb } from '@/lib/supabase/helpers'
import { generateSlug } from '@/lib/utils/slug'

// All content is admin-managed: an empty database returns an empty list.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  const showAll = searchParams.get('all') === 'true'

  try {
    const filters: { field: string; operator: any; value: any }[] = []
    if (!showAll) filters.push({ field: 'is_published', operator: 'eq', value: true })
    if (category) filters.push({ field: 'category', operator: 'eq', value: category })
    if (level) filters.push({ field: 'level', operator: 'eq', value: level })

    const [courses, total] = await Promise.all([
      getDocuments('courses', {
        filters,
        orderBy: { field: 'created_at', direction: 'desc' },
        limit,
        offset: (page - 1) * limit,
      }),
      countDocuments('courses', filters.length > 0 ? filters : undefined),
    ])

    // Real enrollment counts (the courses.enrolled column is legacy/stale).
    let enrollCounts: Record<string, number> = {}
    let lessonCounts: Record<string, number> = {}
    try {
      const courseIds = courses.map((c: any) => c.id)
      const enrollments = await getDocuments('enrollments', {
        filters: [{ field: 'course_id', operator: 'in', value: courseIds }],
        select: 'course_id',
      })
      for (const e of enrollments) {
        enrollCounts[e.course_id] = (enrollCounts[e.course_id] || 0) + 1
      }
      // Lesson counts per course — the admin table warns about courses that
      // have no lessons yet.
      const lessons = await getDocuments('lessons', {
        filters: [{ field: 'course_id', operator: 'in', value: courseIds }],
        select: 'course_id',
      })
      for (const l of lessons) {
        lessonCounts[l.course_id] = (lessonCounts[l.course_id] || 0) + 1
      }
    } catch {
      // enrollment/lesson counts are non-critical — fall back to the legacy column
    }

    // Every course is free — normalize price so legacy rows never show a cost.
    const normalized = courses.map((c: any) => ({
      ...c,
      price: 'Free',
      enrolled: enrollCounts[c.id] ?? c.enrolled ?? 0,
      ...(showAll ? { lessons_count: lessonCounts[c.id] ?? 0 } : {}),
    }))
    return apiPaginated(normalized, total, page, limit)
  } catch {
    return apiPaginated([], 0, page, limit)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const slug = await uniqueSlug('courses', body.slug || generateSlug(body.title))
    const course = await createDocument('courses', { ...mapFormToDb('courses', body), slug })
    return apiSuccess(course, 'Course created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
