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

export function lessonCompletionEmailHtml(name: string, lessonTitle: string, courseTitle: string, nextUrl: string) {
  return `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:auto;padding:24px;color:#0f172a">
      <h2 style="margin:0 0 8px">Nice work, ${name || 'student'}! 👏</h2>
      <p style="color:#475569;line-height:1.6">
        You just completed <strong>${lessonTitle}</strong> in <strong>${courseTitle}</strong>.
        Keep the momentum going — your next lesson is waiting.
      </p>
      <a href="${nextUrl}"
         style="display:inline-block;margin-top:12px;padding:12px 20px;background:#4f6ef7;color:#fff;text-decoration:none;border-radius:9999px">
        Continue learning
      </a>
    </div>`
}

export function quizResultEmailHtml(name: string, score: number, passed: boolean, courseTitle: string, dashboardUrl: string) {
  const emoji = passed ? '🎉' : '💪'
  const headline = passed ? 'You passed!' : 'Almost there!'
  return `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:auto;padding:24px;color:#0f172a">
      <h2 style="margin:0 0 8px">${emoji} ${headline}</h2>
      <p style="color:#475569;line-height:1.6">
        ${name || 'Student'}, you scored <strong>${score}%</strong> on the assessment for
        <strong>${courseTitle}</strong>. ${passed ? 'Great job — keep it up!' : 'Review the material and try again — you have got this.'}
      </p>
      <a href="${dashboardUrl}"
         style="display:inline-block;margin-top:12px;padding:12px 20px;background:#4f6ef7;color:#fff;text-decoration:none;border-radius:9999px">
        Go to dashboard
      </a>
    </div>`
}

export function weeklyDigestEmailHtml(name: string, courses: { title: string; progress: number; url: string }[]) {
  const items = courses.map(c => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e2e8f0">
        <div style="font-weight:600">${c.title}</div>
        <div style="height:6px;background:#e2e8f0;border-radius:3px;margin-top:6px">
          <div style="height:6px;width:${c.progress}%;background:#4f6ef7;border-radius:3px"></div>
        </div>
        <div style="font-size:12px;color:#64748b;margin-top:4px">${c.progress}% complete</div>
      </td>
    </tr>`).join('')

  return `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:auto;padding:24px;color:#0f172a">
      <h2 style="margin:0 0 8px">Your weekly learning update 📚</h2>
      <p style="color:#475569;line-height:1.6">
        Hi ${name || 'student'}, here's where you left off. A few minutes a day adds up fast!
      </p>
      ${courses.length > 0 ? `<table style="width:100%;border-collapse:collapse;margin:12px 0">${items}</table>` : `<p style="color:#64748b">You have no active courses yet — pick one below to start.</p>`}
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/courses"
         style="display:inline-block;margin-top:12px;padding:12px 20px;background:#4f6ef7;color:#fff;text-decoration:none;border-radius:9999px">
        Browse courses
      </a>
    </div>`
}
