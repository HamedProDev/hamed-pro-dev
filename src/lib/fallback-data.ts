// Hard-coded content fallback.
//
// The public site must always render Hamed's real portfolio and course catalog,
// even before the Supabase database is migrated or seeded. Every function here
// returns rows shaped exactly like the corresponding Supabase table rows, so
// they can be dropped in wherever a DB query would normally return data.
//
// API routes use these as a fallback when the database is unreachable, missing
// tables, or simply empty — so the live site (and admin lists) always show the
// full content catalog. Once the database is migrated and seeded (see
// `npx tsx scripts/seed-supabase.ts --content`), the real rows take precedence.

import {
  seedProjects,
  seedCourses,
  seedSkills,
  seedAchievements,
  seedSiteStats,
  seedTestimonials,
  seedSettings,
} from './seed-data'

export function fallbackProjects() {
  return seedProjects.map((p) => ({ id: p.slug, ...p }))
}

export function fallbackCourses() {
  return seedCourses.map((c) => ({
    id: c.slug,
    enrolled: 0,
    rating: 0,
    ...c,
  }))
}

export function fallbackSkills() {
  return seedSkills.map((s, i) => ({ id: `skill-${i}`, color: '#8b5cf6', ...s }))
}

export function fallbackAchievements() {
  return seedAchievements.map((a, i) => ({ id: `ach-${i}`, ...a }))
}

export function fallbackStats() {
  return seedSiteStats.map((s, i) => ({ id: `stat-${i}`, ...s }))
}

export function fallbackTestimonials() {
  return seedTestimonials.map((t, i) => ({ id: `test-${i}`, avatar_url: '', ...t }))
}

export function fallbackSettings() {
  return { id: 'settings-seed', ...seedSettings }
}
