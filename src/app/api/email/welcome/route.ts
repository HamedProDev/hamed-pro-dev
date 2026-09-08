import { NextRequest } from 'next/server'
import { sendEmail, welcomeEmailHtml } from '@/lib/email'
import { apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()
    if (!email) return apiError('Email is required', 400)
    const sent = await sendEmail({ to: email, subject: 'Welcome to the community', html: welcomeEmailHtml(name || '') })
    return apiSuccess({ sent }, sent ? 'Welcome email sent' : 'Email not configured — skipped')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
