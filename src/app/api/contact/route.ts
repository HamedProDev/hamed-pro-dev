import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/auth/middleware'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.name || !body.email || !body.message) return apiError('Name, email, and message are required')
    // In production: save to DB + send email via Resend
    return apiSuccess(null, 'Message sent successfully')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
