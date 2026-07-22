import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const supabase = createServiceClient()
    const { data: users } = await supabase.auth.admin.listUsers()

    const profiles = users.users.map(u => ({
      id: u.id,
      name: u.user_metadata?.name || '',
      email: u.email,
      avatar_url: u.user_metadata?.avatar_url || null,
      role: u.user_metadata?.role || 'visitor',
      disabled: u.banned_until ? true : false,
      created_at: u.created_at,
    }))

    return apiSuccess(profiles)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest) {
  try {
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
    return apiError(error.message, 500)
  }
}
