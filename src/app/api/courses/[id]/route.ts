import { NextRequest } from 'next/server'
import { getDocument, updateDocument, deleteDocument, getDocuments } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const course = await getDocument('courses', params.id)
    if (!course) return apiError('Course not found', 404)
    const lessons = await getDocuments('lessons', { filters: [{ field: 'course', operator: 'eq', value: params.id }], orderBy: { field: 'order', direction: 'asc' } })
    return apiSuccess({ ...course, lessons })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const course = await updateDocument('courses', params.id, body)
    if (!course) return apiError('Course not found', 404)
    return apiSuccess(course, 'Course updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await deleteDocument('courses', params.id)
    return apiSuccess(null, 'Course deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(req, { params })
  return PUT(req, { params })
}
