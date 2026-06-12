import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { Lesson } from '@/lib/db/models/Lesson'
import { Course } from '@/lib/db/models/Course'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'
import { generateSlug } from '@/lib/utils/slug'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const lessons = await Lesson.find({ course: params.id }).sort({ order: 1 }).lean()
    return apiSuccess(lessons)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await connectDB()
    const body = await req.json()
    const slug = body.slug || generateSlug(body.title)
    const count = await Lesson.countDocuments({ course: params.id })
    const lesson = await Lesson.create({ ...body, slug, course: params.id, order: count + 1 })
    await Course.findByIdAndUpdate(params.id, { $push: { lessons: lesson._id } })
    return apiSuccess(lesson, 'Lesson created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
