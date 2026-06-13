import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { encode } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findOne({ email }).select('+password')
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
    if (!secret) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 })
    }

    const maxAge = 30 * 24 * 60 * 60
    const expires = new Date(Date.now() + maxAge * 1000)

    const token = await encode({
      secret,
      token: {
        sub: user._id.toString(),
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
      salt: '',
    })

    const response = NextResponse.json({ success: true, url: '/dashboard' })

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax' as const,
      path: '/',
      expires,
    }

    response.cookies.set('authjs.session-token', token, cookieOptions)
    response.cookies.set('__Secure-authjs.session-token', token, cookieOptions)

    return response
  } catch (e: any) {
    console.error('Login error:', e)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
