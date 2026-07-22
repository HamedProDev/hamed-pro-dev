import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from './server'

export async function requireAdmin(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return { user, profile }
}

export async function getCurrentUser(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    uid: user.id,
    email: user.email,
    name: profile?.name || user.email?.split('@')[0] || '',
    image: profile?.avatar_url || null,
    role: profile?.role || 'visitor',
  }
}

export function apiSuccess(data: any, message = 'Success') {
  return NextResponse.json({ success: true, message, data })
}

export function apiError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function apiPaginated(data: any[], total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}
