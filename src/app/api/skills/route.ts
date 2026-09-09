import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'
import { fallbackSkills } from '@/lib/fallback-data'
import { syncContentCatalog } from '@/lib/supabase/content-sync'

export async function GET() {
  try {
    let skills = await getDocuments('skills', { orderBy: { field: 'order_index', direction: 'asc' } })
    if (skills.length === 0) {
      // Empty table: seed the catalog so every row gets a real UUID, then re-read.
      await syncContentCatalog()
      skills = await getDocuments('skills', { orderBy: { field: 'order_index', direction: 'asc' } })
    }
    if (skills.length > 0) return apiSuccess(skills)
  } catch {
    // fall through to the hard-coded catalog
  }
  return apiSuccess(fallbackSkills())
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const skill = await createDocument('skills', mapFormToDb('skills', body))
    return apiSuccess(skill, 'Skill created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
