import { NextRequest } from 'next/server'
import { getDocument, updateDocument, deleteDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const user = await getDocument('profiles', params.id)
    if (!user) return apiError('User not found', 404)
    return apiSuccess(user)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const user = await updateDocument('profiles', params.id, mapFormToDb('profiles', body))
    if (!user) return apiError('User not found', 404)
    return apiSuccess(user, 'User updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await deleteDocument('profiles', params.id)
    return apiSuccess(null, 'User deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    if (body._method === 'DELETE') {
      await requireAdmin(req)
      await deleteDocument('profiles', params.id)
      return apiSuccess(null, 'User deleted')
    }
    await requireAdmin(req)
    const user = await updateDocument('profiles', params.id, mapFormToDb('profiles', body))
    if (!user) return apiError('User not found', 404)
    return apiSuccess(user, 'User updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
