import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import Organization from '@/lib/db/models/Organization'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const org = await Organization.findById(params.id).lean()
    if (!org) return apiError('Not found', 404)
    return apiSuccess(org)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    const org = await Organization.findByIdAndUpdate(params.id, body, { new: true })
    if (!org) return apiError('Not found', 404)
    return apiSuccess(org, 'Organization updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const org = await Organization.findByIdAndDelete(params.id)
    if (!org) return apiError('Not found', 404)
    return apiSuccess(null, 'Organization deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(req, { params })
  return PUT(req, { params })
}
