import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import SiteStats from '@/lib/db/models/SiteStats'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET() {
  try {
    await connectDB()
    const stats = await SiteStats.find().sort({ order: 1 }).lean()
    return apiSuccess(stats)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    const stat = await SiteStats.create(body)
    return apiSuccess(stat, 'Stat created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
