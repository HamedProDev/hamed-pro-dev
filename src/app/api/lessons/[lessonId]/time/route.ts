import { NextRequest } from 'next/server'
import { getDocuments, createDocument, updateDocument } from '@/lib/supabase/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/supabase/helpers'

// Increment the user's time spent on a lesson (heartbeat). Idempotent-ish:
// the client sends an increment in seconds; we upsert lesson_progress.
export async function POST(req: NextRequest, { params }: { params: { lessonId: string } }) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const lessonId = params.lessonId
    const { seconds, courseId } = await req.json().catch(() => ({}))
    const delta = Math.max(0, Math.min(Number(seconds) || 0, 60))
    if (!lessonId || !courseId) return apiError('lessonId and courseId are required', 400)

    const existing = await getDocuments('lesson_progress', {
      filters: [
        { field: 'user_id', operator: 'eq', value: user.uid },
        { field: 'lesson_id', operator: 'eq', value: lessonId },
      ],
    })

    if (existing.length > 0) {
      const row = existing[0]
      const total = (row.time_spent_seconds || 0) + delta
      const updated = await updateDocument('lesson_progress', row.id, {
        time_spent_seconds: total,
        last_accessed_at: new Date().toISOString(),
      })
      return apiSuccess({ timeSpentSeconds: updated?.time_spent_seconds ?? total })
    }

    const created = await createDocument('lesson_progress', {
      user_id: user.uid,
      course_id: courseId,
      lesson_id: lessonId,
      completed: false,
      time_spent_seconds: delta,
      last_accessed_at: new Date().toISOString(),
    })
    return apiSuccess({ timeSpentSeconds: created?.time_spent_seconds ?? delta })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
