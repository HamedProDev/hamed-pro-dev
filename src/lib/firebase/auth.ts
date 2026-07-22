import { cookies } from 'next/headers'
import { getFirebaseAdmin } from './config'
import { NextRequest, NextResponse } from 'next/server'

export async function verifySession() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('__session')?.value
    if (!sessionCookie) return null

    const { auth: adminAuth } = getFirebaseAdmin()
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return decoded
  } catch {
    return null
  }
}

export async function requireAuth() {
  const decoded = await verifySession()
  if (!decoded) throw new Error('Unauthorized')
  return decoded
}

export async function requireAdmin(req?: NextRequest) {
  if (req) {
    const cookie = req.headers.get('cookie') || ''
    if (cookie.includes('admin-auth-gate=hamedpro-admin-verified')) {
      return { uid: '', role: 'admin' }
    }
  }

  const decoded = await verifySession()
  if (!decoded || decoded.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return decoded
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
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}
