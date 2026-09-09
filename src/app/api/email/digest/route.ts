import { NextRequest } from 'next/server'
import { getDocuments } from '@/lib/supabase/db'
import { createServiceClient } from '@/lib/supabase/server'
import { apiSuccess, apiError } from '@/lib/supabase/helpers'
import { sendEmail, weeklyDigestEmailHtml } from '@/lib/email'

// Sends the weekly "continue learning" digest to every user with active enrollments.
// Trigger via Vercel Cron (POST) with the CRON_SECRET bearer token, or by an admin.
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET
    const auth = req.headers.get('authorization') || ''
    if (secret && auth !== `Bearer ${secret}`) {
      return apiError('Unauthorized', 401)
    }

    const supabase = createServiceClient()
    const { data: users } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const recipients = users?.users || []
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    let sent = 0
    for (const u of recipients) {
      if (!u.email) continue
      const enrollments = await getDocuments('enrollments', {
        filters: [
          { field: 'user_id', operator: 'eq', value: u.id },
          { field: 'status', operator: 'eq', value: 'active' },
        ],
      }).catch(() => [] as any[])

      if (enrollments.length === 0) continue

      const courses = await Promise.all(
        enrollments.map(async (e: any) => {
          const rows = await getDocuments('courses', { filters: [{ field: 'id', operator: 'eq', value: e.course_id }] }).catch(() => [])
          const course = rows[0]
          return {
            title: course?.title || 'Course',
            progress: e.progress || 0,
            url: `${baseUrl}/courses/${course?.slug || e.course_id}`,
          }
        })
      )

      const name = u.user_metadata?.name || u.email.split('@')[0]
      const ok = await sendEmail({
        to: u.email,
        subject: 'Your weekly learning update 📚',
        html: weeklyDigestEmailHtml(name, courses),
      })
      if (ok) sent++
    }

    return apiSuccess({ sent, recipients: recipients.length }, `Digest sent to ${sent} students`)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
