import { NextRequest } from 'next/server'
import { getDocuments, createDocument, countDocuments } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, apiPaginated } from '@/lib/supabase/helpers'
import { generateSlug } from '@/lib/utils/slug'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const level = searchParams.get('level')

    const showAll = searchParams.get('all') === 'true'
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
    return apiPaginated(courses, total, page, limit)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const slug = body.slug || generateSlug(body.title)
    const course = await createDocument('courses', { ...body, slug })
    return apiSuccess(course, 'Course created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
