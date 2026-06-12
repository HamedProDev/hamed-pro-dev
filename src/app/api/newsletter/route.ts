import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { NewsletterSubscriber } from '@/lib/db/models/Newsletter'
import { apiSuccess, apiError } from '@/lib/auth/middleware'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, name, source } = await req.json()
    if (!email) return apiError('Email is required')

    const existing = await NewsletterSubscriber.findOne({ email })
    if (existing) {
      if (existing.status === 'subscribed') return apiError('Already subscribed', 409)
      existing.status = 'subscribed'
      existing.unsubscribedAt = undefined
      await existing.save()
      return apiSuccess(null, 'Resubscribed successfully')
    }

    await NewsletterSubscriber.create({ email, name, source: source || 'homepage', token: crypto.randomBytes(32).toString('hex') })
    return apiSuccess(null, 'Subscribed successfully')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    if (!token) return apiError('Token required')
    const sub = await NewsletterSubscriber.findOne({ token })
    if (!sub) return apiError('Invalid token', 404)
    sub.status = 'unsubscribed'
    sub.unsubscribedAt = new Date()
    await sub.save()
    return apiSuccess(null, 'Unsubscribed successfully')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
