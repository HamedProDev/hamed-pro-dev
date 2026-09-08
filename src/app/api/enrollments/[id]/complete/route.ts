import { NextRequest } from 'next/server'
import { getDocuments, updateDocument, createDocument, getDocument } from '@/lib/supabase/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/supabase/helpers'

// Final assessment: grade the course final quiz and issue the certificate on pass.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const enrollmentId = params.id
    const enrollment = await getDocument('enrollments', enrollmentId)
    if (!enrollment || enrollment.user_id !== user.uid) return apiError('Enrollment not found', 404)

    const course = await getDocument('courses', enrollment.course_id)
    const finalQuiz = course?.final_quiz || []
    if (finalQuiz.length === 0) return apiError('This course has no final assessment', 400)

    // Verify all lessons are complete before the final assessment.
    const lessons = await getDocuments('lessons', {
      filters: [{ field: 'course_id', operator: 'eq', value: enrollment.course_id }],
    })
    const progress = await getDocuments('lesson_progress', {
      filters: [
        { field: 'user_id', operator: 'eq', value: user.uid },
        { field: 'course_id', operator: 'eq', value: enrollment.course_id },
        { field: 'completed', operator: 'eq', value: true },
      ],
    })
    if (progress.length < lessons.length) return apiError('Complete all lessons first', 403)

    const { answers } = await req.json()
    if (!Array.isArray(answers) || answers.length < finalQuiz.length) {
      return apiError('Please answer all final quiz questions', 400)
    }

    let correct = 0
    finalQuiz.forEach((q: any, i: number) => {
      if (Number(answers[i]) === Number(q.correctIndex)) correct++
    })
    const score = Math.round((correct / finalQuiz.length) * 100)
    const passed = score >= 70

    if (!passed) {
      return apiSuccess({ passed: false, score }, 'Final quiz not passed yet')
    }

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
    let certificateNumber = certs[0]?.certificate_number
    if (!certificateNumber) {
      certificateNumber = `HH-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
      await createDocument('certificates', {
        certificate_number: certificateNumber,
        user_id: user.uid,
        course_id: enrollment.course_id,
        enrollment_id: enrollmentId,
        recipient_name: user.name || user.email || 'Student',
        course_title: course?.title || 'Course',
        score,
        issue_date: new Date().toISOString().slice(0, 10),
        is_verified: true,
      })
    }

    return apiSuccess({ passed: true, score, certificateNumber, enrollment: updatedEnrollment }, 'Certificate issued')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
