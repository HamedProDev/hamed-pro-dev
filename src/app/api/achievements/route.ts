import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'

export async function GET() {
  try {
    const achievements = await getDocuments('achievements', { orderBy: { field: 'order_index', direction: 'asc' } })
    return apiSuccess(achievements)
  } catch (error: any) {
    return apiError(error.message, 500)
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
