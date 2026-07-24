import { NextRequest } from 'next/server'
import { getDocuments, createDocument, countDocuments, getDocument, updateDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'
import { generateSlug } from '@/lib/utils/slug'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lessons = await getDocuments('lessons', { filters: [{ field: 'course_id', operator: 'eq', value: params.id }], orderBy: { field: 'order_index', direction: 'asc' } })
    return apiSuccess(lessons)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
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
