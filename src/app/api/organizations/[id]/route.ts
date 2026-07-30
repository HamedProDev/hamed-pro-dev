import { NextRequest } from 'next/server'
import { getDocument, updateDocument, deleteDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const org = await getDocument('organizations', params.id)
    if (!org) return apiError('Not found', 404)
    return apiSuccess(org)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const org = await updateDocument('organizations', params.id, mapFormToDb('organizations', body))
    if (!org) return apiError('Not found', 404)
    return apiSuccess(org, 'Organization updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await deleteDocument('organizations', params.id)
    return apiSuccess(null, 'Organization deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    if (body._method === 'DELETE') {
      await requireAdmin(req)
      await deleteDocument('organizations', params.id)
      return apiSuccess(null, 'Organization deleted')
    }
    await requireAdmin(req)
    const org = await updateDocument('organizations', params.id, mapFormToDb('organizations', body))
    if (!org) return apiError('Not found', 404)
    return apiSuccess(org, 'Organization updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
