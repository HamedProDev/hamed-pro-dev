import { NextRequest } from 'next/server'
import { getDocuments, createDocument, updateDocument } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

async function getSettings() {
  const docs = await getDocuments('settings')
  if (docs.length === 0) {
    return await createDocument('settings', {})
  }
  return docs[0]
}

async function handleGet() {
  try {
    const settings = await getSettings()
    return apiSuccess(settings)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

async function handleSave(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const existing = await getDocuments('settings')
    if (existing.length === 0) {
      const settings = await createDocument('settings', body)
      return apiSuccess(settings, 'Settings updated')
    }

    const snakeFields = [
      'site_name', 'tagline', 'description', 'keywords',
      'logo', 'favicon', 'og_image',
      'profile_photo', 'hero_name', 'hero_title', 'hero_subtitle',
      'contact_email', 'contact_phone', 'address', 'location',
      'maintenance_mode', 'allow_registration',
    ]

    const camelToSnake: Record<string, string> = {
      siteName: 'site_name', ogImage: 'og_image',
      profilePhoto: 'profile_photo', heroName: 'hero_name',
      heroTitle: 'hero_title', heroSubtitle: 'hero_subtitle',
      contactEmail: 'contact_email', contactPhone: 'contact_phone',
      maintenanceMode: 'maintenance_mode', allowRegistration: 'allow_registration',
    }

    const updateData: any = {}

    for (const key of Object.keys(body)) {
      if (key === '_method' || key === 'id' || key === 'created_at' || key === 'updated_at') continue
      const dbKey = camelToSnake[key] || key
      if (snakeFields.includes(dbKey) || dbKey === 'social_links' || dbKey === 'email_notifications' || dbKey === 'seo_defaults' || dbKey === 'integrations') {
        updateData[dbKey] = body[key]
      }
    }

    if (body.socialLinks && typeof body.socialLinks === 'object') {
      updateData.social_links = body.socialLinks
    }
    if (body.emailNotifications && typeof body.emailNotifications === 'object') {
      updateData.email_notifications = body.emailNotifications
    }
    if (body.seoDefaults && typeof body.seoDefaults === 'object') {
      updateData.seo_defaults = body.seoDefaults
    }
    if (body.integrations && typeof body.integrations === 'object') {
      updateData.integrations = body.integrations
    }

    const settings = await updateDocument('settings', existing[0].id, updateData)
    return apiSuccess(settings, 'Settings updated')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export const GET = handleGet
export const POST = handleSave
export const PUT = handleSave
