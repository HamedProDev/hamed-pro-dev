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
  } catch {
    return apiSuccess({})
  }
}

// Fields the admin UI may save, mapped to their database column names.
// The final payload is always intersected with the live row's columns below,
// so a stale/partial database schema can never break the whole save.
const snakeFields = [
  'site_name', 'tagline', 'description', 'keywords',
  'logo', 'favicon', 'og_image',
  'profile_photo', 'hero_name', 'hero_title', 'hero_subtitle',
  'contact_email', 'contact_phone', 'address', 'location',
  'maintenance_mode', 'allow_registration',
  'resume_url', 'about_image',
]

const camelToSnake: Record<string, string> = {
  siteName: 'site_name', ogImage: 'og_image',
  profilePhoto: 'profile_photo', heroName: 'hero_name',
  heroTitle: 'hero_title', heroSubtitle: 'hero_subtitle',
  contactEmail: 'contact_email', contactPhone: 'contact_phone',
  maintenanceMode: 'maintenance_mode', allowRegistration: 'allow_registration',
  resumeUrl: 'resume_url', hireServices: 'hire_services', aboutImage: 'about_image',
}

const jsonFields = ['social_links', 'email_notifications', 'seo_defaults', 'integrations', 'hire_services']

function buildUpdateData(body: Record<string, any>): Record<string, any> {
  const updateData: any = {}

  for (const key of Object.keys(body)) {
    if (key === '_method' || key === 'id' || key === 'created_at' || key === 'updated_at') continue
    const dbKey = camelToSnake[key] || key
    if (snakeFields.includes(dbKey) || jsonFields.includes(dbKey)) {
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
  if (Array.isArray(body.hireServices)) {
    updateData.hire_services = body.hireServices
  }

  return updateData
}

async function ensureSettingsRow(): Promise<Record<string, any>> {
  let rows = await getDocuments('settings')
  if (rows.length > 0) return rows[0]

  // No row yet — create an empty one so this save and every later save
  // follow the exact same update path.
  try {
    await createDocument('settings', {})
  } catch (error) {
    console.error('[settings] failed to create the initial settings row:', error)
    throw error
  }
  rows = await getDocuments('settings')
  if (rows.length === 0) {
    throw new Error('Settings row could not be created')
  }
  return rows[0]
}

async function handleSave(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()

    const updateData = buildUpdateData(body)

    // Make sure a row exists, then only write keys that are real columns on
    // the live row — otherwise one missing column (e.g. an unapplied migration)
    // would fail the entire save with "Could not find the 'x' column".
    const row = await ensureSettingsRow()
    const liveColumns = new Set(Object.keys(row))

    const payload: Record<string, any> = {}
    const dropped: string[] = []
    for (const [key, value] of Object.entries(updateData)) {
      if (liveColumns.has(key)) {
        payload[key] = value
      } else {
        dropped.push(key)
      }
    }

    if (Object.keys(payload).length === 0 && dropped.length > 0) {
      const msg = `No settings were saved — the database is missing these columns: ${dropped.join(', ')}. Run supabase/fix-settings-columns.sql to add them.`
      console.error('[settings] nothing to save:', msg)
      return apiError(msg, 500)
    }

    let settings: Record<string, any>
    try {
      settings = await updateDocument('settings', row.id, payload)
    } catch (error) {
      console.error('[settings] failed to save settings:', error)
      throw error
    }

    const message = dropped.length > 0
      ? `Settings saved, but these fields were skipped because the database is missing their columns: ${dropped.join(', ')}. Run supabase/fix-settings-columns.sql to add them.`
      : 'Settings updated'
    return apiSuccess(settings, message)
  } catch (error: any) {
    if (error?.message !== 'Unauthorized') {
      console.error('[settings] handleSave failed:', error)
    }
    return apiError(error?.message || 'Failed to save settings', error?.message === 'Unauthorized' ? 401 : 500)
  }
}

export const GET = handleGet
export const POST = handleSave
export const PUT = handleSave
