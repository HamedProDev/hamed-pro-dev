import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase/helpers'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ success: true, data: user })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
