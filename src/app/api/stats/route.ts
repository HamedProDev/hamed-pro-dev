import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'

// All content is admin-managed: an empty database returns an empty list.
export async function GET() {
  try {
    const stats = await getDocuments('site_stats', { orderBy: { field: 'order_index', direction: 'asc' } })
    return apiSuccess(stats)
  } catch {
    return apiSuccess([])
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const stat = await createDocument('site_stats', mapFormToDb('site_stats', body))
    return apiSuccess(stat, 'Stat created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
