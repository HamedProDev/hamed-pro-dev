import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/firebase/firestore'
import { requireAdmin, apiSuccess, apiError } from '@/lib/firebase/auth'

export async function GET() {
  try {
    const orgs = await getDocuments('organizations', { orderBy: { field: 'order', direction: 'asc' } })
    return apiSuccess(orgs)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const org = await createDocument('organizations', body)
    return apiSuccess(org, 'Organization created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
