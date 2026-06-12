import { NextRequest } from 'next/server'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const timestamp = Math.round(Date.now() / 1000)
    const paramsToSign = { timestamp, folder: 'hamedpro', ...body }
    // In production: sign with Cloudinary API secret
    return apiSuccess({ timestamp, signature: 'placeholder', api_key: process.env.CLOUDINARY_API_KEY, cloud_name: process.env.CLOUDINARY_CLOUD_NAME })
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
