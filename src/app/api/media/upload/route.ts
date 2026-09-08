import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function POST(req: NextRequest) {
  try {
    // Authenticated users may upload (admins anywhere; users only to their own folder).
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return apiError('No file provided', 400)
    }

    const allowed =
      file.type.startsWith('image/') || file.type === 'application/pdf'
    if (!allowed) {
      return apiError('Only images and PDF files are allowed', 400)
    }

    if (file.size > 10 * 1024 * 1024) {
      return apiError('File too large. Max 10MB', 400)
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${crypto.randomUUID()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const isAdmin = user.role === 'admin'
    const folder = isAdmin
      ? ((formData.get('folder') as string) || 'general')
      : `users/${user.uid}`

    const supabase = createServiceClient()
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(`${folder}/${fileName}`, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return apiError(error.message, 500)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(`${folder}/${fileName}`)

    return apiSuccess({ url: publicUrl, filename: file.name })
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
