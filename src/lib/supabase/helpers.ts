import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServiceClient } from './server'

const FIELD_MAP: Record<string, Record<string, string>> = {
  projects: {
    longDescription: 'content',
    coverImage: 'image_url',
    techStack: 'tech_stack',
    demoUrl: 'demo_url',
    sourceUrl: 'github_url',
    subCategory: 'category',
    isPublished: 'is_published',
    order: 'order_index',
  },
  courses: {
    longDescription: 'content',
    coverImage: 'image_url',
    youtubePlaylistUrl: 'youtube_url',
    isPublished: 'is_published',
    prerequisites: 'prerequisites',
    outcomes: 'outcomes',
    order: 'order_index',
  },
  lessons: {
    youtubeUrl: 'video_url',
    videoDuration: 'duration',
    isFree: 'is_free',
    isPublished: 'is_published',
    order: 'order_index',
  },
  blog_posts: {
    coverImage: 'image_url',
    published: 'is_published',
    order: 'order_index',
  },
  skills: {
    order: 'order_index',
    featured: 'is_published',
  },
  achievements: {
    year: 'date',
    type: 'category',
    link: 'certificate_url',
    order: 'order_index',
    featured: 'is_published',
  },
  testimonials: {
    order: 'order_index',
    featured: 'is_published',
  },
  site_stats: {
    order: 'order_index',
  },
  organizations: {
    type: 'category',
    team: 'team_size',
    roles: 'team_roles',
    tech: 'tech_stack',
    hiring: 'is_hiring',
    website: 'website_url',
    logo: 'logo_url',
    order: 'order_index',
  },
  profiles: {
    avatarUrl: 'avatar_url',
    githubUrl: 'github_url',
    linkedinUrl: 'linkedin_url',
    twitterUrl: 'twitter_url',
    isPublished: 'is_published',
  },
}

export function mapFormToDb(table: string, data: Record<string, any>): Record<string, any> {
  const tableMap = FIELD_MAP[table] || {}
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(data)) {
    if (key === '_method') continue
    const dbKey = tableMap[key] || key
    result[dbKey] = value
  }
  return result
}

export async function requireAdmin(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const svc = createServiceClient()
  const { data: profile } = await svc
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return { user, profile }
}

export async function getCurrentUser(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const svc = createServiceClient()
  const { data: profile } = await svc
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    uid: user.id,
    email: user.email,
    name: profile?.name || user.email?.split('@')[0] || '',
    image: profile?.avatar_url || null,
    role: profile?.role || 'visitor',
  }
}

export function apiSuccess(data: any, message = 'Success') {
  return NextResponse.json({ success: true, message, data })
}

export function apiError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function apiPaginated(data: any[], total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}
