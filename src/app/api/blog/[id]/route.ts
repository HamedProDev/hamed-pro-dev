import { NextRequest } from 'next/server'
import { getDocument, updateDocument, deleteDocument } from '@/lib/firebase/firestore'
import { requireAdmin, apiSuccess, apiError } from '@/lib/firebase/auth'
import { readingTime } from '@/lib/utils/format'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await getDocument('blogPosts', params.id)
    if (!post) return apiError('Post not found', 404)
    return apiSuccess(post)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    if (body.content) body.readingTime = readingTime(body.content)
    const post = await updateDocument('blogPosts', params.id, body)
    if (!post) return apiError('Post not found', 404)
    return apiSuccess(post, 'Post updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await deleteDocument('blogPosts', params.id)
    return apiSuccess(null, 'Post deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.clone().json().catch(() => ({}))
  if (body._method === 'DELETE') return DELETE(req, { params })
  return PUT(req, { params })
}
