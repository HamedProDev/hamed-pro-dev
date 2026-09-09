import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'
import { fallbackAchievements } from '@/lib/fallback-data'
import { syncContentCatalog } from '@/lib/supabase/content-sync'

export async function GET(req: NextRequest) {
  const showAll = new URL(req.url).searchParams.get('all') === 'true'
  try {
    const filters = showAll ? [] : [{ field: 'is_published', operator: 'eq' as const, value: true }]
    let achievements = await getDocuments('achievements', {
      filters,
      orderBy: { field: 'order_index', direction: 'asc' },
    })
    if (achievements.length === 0) {
      // Empty table: seed the catalog so every row gets a real UUID, then re-read.
      await syncContentCatalog()
      achievements = await getDocuments('achievements', {
        filters,
        orderBy: { field: 'order_index', direction: 'asc' },
      })
    }
    if (achievements.length > 0) return apiSuccess(achievements)
  } catch {
    // fall through to the hard-coded catalog
  }
  const list = fallbackAchievements().filter(a => showAll || a.is_published !== false)
  return apiSuccess(list)
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
