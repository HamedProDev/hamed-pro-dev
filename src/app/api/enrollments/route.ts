import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
import { getCurrentUser, apiSuccess, apiError, resolveCourseId } from '@/lib/supabase/helpers'
import { awardXp, XP } from '@/lib/gamification'
import { createServiceClient } from '@/lib/supabase/server'

// Enrollments FK to profiles — repair a missing profile row instead of 500-ing.
async function ensureProfile(user: { uid: string; email?: string | null; name?: string }) {
  try {
    const svc = createServiceClient()
    const { data } = await svc.from('profiles').select('id').eq('id', user.uid).maybeSingle()
    if (!data) {
      await svc.from('profiles').upsert(
        {
          id: user.uid,
          email: user.email || '',
          name: user.name || (user.email || '').split('@')[0] || 'Student',
          role: 'visitor',
        },
        { onConflict: 'id' }
      )
    }
  } catch {
    // best effort — the insert below will surface any real problem
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const { courseId: rawCourseId } = await req.json()
    if (!rawCourseId) return apiError('courseId is required', 400)
    // The course page sends a slug — resolve it to the real course UUID.
    const courseId = await resolveCourseId(rawCourseId)
    if (!courseId) return apiError('Course not found', 404)
    await ensureProfile(user)

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
