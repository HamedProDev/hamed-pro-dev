import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { Project } from '@/lib/db/models/Project'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const project = await Project.findById(params.id).lean()
    if (!project) return apiError('Project not found', 404)
    return apiSuccess(project)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    const project = await Project.findByIdAndUpdate(params.id, body, { new: true })
    if (!project) return apiError('Project not found', 404)
    return apiSuccess(project, 'Project updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await connectDB()
    const project = await Project.findByIdAndDelete(params.id)
    if (!project) return apiError('Project not found', 404)
    return apiSuccess(null, 'Project deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(req, { params })
  return PUT(req, { params })
}
