import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { BlogPost } from '@/lib/db/models/BlogPost'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'
import { readingTime } from '@/lib/utils/format'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const post = await BlogPost.findById(params.id).lean()
    if (!post) return apiError('Post not found', 404)
    return apiSuccess(post)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await connectDB()
    const body = await req.json()
    if (body.content) body.readingTime = readingTime(body.content)
    const post = await BlogPost.findByIdAndUpdate(params.id, body, { new: true })
    if (!post) return apiError('Post not found', 404)
    return apiSuccess(post, 'Post updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await connectDB()
    const post = await BlogPost.findByIdAndDelete(params.id)
    if (!post) return apiError('Post not found', 404)
    return apiSuccess(null, 'Post deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
