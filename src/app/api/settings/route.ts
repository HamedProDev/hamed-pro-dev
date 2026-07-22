import { NextRequest } from 'next/server'
import { getDocuments, createDocument, updateDocument } from '@/lib/firebase/firestore'
import { requireAdmin, apiSuccess, apiError } from '@/lib/firebase/auth'

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
    const allowedFields = [
      'siteName', 'tagline', 'description', 'keywords', 'logo', 'favicon', 'ogImage',
      'profilePhoto', 'heroName', 'heroTitle', 'heroSubtitle',
      'contactEmail', 'contactPhone', 'address', 'location',
      'maintenanceMode', 'allowRegistration',
    ]
    const updateData: any = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }
    if (body.socialLinks && typeof body.socialLinks === 'object') {
      updateData.socialLinks = body.socialLinks
    }
    if (body.emailNotifications && typeof body.emailNotifications === 'object') {
      updateData.emailNotifications = body.emailNotifications
    }
    if (body.seoDefaults && typeof body.seoDefaults === 'object') {
      updateData.seoDefaults = body.seoDefaults
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
