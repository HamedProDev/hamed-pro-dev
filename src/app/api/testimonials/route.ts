import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'
import { fallbackTestimonials } from '@/lib/fallback-data'
import { syncContentCatalog } from '@/lib/supabase/content-sync'

export async function GET() {
  try {
    let testimonials = await getDocuments('testimonials', { orderBy: { field: 'order_index', direction: 'asc' } })
    if (testimonials.length === 0) {
      // Empty table: seed the catalog so every row gets a real UUID, then re-read.
      await syncContentCatalog()
      testimonials = await getDocuments('testimonials', { orderBy: { field: 'order_index', direction: 'asc' } })
    }
    if (testimonials.length > 0) return apiSuccess(testimonials)
  } catch {
    // fall through to the hard-coded catalog
  }
  return apiSuccess(fallbackTestimonials())
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
