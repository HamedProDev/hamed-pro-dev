import { NextRequest } from 'next/server'
import { getDocument, updateDocument, deleteDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const skill = await getDocument('skills', params.id)
    if (!skill) return apiError('Skill not found', 404)
    return apiSuccess(skill)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const skill = await updateDocument('skills', params.id, body)
    if (!skill) return apiError('Skill not found', 404)
    return apiSuccess(skill, 'Skill updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(request)
    await deleteDocument('skills', params.id)
    return apiSuccess(null, 'Skill deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(request, { params })
  return PUT(request, { params })
}
