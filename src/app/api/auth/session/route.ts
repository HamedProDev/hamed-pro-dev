import { NextRequest, NextResponse } from 'next/server'
import { getFirebaseAdmin } from '@/lib/firebase/config'

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    if (!idToken) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 })
    }

    const { auth: adminAuth } = getFirebaseAdmin()
    const expiresIn = 60 * 60 * 24 * 30 * 1000
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })

    const response = NextResponse.json({ success: true })
    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    })

    return response
  } catch (e: any) {
    console.error('Session creation error:', e)
    return NextResponse.json({ error: 'Session creation failed' }, { status: 500 })
  }
}
