import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { Contact } from '@/lib/db/models/Contact'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    if (!body.name || !body.email || !body.message) return apiError('Name, email, and message are required')
    await Contact.create(body)
    return apiSuccess(null, 'Message sent successfully')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function GET() {
  try {
    const session = await requireAdmin()
    await connectDB()
    const messages = await Contact.find().sort({ createdAt: -1 }).lean()
    return apiSuccess(messages)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
