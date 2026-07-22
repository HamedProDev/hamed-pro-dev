import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const data = await getDocuments('analytics', { filters: [{ field: 'created_at', operator: 'gte', value: thirtyDaysAgo.toISOString() }], orderBy: { field: 'created_at', direction: 'asc' } })
    return apiSuccess(data)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await createDocument('analytics', {
      page: body.page,
      event: body.event || 'pageview',
      referrer: body.referrer || null,
      user_agent: req.headers.get('user-agent') || null,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
    })
    return apiSuccess(null, 'Tracked')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
