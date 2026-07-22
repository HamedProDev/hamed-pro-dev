import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function GET() {
  try {
    const stats = await getDocuments('site_stats', { orderBy: { field: 'order_index', direction: 'asc' } })
    return apiSuccess(stats)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const stat = await createDocument('site_stats', body)
    return apiSuccess(stat, 'Stat created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
