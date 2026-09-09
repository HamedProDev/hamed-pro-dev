import { NextRequest } from 'next/server'
import { getDocuments, getDocument } from '@/lib/supabase/db'
import { getCurrentUser, apiSuccess, apiError, resolveCourseId } from '@/lib/supabase/helpers'

// Get the current user's progress + lesson unlock state for a course.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiSuccess({ enrolled: false })

    // params.id may be a course slug (public pages) or UUID — resolve first.
    const courseId = await resolveCourseId(params.id)
    if (!courseId) return apiSuccess({ enrolled: false })
    const enr = await getDocuments('enrollments', {
      filters: [
        { field: 'user_id', operator: 'eq', value: user.uid },
        { field: 'course_id', operator: 'eq', value: courseId },
      ],
    })
    const enrollment = enr[0] || null
    if (!enrollment) return apiSuccess({ enrolled: false })

    const lessons = await getDocuments('lessons', {
      filters: [{ field: 'course_id', operator: 'eq', value: courseId }],
      orderBy: { field: 'order_index', direction: 'asc' },
    })
    const progress = await getDocuments('lesson_progress', {
      filters: [
        { field: 'user_id', operator: 'eq', value: user.uid },
        { field: 'course_id', operator: 'eq', value: courseId },
      ],
    })
    const completedLessonIds = progress.filter(p => p.completed).map(p => p.lesson_id)

    const orderedCompletedCount = lessons.filter(l => completedLessonIds.includes(l.id)).length
    const completedCount = orderedCompletedCount
    const totalCount = lessons.length
    // First lesson that hasn't been completed = the unlocked one.
    const unlockedLessonId = lessons.find(l => !completedLessonIds.includes(l.id))?.id || null
    const isCompleted = totalCount > 0 && completedCount >= totalCount

    const course = await getDocument('courses', courseId)
    const finalQuiz = course?.final_quiz || []

    return apiSuccess({
      enrolled: true,
      enrollment,
      completedLessonIds,
      completedCount,
      totalCount,
      unlockedLessonId,
      isCompleted,
      needsFinalQuiz: isCompleted && finalQuiz.length > 0 && enrollment.status !== 'completed',
      isCertificateIssued: enrollment.status === 'completed',
    })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
