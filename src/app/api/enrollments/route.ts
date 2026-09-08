import { NextRequest } from 'next/server'
import { getDocuments, createDocument, updateDocument } from '@/lib/supabase/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/supabase/helpers'
import { awardXp, XP } from '@/lib/gamification'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const { courseId } = await req.json()
    if (!courseId) return apiError('courseId is required', 400)

    const existing = await getDocuments('enrollments', {
      filters: [
        { field: 'user_id', operator: 'eq', value: user.uid },
        { field: 'course_id', operator: 'eq', value: courseId },
      ],
    })
    if (existing.length > 0) return apiSuccess(existing[0], 'Already enrolled')

    const enrollment = await createDocument('enrollments', {
      user_id: user.uid,
      course_id: courseId,
      status: 'active',
      progress: 0,
    })
    await awardXp(user.uid, XP.COURSE_ENROLLED, 'course_enrolled', { course_id: courseId })
    return apiSuccess(enrollment, 'Enrolled successfully')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const enrollments = await getDocuments('enrollments', {
      filters: [{ field: 'user_id', operator: 'eq', value: user.uid }],
      orderBy: { field: 'enrolled_at', direction: 'desc' },
    })
    return apiSuccess(enrollments)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
