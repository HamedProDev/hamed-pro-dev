import { NextRequest } from 'next/server'
import { getDocuments, createDocument } from '@/lib/supabase/db'
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

    await createDocument('newsletter_subscribers', { email, name, source: source || 'homepage', token: crypto.randomBytes(32).toString('hex'), is_active: true })
    return apiSuccess(null, 'Subscribed successfully')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    if (!token) return apiError('Token required')
    const subs = await getDocuments('newsletter_subscribers', { filters: [{ field: 'token', operator: 'eq', value: token }] })
    const sub = subs[0]
    if (!sub) return apiError('Invalid token', 404)
    return apiSuccess(null, 'Unsubscribed successfully')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
