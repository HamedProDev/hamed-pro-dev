import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { Lesson } from '@/lib/db/models/Lesson'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET(req: NextRequest, { params }: { params: { id: string; lessonId: string } }) {
  try {
    await connectDB()
    const lesson = await Lesson.findById(params.lessonId).lean()
    if (!lesson) return apiError('Lesson not found', 404)
    return apiSuccess(lesson)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string; lessonId: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    const lesson = await Lesson.findByIdAndUpdate(params.lessonId, body, { new: true })
    if (!lesson) return apiError('Lesson not found', 404)
    return apiSuccess(lesson, 'Lesson updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string; lessonId: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const lesson = await Lesson.findByIdAndDelete(params.lessonId)
    if (!lesson) return apiError('Lesson not found', 404)
    return apiSuccess(null, 'Lesson deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string; lessonId: string } }) {
  const body = await req.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(req, { params })
  return PUT(req, { params })
}
