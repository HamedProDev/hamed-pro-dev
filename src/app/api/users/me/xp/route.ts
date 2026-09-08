import { NextRequest } from 'next/server'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/supabase/helpers'
import { getGamification } from '@/lib/gamification'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const data = await getGamification(user.uid)
    return apiSuccess(data)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
