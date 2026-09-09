import { NextRequest } from 'next/server'
import { getDocuments } from '@/lib/supabase/db'
import { apiSuccess, apiError } from '@/lib/supabase/helpers'
import { fallbackCourses } from '@/lib/fallback-data'
import { syncContentCatalog } from '@/lib/supabase/content-sync'

// Public: fetch a single course by its slug.
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    let rows = await getDocuments('courses', {
      filters: [{ field: 'slug', operator: 'eq', value: params.slug }],
      limit: 1,
    })
    if (!rows || rows.length === 0) {
      // Empty table: seed the catalog so the course gets a real UUID, then re-read.
      await syncContentCatalog()
      rows = await getDocuments('courses', {
        filters: [{ field: 'slug', operator: 'eq', value: params.slug }],
        limit: 1,
      })
    }
    if (rows && rows.length > 0) {
      const course = { ...rows[0], price: 'Free' }
      return apiSuccess(course)
    }
  } catch {
    // fall through to the hard-coded catalog
  }

  const found = fallbackCourses().find((c: any) => c.slug === params.slug)
  if (!found) return apiError('Course not found', 404)
  return apiSuccess({ ...found, price: 'Free' })
}
