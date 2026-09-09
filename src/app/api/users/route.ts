import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const supabase = createServiceClient()
    const { data: users } = await supabase.auth.admin.listUsers({ perPage: 1000 })

    // Merge auth users with profiles (source of truth for role/name/avatar).
    const { data: profiles } = await supabase.from('profiles').select('id, name, avatar_url, role, bio, xp_points, current_streak')
    const profileById = new Map((profiles || []).map((p: any) => [p.id, p]))

    const merged = (users?.users || []).map(u => {
      const p = profileById.get(u.id)
      return {
        id: u.id,
        name: p?.name || u.user_metadata?.name || u.email?.split('@')[0] || '',
        email: u.email,
        avatar_url: p?.avatar_url || u.user_metadata?.avatar_url || null,
        role: p?.role || 'visitor',
        disabled: !!u.banned_until,
        xp_points: p?.xp_points || 0,
        current_streak: p?.current_streak || 0,
        created_at: u.created_at,
      }
    })

    return apiSuccess(merged)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const supabase = createServiceClient()

    const { data, error } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: { name: body.name },
    })

    if (error) {
      return apiError(error.message === 'User already registered' ? 'Email already registered' : error.message, 409)
    }

    return apiSuccess({
      id: data.user.id,
      name: body.name,
      email: body.email,
    }, 'User created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
