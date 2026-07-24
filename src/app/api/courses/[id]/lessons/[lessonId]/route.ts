import { NextRequest } from 'next/server'
import { getDocument, updateDocument, deleteDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError, mapFormToDb } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest, { params }: { params: { id: string; lessonId: string } }) {
  try {
    const lesson = await getDocument('lessons', params.lessonId)
    if (!lesson) return apiError('Lesson not found', 404)
    return apiSuccess(lesson)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string; lessonId: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const lesson = await updateDocument('lessons', params.lessonId, mapFormToDb('lessons', body))
    if (!lesson) return apiError('Lesson not found', 404)
    return apiSuccess(lesson, 'Lesson updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string; lessonId: string } }) {
  try {
    await requireAdmin(req)
    await deleteDocument('lessons', params.lessonId)
    return apiSuccess(null, 'Lesson deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string; lessonId: string } }) {
  const body = await req.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(req, { params })
  return PUT(req, { params })
}
