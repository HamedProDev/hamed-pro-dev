import { NextRequest } from 'next/server'
import { createDocument, getDocuments } from '@/lib/supabase/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.name || !body.email || !body.message) return apiError('Name, email, and message are required')
    await createDocument('contacts', body)
    return apiSuccess(null, 'Message sent successfully')
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const messages = await getDocuments('contacts', { orderBy: { field: 'created_at', direction: 'desc' } })
    return apiSuccess(messages)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
