import { NextRequest } from 'next/server'
import { getDocuments, createDocument, deleteDocument } from '@/lib/supabase/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest, { params }: { params: { lessonId: string } }) {
  try {
    const comments = await getDocuments('lesson_comments', {
      filters: [{ field: 'lesson_id', operator: 'eq', value: params.lessonId }],
      orderBy: { field: 'created_at', direction: 'asc' },
    })

    // Resolve author names.
    const userIds = Array.from(new Set(comments.map((c: any) => c.user_id)))
    let authors: Record<string, { name: string; avatar_url: string | null }> = {}
    if (userIds.length > 0) {
      const profiles = await getDocuments('profiles', {
        filters: [{ field: 'id', operator: 'in', value: userIds }],
      })
      authors = Object.fromEntries(
        profiles.map((p: any) => [p.id, { name: p.name || p.email?.split('@')[0] || 'Student', avatar_url: p.avatar_url || null }])
      )
    }

    return apiSuccess(comments.map((c: any) => ({ ...c, author: authors[c.user_id] || { name: 'Student', avatar_url: null } })))
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { lessonId: string } }) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const { content } = await req.json()
    if (!content || !content.trim()) return apiError('Comment cannot be empty', 400)

    const comment = await createDocument('lesson_comments', {
      lesson_id: params.lessonId,
      user_id: user.uid,
      content: content.trim().slice(0, 1000),
    })

    return apiSuccess({ ...comment, author: { name: user.name, avatar_url: user.image || null } }, 'Comment posted')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { lessonId: string } }) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const { commentId } = await req.json()
    if (!commentId) return apiError('commentId is required', 400)

    const comments = await getDocuments('lesson_comments', {
      filters: [{ field: 'id', operator: 'eq', value: commentId }],
    })
    const comment = comments[0]
    if (!comment) return apiError('Comment not found', 404)
    if (comment.user_id !== user.uid && user.role !== 'admin') return apiError('Unauthorized', 403)

    await deleteDocument('lesson_comments', commentId)
    return apiSuccess(null, 'Comment deleted')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
