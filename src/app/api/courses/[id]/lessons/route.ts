import { NextRequest } from 'next/server'
import { getDocuments, createDocument, uniqueSlug } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb, resolveCourseId } from '@/lib/supabase/helpers'
import { generateSlug } from '@/lib/utils/slug'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // params.id may be a course slug (public pages) or UUID (admin) — resolve first.
    const courseId = await resolveCourseId(params.id)
    if (!courseId) return apiSuccess([])
    const lessons = await getDocuments('lessons', { filters: [{ field: 'course_id', operator: 'eq', value: courseId }], orderBy: { field: 'order_index', direction: 'asc' } })
    return apiSuccess(lessons)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()

    // Accept a course UUID or slug, but always store the real UUID — otherwise
    // the FK insert fails or lessons get orphaned under a slug "id".
    const courseId = await resolveCourseId(params.id)
    if (!courseId) return apiError('Course not found', 404)

    // Place the new lesson after the current last lesson (max, not count —
    // count collides after deletions).
    const existing = await getDocuments('lessons', {
      filters: [{ field: 'course_id', operator: 'eq', value: courseId }],
      orderBy: { field: 'order_index', direction: 'desc' },
      limit: 1,
    })
    const nextOrder = ((existing[0]?.order_index as number) || 0) + 1

    // Slugs are UNIQUE per course — dedupe repeated titles (e.g. two
    // "Introduction" lessons) instead of failing the insert.
    const slug = await uniqueSlug('lessons', body.slug || generateSlug(body.title), {
      scopeField: 'course_id',
      scopeValue: courseId,
    })

    const lesson = await createDocument('lessons', {
      ...mapFormToDb('lessons', body),
      slug,
      course_id: courseId,
      order_index: nextOrder,
    })
    return apiSuccess(lesson, 'Lesson created')
  } catch (error: any) {
    console.error('[lessons] create failed:', error)
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
