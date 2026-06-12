import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { Project } from '@/lib/db/models/Project'
import { requireAdmin, apiSuccess, apiError, apiPaginated } from '@/lib/auth/middleware'
import { generateSlug } from '@/lib/utils/slug'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const filter: any = { isPublished: true }
    if (category) filter.category = category
    if (status) filter.status = status
    if (featured === 'true') filter.featured = true
    if (search) filter.title = { $regex: search, $options: 'i' }

    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ order: 1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Project.countDocuments(filter),
    ])
    return apiPaginated(projects, total, page, limit)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    await connectDB()
    const body = await req.json()
    const slug = body.slug || generateSlug(body.title)
    const project = await Project.create({ ...body, slug })
    return apiSuccess(project, 'Project created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
