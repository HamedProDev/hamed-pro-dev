import { NextRequest } from 'next/server'
import { getDocuments } from '@/lib/supabase/db'
import { apiSuccess, apiError } from '@/lib/supabase/helpers'

// Public: fetch a single course by its slug.
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const rows = await getDocuments('courses', {
      filters: [{ field: 'slug', operator: 'eq', value: params.slug }],
      limit: 1,
    })
    if (!rows || rows.length === 0) return apiError('Course not found', 404)
    const course = { ...rows[0], price: 'Free' }
    return apiSuccess(course)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
