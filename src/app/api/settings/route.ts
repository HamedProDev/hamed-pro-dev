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
    const fieldMap: Record<string, string> = {
      siteName: 'site_name', tagline: 'tagline', description: 'description', keywords: 'keywords',
      logo: 'logo', favicon: 'favicon', ogImage: 'og_image',
      profilePhoto: 'profile_photo', heroName: 'hero_name', heroTitle: 'hero_title', heroSubtitle: 'hero_subtitle',
      contactEmail: 'contact_email', contactPhone: 'contact_phone', address: 'address', location: 'location',
      maintenanceMode: 'maintenance_mode', allowRegistration: 'allow_registration',
    }
    const updateData: any = {}
    for (const [camel, snake] of Object.entries(fieldMap)) {
      if (body[camel] !== undefined) {
        updateData[snake] = body[camel]
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
