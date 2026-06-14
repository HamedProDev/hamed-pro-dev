import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import Organization from '@/lib/db/models/Organization'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET() {
  try {
    await connectDB()
    const orgs = await Organization.find().sort({ order: 1 }).lean()
    return apiSuccess(orgs)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    const org = await Organization.create(body)
    return apiSuccess(org, 'Organization created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
