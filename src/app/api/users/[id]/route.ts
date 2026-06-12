import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await connectDB()
    const user = await User.findById(params.id).lean()
    if (!user) return apiError('User not found', 404)
    return apiSuccess(user)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await connectDB()
    const body = await req.json()
    const user = await User.findByIdAndUpdate(params.id, body, { new: true })
    if (!user) return apiError('User not found', 404)
    return apiSuccess(user, 'User updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await connectDB()
    await User.findByIdAndDelete(params.id)
    return apiSuccess(null, 'User deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
