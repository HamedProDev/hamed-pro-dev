import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { SiteSettings } from '@/lib/db/models/SiteSettings'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth/middleware'

async function getSettings() {
  await connectDB()
  let settings = await SiteSettings.findOne().lean()
  if (!settings) {
    const created = await SiteSettings.create({})
    settings = created.toObject()
  }
  return settings
}

export async function GET() {
  try {
    const settings = await getSettings()
    return apiSuccess(settings)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req)
    await connectDB()
    const body = await req.json()
    let settings = await SiteSettings.findOne()
    if (!settings) {
      settings = await SiteSettings.create(body)
    } else {
      Object.assign(settings, body)
      await settings.save()
    }
    return apiSuccess(settings, 'Settings updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
