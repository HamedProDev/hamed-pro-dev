import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'
import { fallbackStats } from '@/lib/fallback-data'
import { syncContentCatalog } from '@/lib/supabase/content-sync'

export async function GET() {
  try {
    let stats = await getDocuments('site_stats', { orderBy: { field: 'order_index', direction: 'asc' } })
    if (stats.length === 0) {
      // Empty table: seed the catalog so every row gets a real UUID, then re-read.
      await syncContentCatalog()
      stats = await getDocuments('site_stats', { orderBy: { field: 'order_index', direction: 'asc' } })
    }
    if (stats.length > 0) return apiSuccess(stats)
  } catch {
    // fall through to the hard-coded catalog
  }
  return apiSuccess(fallbackStats())
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
