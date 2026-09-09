import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'

// All content is admin-managed: an empty database returns an empty list.
export async function GET() {
  try {
    const skills = await getDocuments('skills', { orderBy: { field: 'order_index', direction: 'asc' } })
    return apiSuccess(skills)
  } catch {
    return apiSuccess([])
  }
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
