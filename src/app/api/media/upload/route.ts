import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return apiError('No file provided', 400)
    }

    if (!file.type.startsWith('image/')) {
      return apiError('Only image files allowed', 400)
    }

    if (file.size > 5 * 1024 * 1024) {
      return apiError('File too large. Max 5MB', 400)
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${crypto.randomUUID()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(`images/${fileName}`, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return apiError(error.message, 500)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(`images/${fileName}`)

    return apiSuccess({ url: publicUrl, filename: file.name })
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
