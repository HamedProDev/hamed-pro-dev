import { NextRequest } from 'next/server'
import { getDocuments, createDocument, updateDocument } from '@/lib/supabase/db'
import { apiSuccess, apiError } from '@/lib/supabase/helpers'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email, name, source } = await req.json()
    if (!email) return apiError('Email is required')

    const existing = await getDocuments('newsletter_subscribers', { filters: [{ field: 'email', operator: 'eq', value: email }] })
    const sub = existing[0]
    if (sub) {
      if (sub.is_active) return apiError('Already subscribed', 409)
      return apiSuccess(null, 'Resubscribed successfully')
    }

    await createDocument('newsletter_subscribers', { email, is_active: true })
    return apiSuccess(null, 'Subscribed successfully')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    if (!email) return apiError('Email is required')
    const subs = await getDocuments('newsletter_subscribers', { filters: [{ field: 'email', operator: 'eq', value: email }] })
    const sub = subs[0]
    if (!sub) return apiError('Subscriber not found', 404)
    await updateDocument('newsletter_subscribers', sub.id, { is_active: false })
    return apiSuccess(null, 'Unsubscribed successfully')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
