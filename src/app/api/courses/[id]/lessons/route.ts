import { NextRequest } from 'next/server'
import { getDocuments, createDocument, countDocuments, getDocument, updateDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'
import { generateSlug } from '@/lib/utils/slug'
import { resolveCourseId } from '@/lib/supabase/content-sync'
import { buildLessonsFromCourse } from '@/lib/course-lessons'
import { fallbackCourses } from '@/lib/fallback-data'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // params.id may be a course slug (public pages) or UUID (admin) — resolve first.
    const courseId = await resolveCourseId(params.id)
    if (courseId) {
      const lessons = await getDocuments('lessons', { filters: [{ field: 'course_id', operator: 'eq', value: courseId }], orderBy: { field: 'order_index', direction: 'asc' } })
      if (lessons.length > 0) return apiSuccess(lessons)
    }
  } catch {
    // fall through to generated lessons
  }
  // Display-only fallback when the DB is unreachable: derive steps from the hard-coded course.
  const course = fallbackCourses().find((c: any) => c.slug === params.id || c.id === params.id)
  if (!course) return apiSuccess([])
  return apiSuccess(buildLessonsFromCourse(course).map((l, i) => ({ id: `${course.slug}-lesson-${i}`, ...l })))
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const slug = body.slug || generateSlug(body.title)
    const count = await countDocuments('lessons', [{ field: 'course_id', operator: 'eq', value: params.id }])
    const lesson = await createDocument('lessons', { ...mapFormToDb('lessons', body), slug, course_id: params.id, order_index: count + 1 })
    return apiSuccess(lesson, 'Lesson created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
