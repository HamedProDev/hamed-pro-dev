import { NextRequest } from 'next/server'
import { getDocuments } from '@/lib/supabase/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/supabase/helpers'

// Enriched list of the current user's enrollments, with course title/slug,
// progress, and lesson unlock state — all in ONE request (avoids N+1).
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const enrollments = await getDocuments('enrollments', {
      filters: [{ field: 'user_id', operator: 'eq', value: user.uid }],
      orderBy: { field: 'enrolled_at', direction: 'desc' },
    })
    if (enrollments.length === 0) return apiSuccess([])

    const courseIds: string[] = Array.from(new Set(enrollments.map((e: any) => e.course_id)))

    const [courses, lessons, progress] = await Promise.all([
      getDocuments('courses', { filters: [{ field: 'id', operator: 'in', value: courseIds }] }),
      getDocuments('lessons', {
        filters: [{ field: 'course_id', operator: 'in', value: courseIds }],
        orderBy: { field: 'order_index', direction: 'asc' },
      }),
      getDocuments('lesson_progress', {
        filters: [
          { field: 'user_id', operator: 'eq', value: user.uid },
          { field: 'course_id', operator: 'in', value: courseIds },
        ],
      }),
    ])

    const courseMap = new Map(courses.map((c: any) => [c.id, c]))
    const lessonsByCourse = new Map<string, any[]>()
    for (const l of lessons) {
      if (!lessonsByCourse.has(l.course_id)) lessonsByCourse.set(l.course_id, [])
      lessonsByCourse.get(l.course_id)!.push(l)
    }
    const completedByCourse = new Map<string, Set<string>>()
    for (const p of progress) {
      if (!p.completed) continue
      if (!completedByCourse.has(p.course_id)) completedByCourse.set(p.course_id, new Set())
      completedByCourse.get(p.course_id)!.add(p.lesson_id)
    }

    const rows = enrollments.map((e: any) => {
      const course = courseMap.get(e.course_id)
      const courseLessons = lessonsByCourse.get(e.course_id) || []
      const completed = completedByCourse.get(e.course_id) || new Set<string>()
      const completedCount = courseLessons.filter(l => completed.has(l.id)).length
      const totalCount = courseLessons.length
      const unlockedLessonId = courseLessons.find(l => !completed.has(l.id))?.id || null
      const isCompleted = totalCount > 0 && completedCount >= totalCount
      const finalQuiz = course?.final_quiz || []
      return {
        id: e.id,
        course_id: e.course_id,
        progress: e.progress ?? 0,
        status: e.status,
        title: course?.title || 'Course',
        slug: course?.slug || e.course_id,
        unlockedLessonId,
        totalCount,
        completedCount,
        needsFinalQuiz: isCompleted && finalQuiz.length > 0 && e.status !== 'completed',
        isCertificateIssued: e.status === 'completed',
      }
    })

    return apiSuccess(rows)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
