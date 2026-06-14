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
      const allowedFields = [
        'siteName', 'tagline', 'description', 'keywords', 'logo', 'favicon', 'ogImage',
        'profilePhoto', 'heroName', 'heroTitle', 'heroSubtitle',
        'contactEmail', 'contactPhone', 'address', 'location',
        'maintenanceMode', 'allowRegistration',
      ]
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          settings.set(field, body[field])
        }
      }
      if (body.socialLinks && typeof body.socialLinks === 'object') {
        settings.set('socialLinks', body.socialLinks)
      }
      if (body.emailNotifications && typeof body.emailNotifications === 'object') {
        settings.set('emailNotifications', body.emailNotifications)
      }
      if (body.seoDefaults && typeof body.seoDefaults === 'object') {
        settings.set('seoDefaults', body.seoDefaults)
      }
      if (body.integrations && typeof body.integrations === 'object') {
        settings.set('integrations', body.integrations)
      }
      await settings.save()
    }
    const plain = settings.toObject()
    return apiSuccess(plain, 'Settings updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
