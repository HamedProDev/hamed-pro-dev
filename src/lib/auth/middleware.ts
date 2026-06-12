import { auth } from './auth'
import { NextResponse } from 'next/server'

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  if (session.user.role !== 'admin') {
    throw new Error('Forbidden')
  }
  return session
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
