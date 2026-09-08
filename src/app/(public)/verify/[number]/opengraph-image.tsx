import { ImageResponse } from 'next/og'
import { createServiceClient } from '@/lib/supabase/server'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Verified certificate'

export default async function OpenGraphImage({ params }: { params: { number: string } }) {
  let recipient = 'Certified Student'
  let course = 'Course Certificate'

  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('certificates')
      .select('recipient_name, course_title')
      .eq('certificate_number', params.number)
      .eq('is_verified', true)
      .single()
    if (data) {
      recipient = data.recipient_name || recipient
      course = data.course_title || course
    }
  } catch {
    // Fall back to defaults.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
          background: 'linear-gradient(135deg, #062b23 0%, #0b3d31 50%, #046a4f 100%)',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 6, textTransform: 'uppercase', color: '#86efac', marginBottom: 24 }}>Certificate of Completion</div>
        <div style={{ fontSize: 72, fontWeight: 800, marginBottom: 16, textAlign: 'center' }}>{recipient}</div>
        <div style={{ fontSize: 34, color: '#d1fae5', marginBottom: 8 }}>{course}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24, padding: '10px 22px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', fontSize: 22, color: '#6ee7b7' }}>
          ✓ Verified · Hamed Hussein
        </div>
      </div>
    ),
    { ...size },
  )
}
