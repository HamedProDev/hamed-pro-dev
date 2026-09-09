import { NextRequest } from 'next/server'
import { getDocuments, createDocument, deleteDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

// Newsletter subscriber management (admin): list, manually add, remove.
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const subscribers = await getDocuments('newsletter_subscribers', {
      orderBy: { field: 'created_at', direction: 'desc' },
    })
    return apiSuccess({
      subscribers,
      total: subscribers.length,
      active: subscribers.filter((s: any) => s.is_active).length,
    })
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const email = String(body.email || '').trim().toLowerCase()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return apiError('A valid email is required', 400)
    }

    const existing = await getDocuments('newsletter_subscribers', {
      filters: [{ field: 'email', operator: 'eq', value: email }],
    })
    if (existing.length > 0) return apiError('Already subscribed', 409)

    const sub = await createDocument('newsletter_subscribers', { email, is_active: true })
    return apiSuccess(sub, 'Subscriber added')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return apiError('id is required', 400)
    await deleteDocument('newsletter_subscribers', id)
    return apiSuccess(null, 'Subscriber removed')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
