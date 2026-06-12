import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { Job } from '@/lib/db/models/Job'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const job = await Job.findById(params.id).lean()
    if (!job) return apiError('Job not found', 404)
    return apiSuccess(job)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await connectDB()
    const body = await req.json()
    const job = await Job.findByIdAndUpdate(params.id, body, { new: true })
    if (!job) return apiError('Job not found', 404)
    return apiSuccess(job, 'Job updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await connectDB()
    const job = await Job.findByIdAndDelete(params.id)
    if (!job) return apiError('Job not found', 404)
    return apiSuccess(null, 'Job deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
