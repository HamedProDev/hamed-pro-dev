import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { BlogPost } from '@/lib/db/models/BlogPost'
import { requireAdmin, apiSuccess, apiError, apiPaginated } from '@/lib/auth/middleware'
import { generateSlug } from '@/lib/utils/slug'
import { readingTime } from '@/lib/utils/format'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const filter: any = { isPublished: true }
    if (category) filter.category = category
    if (search) filter.title = { $regex: search, $options: 'i' }

    const [posts, total] = await Promise.all([
      BlogPost.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      BlogPost.countDocuments(filter),
    ])
    return apiPaginated(posts, total, page, limit)
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
    const rt = readingTime(body.content)
    const post = await BlogPost.create({ ...body, slug, readingTime: rt })
    return apiSuccess(post, 'Post created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
