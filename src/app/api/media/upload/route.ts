import { NextRequest } from 'next/server'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const timestamp = body.timestamp || Math.round(Date.now() / 1000)
    const folder = body.folder || 'hamedpro'

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return apiError('Cloudinary not configured', 500)
    }

    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex')

    return apiSuccess({ timestamp, signature, api_key: apiKey, cloud_name: cloudName })
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
