import { NextRequest } from 'next/server'
import { getDocuments, createDocument, countDocuments } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, apiPaginated } from '@/lib/supabase/helpers'
import { generateSlug } from '@/lib/utils/slug'
import { readingTime } from '@/lib/utils/format'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const filters: { field: string; operator: any; value: any }[] = [{ field: 'is_published', operator: 'eq', value: true }]
    if (category) filters.push({ field: 'category', operator: 'eq', value: category })

    const [posts, total] = await Promise.all([
      getDocuments('blog_posts', {
        filters,
        orderBy: { field: 'created_at', direction: 'desc' },
        limit,
        offset: (page - 1) * limit,
      }),
      countDocuments('blog_posts', search ? undefined : filters),
    ])

    return apiPaginated(posts, total, page, limit)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const slug = body.slug || generateSlug(body.title)
    const rt = readingTime(body.content)
    const post = await createDocument('blog_posts', { ...body, slug, read_time: rt })
    return apiSuccess(post, 'Post created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
