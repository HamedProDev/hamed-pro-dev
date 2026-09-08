import { NextRequest } from 'next/server'
import { updateDocument, deleteDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

// Admin actions on a single contact message.
// POST body: { action?: 'read'|'unread'|'delete' }
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json().catch(() => ({}))
    const action = body.action || 'read'

    if (action === 'delete') {
      await deleteDocument('contacts', params.id)
      return apiSuccess(null, 'Message deleted')
    }
    if (action === 'unread') {
      const row = await updateDocument('contacts', params.id, { is_read: false })
      return apiSuccess(row, 'Marked as unread')
    }
    const row = await updateDocument('contacts', params.id, { is_read: true })
    return apiSuccess(row, 'Marked as read')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    await deleteDocument('contacts', params.id)
    return apiSuccess(null, 'Message deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
