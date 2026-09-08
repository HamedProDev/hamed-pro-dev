import { NextRequest } from 'next/server'
import { getDocuments, updateDocument, createDocument, getDocument } from '@/lib/supabase/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/supabase/helpers'

// Record lesson completion / quiz score for the current user's enrollment.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const enrollmentId = params.id
    const enrollment = await getDocument('enrollments', enrollmentId)
    if (!enrollment || enrollment.user_id !== user.uid) return apiError('Enrollment not found', 404)

    const { lessonId, completed, quizScore } = await req.json()
    if (!lessonId) return apiError('lessonId is required', 400)

    const existing = await getDocuments('lesson_progress', {
      filters: [
        { field: 'user_id', operator: 'eq', value: user.uid },
        { field: 'lesson_id', operator: 'eq', value: lessonId },
      ],
    })

    let progressRow
    if (existing.length > 0) {
      progressRow = await updateDocument('lesson_progress', existing[0].id, {
        completed: completed ?? true,
        ...(quizScore !== undefined ? { quiz_score: quizScore } : {}),
        completed_at: completed !== false ? new Date().toISOString() : null,
      })
    } else {
      progressRow = await createDocument('lesson_progress', {
        user_id: user.uid,
        course_id: enrollment.course_id,
        lesson_id: lessonId,
        completed: completed ?? true,
        quiz_score: quizScore ?? null,
        completed_at: completed !== false ? new Date().toISOString() : null,
      })
    }

    // Recompute course progress percentage.
    const lessons = await getDocuments('lessons', {
      filters: [{ field: 'course_id', operator: 'eq', value: enrollment.course_id }],
    })
    const done = await getDocuments('lesson_progress', {
      filters: [
        { field: 'user_id', operator: 'eq', value: user.uid },
        { field: 'course_id', operator: 'eq', value: enrollment.course_id },
        { field: 'completed', operator: 'eq', value: true },
      ],
    })
    const percent = lessons.length > 0 ? Math.round((done.length / lessons.length) * 100) : 0

    let updatedEnrollment = enrollment
    if (percent === 100 && enrollment.status !== 'completed') {
      updatedEnrollment = await updateDocument('enrollments', enrollmentId, {
        progress: 100,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })

      // Issue certificate if none exists yet.
      const certs = await getDocuments('certificates', {
        filters: [
          { field: 'user_id', operator: 'eq', value: user.uid },
          { field: 'course_id', operator: 'eq', value: enrollment.course_id },
        ],
      })
      if (certs.length === 0) {
        const course = await getDocument('courses', enrollment.course_id)
        await createDocument('certificates', {
          certificate_number: `HH-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          user_id: user.uid,
          course_id: enrollment.course_id,
          enrollment_id: enrollmentId,
          recipient_name: user.name || user.email || 'Student',
          course_title: course?.title || 'Course',
          score: null,
          issue_date: new Date().toISOString().slice(0, 10),
          is_verified: true,
        })
      }
    } else {
      updatedEnrollment = await updateDocument('enrollments', enrollmentId, {
        progress: percent,
      })
    }

    return apiSuccess({ progressRow, enrollment: updatedEnrollment, progress: percent })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
