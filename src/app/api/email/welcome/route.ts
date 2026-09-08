import { NextRequest } from 'next/server'
import { sendEmail, welcomeEmailHtml } from '@/lib/email'
import { apiSuccess, apiError } from '@/lib/supabase/helpers'
import { awardXp, XP } from '@/lib/gamification'

export async function POST(req: NextRequest) {
  try {
    const { email, name, referred_by } = await req.json()
    if (!email) return apiError('Email is required', 400)
    const sent = await sendEmail({ to: email, subject: 'Welcome to the community', html: welcomeEmailHtml(name || '') })

    // Reward the referrer when a new member signs up through an invite link.
    if (referred_by) {
      await awardXp(referred_by, XP.REFERRAL, 'referral', { referred: email })
    }

    return apiSuccess({ sent }, sent ? 'Welcome email sent' : 'Email not configured — skipped')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
