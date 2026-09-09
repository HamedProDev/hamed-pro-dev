import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'

// All content is admin-managed: an empty database returns an empty list.
export async function GET(req: NextRequest) {
  const showAll = new URL(req.url).searchParams.get('all') === 'true'
  try {
    const filters = showAll ? [] : [{ field: 'is_published', operator: 'eq' as const, value: true }]
    const achievements = await getDocuments('achievements', {
      filters,
      orderBy: { field: 'order_index', direction: 'asc' },
    })
    return apiSuccess(achievements)
  } catch {
    return apiSuccess([])
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const achievement = await createDocument('achievements', mapFormToDb('achievements', body))
    return apiSuccess(achievement, 'Achievement created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
