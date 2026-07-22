import { NextRequest } from 'next/server'
import { requireAdmin, apiSuccess, apiError } from '@/lib/firebase/auth'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return apiError('No file provided', 400)
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { getFirebaseAdmin } = await import('@/lib/firebase/config')
    const { storage } = getFirebaseAdmin()
    const bucket = storage.bucket()
    const filename = `${Date.now()}-${file.name}`
    const fileRef = bucket.file(`hamedpro/${filename}`)

    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
    })

    await fileRef.makePublic()
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/hamedpro/${filename}`

    return apiSuccess({ url: publicUrl, filename })
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
