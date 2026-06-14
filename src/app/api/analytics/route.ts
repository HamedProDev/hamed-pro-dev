import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { Analytics } from '@/lib/db/models/Analytics'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    await connectDB()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const data = await Analytics.find({ date: { $gte: thirtyDaysAgo } }).sort({ date: 1 }).lean()
    return apiSuccess(data)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { page } = await req.json()
    if (!page) return apiError('Page is required')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    await Analytics.findOneAndUpdate(
      { page, date: today },
      { $inc: { views: 1 } },
      { upsert: true, new: true }
    )
    return apiSuccess(null, 'Tracked')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
