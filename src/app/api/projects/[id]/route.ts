import { NextRequest } from 'next/server'
import { getDocument, updateDocument, deleteDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await getDocument('projects', params.id)
    if (!project) return apiError('Project not found', 404)
    return apiSuccess(project)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const project = await updateDocument('projects', params.id, mapFormToDb('projects', body))
    if (!project) return apiError('Project not found', 404)
    return apiSuccess(project, 'Project updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await deleteDocument('projects', params.id)
    return apiSuccess(null, 'Project deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(req, { params })
  return PUT(req, { params })
}
