import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/firebase/firestore'
import { requireAdmin, apiSuccess, apiError } from '@/lib/firebase/auth'

export async function GET() {
  try {
    const stats = await getDocuments('siteStats', { orderBy: { field: 'order', direction: 'asc' } })
    return apiSuccess(stats)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const stat = await createDocument('siteStats', body)
    return apiSuccess(stat, 'Stat created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
