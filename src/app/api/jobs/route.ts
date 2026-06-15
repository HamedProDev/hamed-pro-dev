import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { Job } from '@/lib/db/models/Job'
import { requireAuth, requireAdmin, apiSuccess, apiError, apiPaginated } from '@/lib/auth/middleware'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const locationType = searchParams.get('locationType')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const filter: any = searchParams.get('all') ? {} : { status: 'active', expiresAt: { $gt: new Date() } }
    if (locationType) filter.locationType = locationType
    if (category) filter.category = category
    if (search) filter.title = { $regex: search, $options: 'i' }

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ featured: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Job.countDocuments(filter),
    ])
    return apiPaginated(jobs, total, page, limit)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    if (!body.expiresAt) {
      body.expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    }
    const job = await Job.create(body)
    return apiSuccess(job, 'Job created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
