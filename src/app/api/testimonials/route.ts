import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import Testimonial from '@/lib/db/models/Testimonial'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET() {
  try {
    await connectDB()
    const testimonials = await Testimonial.find().sort({ order: 1 }).lean()
    return apiSuccess(testimonials)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    const testimonial = await Testimonial.create(body)
    return apiSuccess(testimonial, 'Testimonial created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
