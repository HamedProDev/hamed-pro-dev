import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { Course } from '@/lib/db/models/Course'
import { requireAdmin, apiSuccess, apiError, apiPaginated } from '@/lib/auth/middleware'
import { generateSlug } from '@/lib/utils/slug'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const level = searchParams.get('level')

    const filter: any = { isPublished: true }
    if (category) filter.category = category
    if (level) filter.level = level

    const [courses, total] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Course.countDocuments(filter),
    ])
    return apiPaginated(courses, total, page, limit)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    const slug = body.slug || generateSlug(body.title)
    const course = await Course.create({ ...body, slug })
    return apiSuccess(course, 'Course created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
