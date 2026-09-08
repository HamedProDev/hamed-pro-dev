import { ImageResponse } from 'next/og'
import { createServiceClient } from '@/lib/supabase/server'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Course cover'

export default async function OpenGraphImage({ params }: { params: { slug: string } }) {
  let title = 'Hamed Hussein — Free Courses'
  let category = 'Learn. Build. Get certified.'

  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('courses')
      .select('title, category')
      .eq('slug', params.slug)
      .single()
    if (data) {
      title = data.title || title
      category = data.category || category
    }
  } catch {
    // Fall back to defaults if the course can't be loaded.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 60,
          background: 'linear-gradient(135deg, #0b1220 0%, #12234a 60%, #1c3a8a 100%)',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #4f6ef7, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>HH</div>
          <div style={{ fontSize: 26, fontWeight: 600 }}>Hamed Hussein</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.15 }}>{title}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ fontSize: 22, color: '#a5b4fc', padding: '10px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.08)' }}>{category}</div>
            <div style={{ fontSize: 22, color: '#67e8f9', padding: '10px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.08)' }}>Free course</div>
          </div>
        </div>
        <div style={{ fontSize: 20, color: '#94a3b8' }}>Enroll free · Track progress · Earn a certificate</div>
      </div>
    ),
    { ...size },
  )
}
