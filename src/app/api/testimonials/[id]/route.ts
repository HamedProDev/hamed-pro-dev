import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import Testimonial from '@/lib/db/models/Testimonial'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const testimonial = await Testimonial.findById(params.id).lean()
    if (!testimonial) return apiError('Not found', 404)
    return apiSuccess(testimonial)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    const testimonial = await Testimonial.findByIdAndUpdate(params.id, body, { new: true })
    if (!testimonial) return apiError('Not found', 404)
    return apiSuccess(testimonial, 'Testimonial updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const testimonial = await Testimonial.findByIdAndDelete(params.id)
    if (!testimonial) return apiError('Not found', 404)
    return apiSuccess(null, 'Testimonial deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
