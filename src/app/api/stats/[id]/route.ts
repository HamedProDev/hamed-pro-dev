import { NextRequest } from 'next/server'
import { getDocument, updateDocument, deleteDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const stat = await getDocument('site_stats', params.id)
    if (!stat) return apiError('Not found', 404)
    return apiSuccess(stat)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const stat = await updateDocument('site_stats', params.id, body)
    if (!stat) return apiError('Not found', 404)
    return apiSuccess(stat, 'Stat updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await deleteDocument('site_stats', params.id)
    return apiSuccess(null, 'Stat deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(req, { params })
  return PUT(req, { params })
}
