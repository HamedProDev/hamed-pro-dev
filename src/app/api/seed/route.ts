import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createDocument, countDocuments } from '@/lib/supabase/db'
import { requireAdmin } from '@/lib/supabase/helpers'
import { seedProjects, seedCourses, seedSettings, seedSkills, seedAchievements, seedSiteStats, seedTestimonials } from '@/lib/seed-data'

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

export async function POST(req: NextRequest) {
  try {
    // Gate seeding: require a shared secret header (SEED_SECRET) or an authenticated admin.
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
      return NextResponse.json({ success: false, error: 'ADMIN_PASSWORD env var is required to seed.' }, { status: 500 })
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

    const projectCount = await countDocuments('projects')
    if (projectCount === 0) {
      const projects = seedProjects
      await Promise.all(projects.map(p => createDocument('projects', p)))
      results.push(`${projects.length} projects seeded`)
    } else {
      results.push(`${projectCount} projects exist`)
    }

    const courseCount = await countDocuments('courses')
    if (courseCount === 0) {
      const courses = seedCourses
      await Promise.all(courses.map(c => createDocument('courses', c)))
      results.push(`${courses.length} courses seeded`)
    } else {
      results.push(`${courseCount} courses exist`)
    }

    const settingsCount = await countDocuments('settings')
    if (settingsCount === 0) {
      await createDocument('settings', seedSettings)
      results.push('Site settings created')
    } else {
      results.push('Site settings exist')
    }

    const skillCount = await countDocuments('skills')
    if (skillCount === 0) {
      const skills = seedSkills
      await Promise.all(skills.map(s => createDocument('skills', s)))
      results.push('18 skills seeded')
    } else {
      results.push(`${skillCount} skills exist`)
    }

    const achievementCount = await countDocuments('achievements')
    if (achievementCount === 0) {
      const achievements = seedAchievements
      await Promise.all(achievements.map(a => createDocument('achievements', a)))
      results.push('8 achievements seeded')
    } else {
      results.push(`${achievementCount} achievements exist`)
    }

    const siteStatsCount = await countDocuments('site_stats')
    if (siteStatsCount === 0) {
      const stats = seedSiteStats
      await Promise.all(stats.map(s => createDocument('site_stats', s)))
      results.push('5 site stats seeded')
    } else {
      results.push(`${siteStatsCount} site stats exist`)
    }

    const testimonialCount = await countDocuments('testimonials')
    if (testimonialCount === 0) {
      const testimonials = seedTestimonials
      await Promise.all(testimonials.map(t => createDocument('testimonials', t)))
      results.push('3 testimonials seeded')
    } else {
      results.push(`${testimonialCount} testimonials exist`)
    }

    return NextResponse.json({ success: true, data: { results, loginUrl: '/login' } })
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : JSON.stringify(error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
