import { auth } from './auth'
import { NextRequest, NextResponse } from 'next/server'

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session
}

function hasAdminGateCookie(req?: NextRequest): boolean {
  if (!req) return false
  const cookie = req.headers.get('cookie') || ''
  return cookie.includes('admin-auth-gate=hamedpro-admin-verified')
}

export async function requireAdmin(req?: NextRequest) {
  const session = await auth()
  const hasSession = session?.user && session.user.role === 'admin'
  const hasGate = hasAdminGateCookie(req)
  if (!hasSession && !hasGate) {
    throw new Error('Unauthorized')
  }
  return session || { user: { role: 'admin' } }
}

export function apiSuccess(data: any, message?: string) {
  return NextResponse.json({ success: true, data, message })
}

export function apiError(error: string, status: number = 400) {
  return NextResponse.json({ success: false, error }, { status })
}

export function apiPaginated(data: any[], total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
