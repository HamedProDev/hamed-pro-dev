import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import SiteStats from '@/lib/db/models/SiteStats'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const stat = await SiteStats.findById(params.id).lean()
    if (!stat) return apiError('Not found', 404)
    return apiSuccess(stat)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    const stat = await SiteStats.findByIdAndUpdate(params.id, body, { new: true })
    if (!stat) return apiError('Not found', 404)
    return apiSuccess(stat, 'Stat updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const stat = await SiteStats.findByIdAndDelete(params.id)
    if (!stat) return apiError('Not found', 404)
    return apiSuccess(null, 'Stat deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(req, { params })
  return PUT(req, { params })
}
