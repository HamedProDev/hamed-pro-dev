import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { Course } from '@/lib/db/models/Course'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const course = await Course.findById(params.id).populate('lessons').lean()
    if (!course) return apiError('Course not found', 404)
    return apiSuccess(course)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    const course = await Course.findByIdAndUpdate(params.id, body, { new: true })
    if (!course) return apiError('Course not found', 404)
    return apiSuccess(course, 'Course updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const course = await Course.findByIdAndDelete(params.id)
    if (!course) return apiError('Course not found', 404)
    return apiSuccess(null, 'Course deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(req, { params })
  return PUT(req, { params })
}
