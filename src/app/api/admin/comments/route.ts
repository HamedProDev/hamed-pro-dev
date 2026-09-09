import { NextRequest } from 'next/server'
import { updateDocument, deleteDocument } from '@/lib/supabase/db'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

// Comment moderation: list all comments (any status) with authors, approve/hide/delete.
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'all'

    const supabase = createServiceClient()
    let query = supabase
      .from('lesson_comments')
      .select('*, profiles(name, email, avatar_url), lessons(title, course_id)')
      .order('created_at', { ascending: false })
    if (status !== 'all') query = query.eq('status', status)

    const { data, error } = await query
    if (error) return apiError(error.message, 500)

    const comments = (data || []).map((c: any) => ({
      id: c.id,
      lesson_id: c.lesson_id,
      lesson_title: c.lessons?.title || 'Lesson',
      course_id: c.lessons?.course_id || null,
      content: c.content,
      status: c.status,
      created_at: c.created_at,
      author: c.profiles ? { name: c.profiles.name || c.profiles.email?.split('@')[0] || 'Student', avatar_url: c.profiles.avatar_url } : null,
    }))

    return apiSuccess(comments)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const { id, action } = body
    if (!id) return apiError('id is required', 400)

    if (action === 'approve') {
      await updateDocument('lesson_comments', id, { status: 'visible' })
      return apiSuccess(null, 'Comment approved')
    }
    if (action === 'hide') {
      await updateDocument('lesson_comments', id, { status: 'hidden' })
      return apiSuccess(null, 'Comment hidden')
    }
    if (action === 'delete') {
      await deleteDocument('lesson_comments', id)
      return apiSuccess(null, 'Comment deleted')
    }
    return apiError('Invalid action', 400)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
