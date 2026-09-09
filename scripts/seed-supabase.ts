/**
 * Supabase admin toolkit — run from your own machine (no app deploy needed).
 *
 *   npx tsx scripts/seed-supabase.ts --admin-only   # create/verify the admin login
 *   npx tsx scripts/seed-supabase.ts --demo         # seed realistic demo/test data
 *   npx tsx scripts/seed-supabase.ts --reset        # delete ALL content data
 *
 * By default this only ensures the admin login exists. All site content is
 * created by the admin via /admin-control — nothing else is seeded unless you
 * pass `--demo`, which fills every table with realistic test data (demo
 * students, a full course with lessons/quizzes, enrollments with progress,
 * certificates, projects, skills, achievements, testimonials, stats, contact
 * messages, newsletter subscribers, comments and settings).
 *
 * Required env vars (in .env or exported):
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD
 * Optional:
 *   ADMIN_EMAIL (default hamussein01@gmail.com)
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

// ---- minimal .env loader (inline env vars take precedence; last value wins) --
function loadDotEnv(path: string) {
  const preExisting = new Set(Object.keys(process.env))
  try {
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      const key = m[1]
      let value = m[2]
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!preExisting.has(key)) process.env[key] = value
    }
  } catch {
    /* no .env file */
  }
}
loadDotEnv('.env')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = (process.env.ADMIN_EMAIL || 'hamussein01@gmail.com').trim()
const adminPassword = (process.env.ADMIN_PASSWORD || '').trim()

if (!url) fail('NEXT_PUBLIC_SUPABASE_URL is not set')
if (!serviceKey || serviceKey === 'your-service-role-key-here') {
  fail('SUPABASE_SERVICE_ROLE_KEY is not set (get it from Supabase Dashboard → Project Settings → API → service_role)')
}
if (!adminPassword) fail('ADMIN_PASSWORD is not set (used to create the admin login)')

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function fail(msg: string): never {
  console.error('✖ ' + msg)
  process.exit(1)
}

async function ensureAdmin(): Promise<string> {
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) throw error
  const users = (data?.users ?? []) as any[]
  let user = users.find((u) => u.email === adminEmail)
  if (!user) {
    const created = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { name: 'Hamed Hussein', display_name: 'Hamed Hussein' },
      app_metadata: { role: 'admin' },
    })
    if (created.error) throw created.error
    user = created.data.user
    console.log(`• Admin user created: ${adminEmail}`)
  } else {
    // Existing user: force the password to match ADMIN_PASSWORD and confirm email,
    // so admin login always works.
    const updated = await supabase.auth.admin.updateUserById(user.id, {
      password: adminPassword,
      email_confirm: true,
      app_metadata: { role: 'admin' },
    })
    if (updated.error) throw updated.error
    console.log(`• Admin user exists — password synced with ADMIN_PASSWORD: ${adminEmail}`)
  }
  // Ensure the profile row exists with admin role (trigger normally does this,
  // but be safe in case the trigger ran before this schema).
  await supabase
    .from('profiles')
    .upsert({ id: user.id, email: adminEmail, name: 'Hamed Hussein', role: 'admin' }, { onConflict: 'id' })

  // Verify the credentials actually work with the anon key (exactly what /login uses).
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (anonKey) {
    const anonClient = createClient(url as string, anonKey)
    const { error: signInError } = await anonClient.auth.signInWithPassword({ email: adminEmail, password: adminPassword })
    if (signInError) {
      console.log(`⚠️  Admin login verification FAILED: ${signInError.message}`)
      console.log('   → If it says "Email not confirmed", open Supabase → Authentication → Users and confirm it, or re-run this script.')
    } else {
      console.log(`✔ Admin login verified OK: ${adminEmail}`)
    }
  }
  return user.id
}

// Content tables, in FK-safe delete order (children first). Profiles/auth are kept.
const CONTENT_TABLES = [
  'lesson_comments',
  'user_xp_events',
  'lesson_progress',
  'certificates',
  'enrollments',
  'lessons',
  'courses',
  'testimonials',
  'contacts',
  'newsletter_subscribers',
  'analytics',
  'achievements',
  'skills',
  'site_stats',
  'projects',
  'settings',
]

async function resetAll() {
  console.log('\n⚠️  Deleting ALL content data (profiles and auth users are kept)…\n')
  for (const table of CONTENT_TABLES) {
    const { count, error } = await supabase
      .from(table)
      .delete({ count: 'exact' })
      .gte('id', '00000000-0000-0000-0000-000000000000')
    if (error) {
      console.log(`• ${table}: skipped (${error.message})`)
    } else {
      console.log(`• ${table}: deleted ${count ?? 0}`)
    }
  }
  console.log('\n✔ Content cleared. Add new content from /admin-control.\n')
}

async function main() {
  if (process.argv.includes('--reset')) {
    await resetAll()
    return
  }

  console.log(`\nEnsuring admin account → ${url}\n`)
  const admin = await ensureAdmin()

  if (process.argv.includes('--demo')) {
    const { seedDemoData } = await import('./seed-demo-data')
    await seedDemoData(supabase, admin)
  }

  console.log(`\n✔ Done. Admin login: ${adminEmail} (password is exactly ADMIN_PASSWORD from .env, trimmed)`)
  console.log('  Sign in at /login or /admin-control.\n')
}

main().catch((err) => {
  console.error('✖ Failed:')
  console.error(err?.message ?? err)
  process.exit(1)
})
