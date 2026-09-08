import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, mapFormToDb } from '@/lib/supabase/helpers'
import { createServiceClient } from '@/lib/supabase/server'

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

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    // Only allow the user to update their own editable fields.
    const allowed = ['name', 'bio', 'avatar_url', 'website', 'github_url', 'linkedin_url', 'twitter_url', 'location', 'headline', 'interests']
    const data = mapFormToDb('profiles', body)
    const update: Record<string, any> = {}
    for (const key of allowed) {
      if (key in data) update[key] = data[key]
    }

    // Upsert so a missing profile row (e.g. created before the trigger fix) is
    // repaired instead of failing with "Cannot coerce the result to a single
    // JSON object".
    const supabase = createServiceClient()
    const { data: updated, error } = await supabase
      .from('profiles')
      .upsert({ id: user.uid, email: user.email, ...update }, { onConflict: 'id' })
      .select()
      .maybeSingle()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
