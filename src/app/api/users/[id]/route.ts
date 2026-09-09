import { NextRequest } from 'next/server'
import { getDocument, updateDocument } from '@/lib/supabase/db'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const supabase = createServiceClient()

    const [{ data: profile }, { data: enrollments }, { data: certificates }, { data: lessonProgress }, { data: xpSum }] =
      await Promise.all([
        supabase.from('profiles').select('*').eq('id', params.id).maybeSingle(),
        supabase
          .from('enrollments')
          .select('id, course_id, status, progress, enrolled_at, completed_at, courses(title, slug)')
          .eq('user_id', params.id)
          .order('enrolled_at', { ascending: false }),
        supabase
          .from('certificates')
          .select('id, certificate_number, course_id, course_title, score, issue_date, is_verified')
          .eq('user_id', params.id)
          .order('issue_date', { ascending: false }),
        supabase
          .from('lesson_progress')
          .select('id, course_id, lesson_id, completed, quiz_score, time_spent_seconds, last_accessed_at')
          .eq('user_id', params.id),
        supabase.from('user_xp_events').select('points').eq('user_id', params.id),
      ])

    const totalXp = xpSum?.reduce((sum: number, e: any) => sum + (e.points || 0), 0) ?? profile?.xp_points ?? 0
    const totalSeconds = lessonProgress?.reduce((sum: number, p: any) => sum + (p.time_spent_seconds || 0), 0) ?? 0
    const completedLessons = lessonProgress?.filter((p: any) => p.completed).length ?? 0

    return apiSuccess({
      ...(profile || { id: params.id }),
      enrollments: enrollments || [],
      certificates: certificates || [],
      total_xp: totalXp,
      time_spent_seconds: totalSeconds,
      completed_lessons: completedLessons,
      total_lessons_tracked: lessonProgress?.length ?? 0,
    })
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

// Admin actions on a user: update role, suspend/unsuspend, or delete.
// POST body: { action?: 'updateRole'|'suspend'|'unsuspend'|'deleteUser', role?, ... }
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const supabase = createServiceClient()
    const action = body.action || 'update'

    if (action === 'deleteUser') {
      const { error } = await supabase.auth.admin.deleteUser(params.id)
      if (error) return apiError(error.message, 500)
      // Clean up the profile row too (auth deletion doesn't cascade to it) —
      // otherwise the users list keeps showing a ghost.
      await supabase.from('profiles').delete().eq('id', params.id)
      return apiSuccess(null, 'User deleted')
    }

    if (action === 'suspend') {
      const { error } = await supabase.auth.admin.updateUserById(params.id, { ban_duration: '87600h' })
      if (error) return apiError(error.message, 500)
      return apiSuccess(null, 'User suspended')
    }

    if (action === 'unsuspend') {
      const { error } = await supabase.auth.admin.updateUserById(params.id, { ban_duration: 'none' })
      if (error) return apiError(error.message, 500)
      return apiSuccess(null, 'User unsuspended')
    }

    if (action === 'updateRole') {
      const role = body.role
      if (!['admin', 'editor', 'visitor'].includes(role)) return apiError('Invalid role', 400)
      await updateDocument('profiles', params.id, { role })
      await supabase.auth.admin.updateUserById(params.id, { user_metadata: { role } }).catch(() => {})
      return apiSuccess({ role }, 'Role updated')
    }

    // Generic profile update.
    const user = await updateDocument('profiles', params.id, { name: body.name, bio: body.bio })
    return apiSuccess(user, 'User updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
