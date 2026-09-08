import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

const ALLOWED_TABLES = ['courses', 'lessons', 'projects', 'skills', 'achievements', 'testimonials']

// Bulk publish / unpublish / delete across content tables.
// POST body: { table, ids: string[], action: 'publish'|'unpublish'|'delete' }
export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const { table, ids, action } = body

    if (!ALLOWED_TABLES.includes(table)) return apiError('Invalid table', 400)
    if (!Array.isArray(ids) || ids.length === 0) return apiError('No items selected', 400)
    if (!['publish', 'unpublish', 'delete'].includes(action)) return apiError('Invalid action', 400)

    const supabase = createServiceClient()
    let error: any = null

    if (action === 'delete') {
      const res = await supabase.from(table).delete().in('id', ids)
      error = res.error
    } else {
      const res = await supabase.from(table).update({ is_published: action === 'publish' }).in('id', ids)
      error = res.error
    }

    if (error) return apiError(error.message, 500)
    return apiSuccess({ affected: ids.length }, `Bulk ${action} completed`)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
