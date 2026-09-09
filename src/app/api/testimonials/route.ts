import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'

// All content is admin-managed: an empty database returns an empty list.
export async function GET() {
  try {
    const testimonials = await getDocuments('testimonials', { orderBy: { field: 'order_index', direction: 'asc' } })
    return apiSuccess(testimonials)
  } catch {
    return apiSuccess([])
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const testimonial = await createDocument('testimonials', mapFormToDb('testimonials', body))
    return apiSuccess(testimonial, 'Testimonial created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
