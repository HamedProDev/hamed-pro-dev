import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createDocument } from '@/lib/supabase/db'
import { requireAdmin } from '@/lib/supabase/helpers'

const AUTH_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`

async function authFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${AUTH_URL}${path}`, {
    ...options,
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

// Admin bootstrap only: ensures the admin auth user + profile exist.
// NOTE: no content is seeded here — all content is created by the admin
// via /admin-control.
export async function POST(req: NextRequest) {
  try {
    // Gate: require a shared secret header (SEED_SECRET) or an authenticated admin.
    const seedSecret = process.env.SEED_SECRET
    const provided = req.headers.get('x-seed-secret')
    if (seedSecret && provided === seedSecret) {
      // authorized via secret
    } else {
      try {
        await requireAdmin(req)
      } catch {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }
    }

    const results: string[] = []

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: false, error: 'Missing Supabase env vars.' }, { status: 500 })
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'hamussein01@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || ''
    if (!adminPassword) {
      return NextResponse.json({ success: false, error: 'ADMIN_PASSWORD env var is required.' }, { status: 500 })
    }
    let adminUser: any = null

    const usersData = await authFetch('/admin/users')
    const found = usersData?.users?.find((u: any) => u.email === adminEmail)
    if (found) {
      adminUser = found
      // Ensure profile exists for existing user
      try {
        await createDocument('profiles', { id: found.id, email: adminEmail, name: 'Hamed Hussein', role: 'admin', avatar_url: '' })
        results.push('Admin user exists, profile created')
      } catch {
        results.push('Admin user exists, profile already exists')
      }
    } else {
      adminUser = await authFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: { display_name: 'Hamed Hussein' },
          app_metadata: { role: 'admin' },
        }),
      })
      adminUser = adminUser.user ?? adminUser
      // Create profile for the new user
      await createDocument('profiles', { id: adminUser.id, email: adminEmail, name: 'Hamed Hussein', role: 'admin', avatar_url: '' }).catch(() => {})
      results.push('Admin user created')
    }

    return NextResponse.json({ success: true, data: { results, loginUrl: '/login' } })
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : JSON.stringify(error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
