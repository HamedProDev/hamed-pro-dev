import { NextRequest } from 'next/server'
import { getDocuments } from '@/lib/supabase/db'
import { apiSuccess, apiError } from '@/lib/supabase/helpers'

// Public certificate verification.
export async function GET(req: NextRequest, { params }: { params: { number: string } }) {
  try {
    const rows = await getDocuments('certificates', {
      filters: [
        { field: 'certificate_number', operator: 'eq', value: params.number },
        { field: 'is_verified', operator: 'eq', value: true },
      ],
    })
    const cert = rows[0]
    if (!cert) return apiError('Certificate not found or revoked', 404)

    // Do not expose user_id publicly.
    const { user_id, ...safe } = cert
    return apiSuccess({
      ...safe,
      verified: true,
      verifyUrl: `/verify/${params.number}`,
    })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
