import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'

export async function GET() {
  try {
    const testimonials = await getDocuments('testimonials', { orderBy: { field: 'order_index', direction: 'asc' } })
    return apiSuccess(testimonials)
  } catch (error: any) {
    return apiError(error.message, 500)
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
