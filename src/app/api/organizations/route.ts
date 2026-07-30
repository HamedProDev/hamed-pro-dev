import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'
import { generateSlug } from '@/lib/utils/slug'

export async function GET() {
  try {
    const orgs = await getDocuments('organizations', { orderBy: { field: 'order_index', direction: 'asc' } })
    return apiSuccess(orgs)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const slug = body.slug || generateSlug(body.name)
    const org = await createDocument('organizations', { ...mapFormToDb('organizations', body), slug })
    return apiSuccess(org, 'Organization created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
