// Minimal email sender via Resend REST API.
// No-op (silently) when RESEND_API_KEY is not configured, so the app works without it.

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL || 'no-reply@hamedprodev.rw'
  if (!apiKey) return false // email not configured — skip silently

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function welcomeEmailHtml(name: string) {
  return `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:auto;padding:24px;color:#0f172a">
      <h2 style="margin:0 0 8px">Welcome to the community, ${name || 'friend'} 👋</h2>
      <p style="color:#475569;line-height:1.6">
        Thanks for joining Hamed Hussein's learning platform. Enroll in free courses,
        track your progress, and earn verifiable certificates.
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/courses"
         style="display:inline-block;margin-top:12px;padding:12px 20px;background:#4f6ef7;color:#fff;text-decoration:none;border-radius:9999px">
        Start learning
      </a>
    </div>`
}

export function certificateEmailHtml(name: string, courseTitle: string, verifyUrl: string) {
  return `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:auto;padding:24px;color:#0f172a">
      <h2 style="margin:0 0 8px">🎉 Congratulations, ${name || 'student'}!</h2>
      <p style="color:#475569;line-height:1.6">
        You've completed <strong>${courseTitle}</strong> and earned your certificate.
        You can view, download, and share it below.
      </p>
      <a href="${verifyUrl}"
         style="display:inline-block;margin-top:12px;padding:12px 20px;background:#4f6ef7;color:#fff;text-decoration:none;border-radius:9999px">
        View certificate
      </a>
    </div>`
}
