import { NextRequest } from 'next/server'
import { getDocuments, createDocument, countDocuments } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, apiPaginated } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const locationType = searchParams.get('locationType')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const showAll = searchParams.get('all') === 'true'
    const filters: { field: string; operator: any; value: any }[] = []
    if (!showAll) {
      filters.push({ field: 'status', operator: '==', value: 'active' })
      filters.push({ field: 'expiresAt', operator: '>=', value: new Date() })
    }
    if (locationType) filters.push({ field: 'locationType', operator: '==', value: locationType })
    if (category) filters.push({ field: 'category', operator: '==', value: category })

    const [jobs, total] = await Promise.all([
      getDocuments('jobs', {
        filters,
        orderBy: { field: 'created_at', direction: 'desc' },
        limit,
        offset: (page - 1) * limit,
      }),
      countDocuments('jobs', filters.length > 0 ? filters : undefined),
    ])

    return apiPaginated(jobs, total, page, limit)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    if (!body.expiresAt) {
      body.expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    }
    const job = await createDocument('jobs', body)
    return apiSuccess(job, 'Job created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
