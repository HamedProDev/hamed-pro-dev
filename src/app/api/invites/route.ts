import { NextRequest } from 'next/server'
import { getDocuments } from '@/lib/supabase/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/supabase/helpers'

// Referral stats for the current user.
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return apiError('Unauthorized', 401)

    const referrals = await getDocuments('profiles', {
      filters: [{ field: 'referred_by', operator: 'eq', value: user.uid }],
      orderBy: { field: 'created_at', direction: 'desc' },
    })

    return apiSuccess({
      code: user.uid,
      inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${user.uid}`,
      count: referrals.length,
      referrals: referrals.map((r: any) => ({
        id: r.id,
        name: r.name || r.email?.split('@')[0] || 'Student',
        created_at: r.created_at,
      })),
    })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
