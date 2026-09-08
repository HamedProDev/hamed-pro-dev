import { NextRequest } from 'next/server'
import { getDocuments } from '@/lib/supabase/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const certificates = await getDocuments('certificates', {
      filters: [{ field: 'user_id', operator: 'eq', value: user.uid }],
      orderBy: { field: 'created_at', direction: 'desc' },
    })
    return apiSuccess(certificates)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
