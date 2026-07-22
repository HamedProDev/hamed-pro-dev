import { NextRequest } from 'next/server'
import { getDocuments, createDocument, updateDocument } from '@/lib/firebase/firestore'
import { requireAdmin, apiSuccess, apiError } from '@/lib/firebase/auth'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const data = await getDocuments('analytics', { filters: [{ field: 'date', operator: '>=', value: thirtyDaysAgo }], orderBy: { field: 'date', direction: 'asc' } })
    return apiSuccess(data)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { page } = await req.json()
    if (!page) return apiError('Page is required')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const existing = await getDocuments('analytics', { filters: [{ field: 'page', operator: '==', value: page }, { field: 'date', operator: '==', value: today }] })
    if (existing.length > 0) {
      const doc = existing[0]
      await updateDocument('analytics', doc.id, { views: (doc.views || 0) + 1 })
    } else {
      await createDocument('analytics', { page, date: today, views: 1 })
    }
    return apiSuccess(null, 'Tracked')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
