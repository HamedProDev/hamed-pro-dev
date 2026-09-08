import { NextRequest } from 'next/server'
import { createDocument, getDocuments } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.name || !body.email || !body.message) return apiError('Name, email, and message are required')
    await createDocument('contacts', body)

    // Notify the site owner (no-op when Resend isn't configured).
    const notify = process.env.CONTACT_NOTIFY_EMAIL || process.env.RESEND_FROM_EMAIL
    if (notify) {
      sendEmail({
        to: notify,
        subject: `New contact message from ${body.name || 'someone'}`,
        html: `<div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:auto;padding:24px;color:#0f172a">
          <h2 style="margin:0 0 8px">New contact message</h2>
          <p style="color:#475569;line-height:1.6"><strong>From:</strong> ${body.name} &lt;${body.email}&gt;</p>
          ${body.subject ? `<p style="color:#475569"><strong>Subject:</strong> ${body.subject}</p>` : ''}
          <p style="color:#475569;white-space:pre-wrap;line-height:1.6">${body.message}</p>
        </div>`,
      }).catch(() => {})
    }

    return apiSuccess(null, 'Message sent successfully')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const messages = await getDocuments('contacts', { orderBy: { field: 'created_at', direction: 'desc' } })
    return apiSuccess(messages)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
