// Auto-sync: write the hard-coded content catalog into Supabase on first load.
//
// The live database ships with tables but no rows, so every collection API
// falls back to hard-coded rows whose IDs are fake strings (skill-0,
// test-0, ach-0, stat-0, or a course slug). Any admin edit/delete or course
// enrollment using one of those fake IDs throws
// `invalid input syntax for type uuid` in Postgres.
//
// The fix: whenever a collection read finds its table empty, sync the whole
// catalog (projects, courses + generated lessons, skills, achievements,
// stats, testimonials, settings) into the DB first, then re-read. After the
// first visit every record has a real UUID and all CRUD/enrollment flows
// work. Sync is throttled, idempotent, and never overwrites existing rows.

import { createServiceClient } from './server'
import {
  seedProjects,
  seedCourses,
  seedSkills,
  seedAchievements,
  seedSiteStats,
  seedTestimonials,
  seedSettings,
} from '../seed-data'
import { buildLessonsFromCourse } from '../course-lessons'

export function isUuid(v: unknown): v is string {
  return (
    typeof v === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)
  )
}

let lastSync = 0
let syncPromise: Promise<void> | null = null
const SYNC_TTL_MS = 60_000

export function syncContentCatalog(): Promise<void> {
  if (syncPromise) return syncPromise
  if (Date.now() - lastSync < SYNC_TTL_MS) return Promise.resolve()
  syncPromise = syncOnce()
    .catch(() => {})
    .finally(() => {
      lastSync = Date.now()
      syncPromise = null
    })
  return syncPromise
}

async function tableIsEmpty(supabase: any, table: string): Promise<boolean | null> {
  try {
    const { count, error } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true })
    if (error) return null
    return (count ?? 0) === 0
  } catch {
    return null
  }
}

async function seedIfEmpty(supabase: any, table: string, rows: any[]): Promise<void> {
  if (!rows || rows.length === 0) return
  try {
    if (!(await tableIsEmpty(supabase, table))) return
    await supabase.from(table).insert(rows)
  } catch {
    // Table may not exist yet — the hard-coded fallback keeps the site alive.
  }
}

async function syncCoursesAndLessons(supabase: any): Promise<void> {
  try {
    let { data: courses } = await supabase
      .from('courses')
      .select('id, slug, title, description, content, final_quiz')
    if (!courses || courses.length === 0) {
      const { error } = await supabase.from('courses').insert(seedCourses)
      if (error) return
      const refetch = await supabase
        .from('courses')
        .select('id, slug, title, description, content, final_quiz')
      courses = refetch.data || []
    }
    // Backfill lessons for any course that has none (seeded or admin-made).
    for (const course of courses) {
      try {
        const { count } = await supabase
          .from('lessons')
          .select('id', { count: 'exact', head: true })
          .eq('course_id', course.id)
        if ((count ?? 0) > 0) continue
        const lessons = buildLessonsFromCourse(course)
        if (lessons.length === 0) continue
        await supabase
          .from('lessons')
          .insert(lessons.map((l) => ({ ...l, course_id: course.id })))
      } catch {
        // Ignore per-course failures (e.g. lessons table missing).
      }
    }
  } catch {
    // Courses table may not exist yet.
  }
}

async function syncOnce(): Promise<void> {
  const supabase = createServiceClient()
  await seedIfEmpty(supabase, 'projects', seedProjects)
  await syncCoursesAndLessons(supabase)
  await seedIfEmpty(supabase, 'skills', seedSkills)
  await seedIfEmpty(supabase, 'achievements', seedAchievements)
  await seedIfEmpty(supabase, 'site_stats', seedSiteStats)
  await seedIfEmpty(supabase, 'testimonials', seedTestimonials)
  await seedIfEmpty(supabase, 'settings', [seedSettings])
}

/**
 * Accept either a course UUID or a course slug and return the real UUID.
 * The public course pages only know the slug, while enrollments / progress /
 * lessons all key off the UUID — this bridges the two.
 */
export async function resolveCourseId(idOrSlug: string): Promise<string | null> {
  if (isUuid(idOrSlug)) return idOrSlug
  try {
    await syncContentCatalog()
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', idOrSlug)
      .maybeSingle()
    return data?.id || null
  } catch {
    return null
  }
}
