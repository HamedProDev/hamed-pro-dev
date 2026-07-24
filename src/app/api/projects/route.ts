import { NextRequest } from 'next/server'
import { getDocuments, createDocument, countDocuments } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, apiPaginated, mapFormToDb } from '@/lib/supabase/helpers'
import { generateSlug } from '@/lib/utils/slug'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const filters: { field: string; operator: any; value: any }[] = []
    const showAll = searchParams.get('all') === 'true'
    if (!showAll) filters.push({ field: 'is_published', operator: 'eq', value: true })
    if (category) filters.push({ field: 'category', operator: 'eq', value: category })
    if (status === 'featured') filters.push({ field: 'featured', operator: 'eq', value: true })
    if (featured === 'true') filters.push({ field: 'featured', operator: 'eq', value: true })

    const [projects, total] = await Promise.all([
      getDocuments('projects', {
        filters,
        orderBy: { field: 'order_index', direction: 'asc' },
        limit,
        offset: (page - 1) * limit,
      }),
      countDocuments('projects', search ? undefined : filters),
    ])

    return apiPaginated(projects, total, page, limit)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const slug = body.slug || generateSlug(body.title)
    const project = await createDocument('projects', {
      title: body.title,
      slug,
      description: body.description,
      content: body.longDescription || body.content,
      image_url: body.coverImage || body.image_url,
      category: body.subCategory || body.category,
      tags: body.tags || [],
      tech_stack: Array.isArray(body.techStack) ? body.techStack : (typeof body.techStack === 'string' ? body.techStack.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      demo_url: body.demoUrl || body.demo_url,
      github_url: body.sourceUrl || body.github_url,
      featured: body.featured ?? false,
      is_published: body.isPublished ?? body.is_published ?? true,
      order_index: body.order_index ?? 0,
    })
    return apiSuccess(project, 'Project created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
