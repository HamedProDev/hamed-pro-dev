import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const session = await requireAdmin()
    await connectDB()
    const users = await User.find().sort({ createdAt: -1 }).lean()
    return apiSuccess(users)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const existing = await User.findOne({ email: body.email })
    if (existing) return apiError('Email already registered', 409)
    const hashedPassword = await bcrypt.hash(body.password, 12)
    const user = await User.create({ ...body, password: hashedPassword, role: 'visitor' })
    return apiSuccess({ id: user._id, name: user.name, email: user.email }, 'User created')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
