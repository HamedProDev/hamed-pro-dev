import { NextRequest } from 'next/server'
import { getDocuments, updateDocument, createDocument, getDocument } from '@/lib/supabase/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/supabase/helpers'
import { sendEmail, certificateEmailHtml } from '@/lib/email'

// Record lesson completion (ordered — no skipping) and grade any lesson quiz.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const enrollmentId = params.id
    const enrollment = await getDocument('enrollments', enrollmentId)
    if (!enrollment || enrollment.user_id !== user.uid) return apiError('Enrollment not found', 404)

    const { lessonId, answers } = await req.json()
    if (!lessonId) return apiError('lessonId is required', 400)

    const lessons = await getDocuments('lessons', {
      filters: [{ field: 'course_id', operator: 'eq', value: enrollment.course_id }],
      orderBy: { field: 'order_index', direction: 'asc' },
    })
    const lesson = lessons.find(l => l.id === lessonId)
    if (!lesson) return apiError('Lesson not found', 404)

    // Enforce sequential progress: this lesson must be the first uncompleted one.
    const progress = await getDocuments('lesson_progress', {
      filters: [
        { field: 'user_id', operator: 'eq', value: user.uid },
        { field: 'course_id', operator: 'eq', value: enrollment.course_id },
      ],
    })
    const completedIds = new Set(progress.filter(p => p.completed).map(p => p.lesson_id))
    const firstUncompleted = lessons.find(l => !completedIds.has(l.id))
    if (firstUncompleted && firstUncompleted.id !== lessonId) {
      return apiError('Complete previous lessons first', 403)
    }

    // Grade the lesson quiz (if present). Passing = score >= 70.
    const quiz = lesson.quiz || []
    let score: number | null = null
    if (quiz.length > 0) {
      if (!Array.isArray(answers) || answers.length < quiz.length) {
        return apiError('Please answer all quiz questions', 400)
      }
      let correct = 0
      quiz.forEach((q: any, i: number) => {
        if (Number(answers[i]) === Number(q.correctIndex)) correct++
      })
      score = Math.round((correct / quiz.length) * 100)
      if (score < 70) {
        return apiSuccess({ passed: false, score, lessonId }, 'Quiz not passed yet')
      }
    }

    // Upsert lesson_progress row
    const existing = await getDocuments('lesson_progress', {
      filters: [
        { field: 'user_id', operator: 'eq', value: user.uid },
        { field: 'lesson_id', operator: 'eq', value: lessonId },
      ],
    })
    if (existing.length > 0) {
      await updateDocument('lesson_progress', existing[0].id, {
        completed: true,
        quiz_score: score ?? null,
        completed_at: new Date().toISOString(),
      })
    } else {
      await createDocument('lesson_progress', {
        user_id: user.uid,
        course_id: enrollment.course_id,
        lesson_id: lessonId,
        completed: true,
        quiz_score: score ?? null,
        completed_at: new Date().toISOString(),
      })
    }

    // Recompute course progress percentage.
    const updatedProgress = await getDocuments('lesson_progress', {
      filters: [
        { field: 'user_id', operator: 'eq', value: user.uid },
        { field: 'course_id', operator: 'eq', value: enrollment.course_id },
        { field: 'completed', operator: 'eq', value: true },
      ],
    })
    const percent = lessons.length > 0 ? Math.round((updatedProgress.length / lessons.length) * 100) : 0

    if (percent === 100) {
      const course = await getDocument('courses', enrollment.course_id)
      const finalQuiz = course?.final_quiz || []

      if (finalQuiz.length > 0 && enrollment.status !== 'completed') {
        // Await final assessment before issuing the certificate.
        const updatedEnrollment = await updateDocument('enrollments', enrollmentId, {
          progress: 100,
          status: 'active',
        })
        return apiSuccess({
          passed: true,
          score,
          progress: 100,
          enrollment: updatedEnrollment,
          needsFinalQuiz: true,
        })
      }

      if (enrollment.status !== 'completed') {
        const updatedEnrollment = await updateDocument('enrollments', enrollmentId, {
          progress: 100,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        const certs = await getDocuments('certificates', {
          filters: [
            { field: 'user_id', operator: 'eq', value: user.uid },
            { field: 'course_id', operator: 'eq', value: enrollment.course_id },
          ],
        })
        if (certs.length === 0) {
          const certificateNumber = `HH-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
          await createDocument('certificates', {
            certificate_number: certificateNumber,
            user_id: user.uid,
            course_id: enrollment.course_id,
            enrollment_id: enrollmentId,
            recipient_name: user.name || user.email || 'Student',
            course_title: course?.title || 'Course',
            score: null,
            issue_date: new Date().toISOString().slice(0, 10),
            is_verified: true,
          })
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
          sendEmail({
            to: user.email || '',
            subject: `Your certificate for ${course?.title || 'the course'} is ready 🎉`,
            html: certificateEmailHtml(user.name || 'Student', course?.title || 'Course', `${baseUrl}/verify/${certificateNumber}`),
          }).catch(() => {})
        }
        return apiSuccess({ passed: true, score, progress: 100, enrollment: updatedEnrollment, needsFinalQuiz: false })
      }
    }

    const updatedEnrollment = await updateDocument('enrollments', enrollmentId, {
      progress: percent,
    })
    return apiSuccess({ passed: true, score, progress: percent, enrollment: updatedEnrollment, needsFinalQuiz: false })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
