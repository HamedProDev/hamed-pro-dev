import { NextRequest } from 'next/server'
import { getDocument, updateDocument, deleteDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const testimonial = await getDocument('testimonials', params.id)
    if (!testimonial) return apiError('Not found', 404)
    return apiSuccess(testimonial)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const testimonial = await updateDocument('testimonials', params.id, body)
    if (!testimonial) return apiError('Not found', 404)
    return apiSuccess(testimonial, 'Testimonial updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await deleteDocument('testimonials', params.id)
    return apiSuccess(null, 'Testimonial deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(req, { params })
  return PUT(req, { params })
}
