// Mock Supabase (PostgREST + GoTrue) for testing API route handlers end-to-end
// without network access. Run: npx tsx scripts/test/mock-supabase.ts
import http from 'http'
import crypto from 'crypto'

export const ADMIN_ID = '11111111-1111-4111-8111-111111111111'
export const STUDENT_ID = '22222222-2222-4222-8222-222222222222'

export const TABLE_COLUMNS: Record<string, string[]> = {
  projects: ['id', 'title', 'slug', 'description', 'content', 'image_url', 'category', 'tags', 'tech_stack', 'demo_url', 'github_url', 'screenshots', 'client', 'year', 'status', 'role', 'featured', 'is_published', 'order_index', 'created_at', 'updated_at'],
  profiles: ['id', 'email', 'name', 'avatar_url', 'role', 'bio', 'xp_points', 'current_streak', 'longest_streak', 'last_activity_date', 'created_at'],
  courses: ['id', 'title', 'slug', 'description', 'content', 'image_url', 'youtube_url', 'category', 'type', 'level', 'duration', 'price', 'enrolled', 'rating', 'tags', 'prerequisites', 'outcomes', 'final_quiz', 'featured', 'is_published', 'order_index', 'created_at', 'updated_at'],
  lessons: ['id', 'course_id', 'title', 'slug', 'content', 'video_url', 'duration', 'type', 'quiz', 'resources', 'is_free', 'is_published', 'order_index', 'created_at', 'updated_at'],
  enrollments: ['id', 'user_id', 'course_id', 'status', 'progress', 'enrolled_at', 'completed_at'],
  lesson_progress: ['id', 'user_id', 'course_id', 'lesson_id', 'completed', 'quiz_score', 'time_spent_seconds', 'last_accessed_at', 'completed_at', 'created_at'],
  certificates: ['id', 'certificate_number', 'user_id', 'course_id', 'enrollment_id', 'recipient_name', 'course_title', 'score', 'issue_date', 'is_verified', 'created_at'],
  settings: ['id', 'site_name', 'tagline', 'description', 'keywords', 'logo', 'favicon', 'og_image', 'profile_photo', 'hero_name', 'hero_title', 'hero_subtitle', 'contact_email', 'contact_phone', 'address', 'location', 'maintenance_mode', 'allow_registration', 'social_links', 'email_notifications', 'seo_defaults', 'integrations', 'created_at', 'updated_at'],
  contacts: ['id', 'name', 'email', 'subject', 'message', 'is_read', 'created_at'],
  newsletter_subscribers: ['id', 'email', 'is_active', 'created_at'],
  skills: ['id', 'name', 'category', 'proficiency', 'color', 'is_published', 'order_index', 'created_at'],
  achievements: ['id', 'title', 'description', 'category', 'date', 'certificate_url', 'image_url', 'is_published', 'order_index', 'created_at'],
  testimonials: ['id', 'name', 'role', 'company', 'content', 'rating', 'is_published', 'order_index', 'created_at'],
  site_stats: ['id', 'label', 'value', 'suffix', 'icon', 'is_published', 'order_index', 'created_at'],
  user_xp_events: ['id', 'user_id', 'event', 'points', 'meta', 'created_at'],
  lesson_comments: ['id', 'lesson_id', 'user_id', 'content', 'status', 'created_at'],
}

export const DEFAULTS: Record<string, Record<string, any>> = {
  courses: { type: 'free', level: 'beginner', enrolled: 0, rating: 0, tags: [], prerequisites: [], outcomes: [], final_quiz: [], featured: false, is_published: false, order_index: 0 },
  lessons: { type: 'text', quiz: [], resources: [], is_free: false, is_published: false, order_index: 0 },
  enrollments: { status: 'active', progress: 0 },
  lesson_progress: { completed: false, quiz_score: null, time_spent_seconds: 0 },
  certificates: { score: null, is_verified: true },
  settings: { maintenance_mode: false, allow_registration: true, social_links: {}, email_notifications: {}, seo_defaults: {}, integrations: {} },
  contacts: { is_read: false },
  newsletter_subscribers: { is_active: true },
  skills: { proficiency: 0, is_published: false, order_index: 0 },
  achievements: { is_published: false, order_index: 0 },
  testimonials: { rating: 5, is_published: false, order_index: 0 },
  site_stats: { is_published: false, order_index: 0 },
}

// rows[table] = Row[] — exported so the test file can inspect/seed state.
export const rows: Record<string, any[]> = {}
for (const t of Object.keys(TABLE_COLUMNS)) rows[t] = []

export function seedProfiles() {
  rows.profiles = [
    { id: ADMIN_ID, email: 'admin@test.dev', name: 'Admin', role: 'admin', xp_points: 0, current_streak: 0, avatar_url: null, bio: '', longest_streak: 0, last_activity_date: null, created_at: new Date().toISOString() },
    { id: STUDENT_ID, email: 'student@test.dev', name: 'Student', role: 'visitor', xp_points: 0, current_streak: 0, avatar_url: null, bio: '', longest_streak: 0, last_activity_date: null, created_at: new Date().toISOString() },
  ]
}

function userForToken(token: string | null) {
  if (token === 'admin-token') return { id: ADMIN_ID, email: 'admin@test.dev', user_metadata: { name: 'Admin' }, created_at: new Date().toISOString() }
  if (token === 'student-token') return { id: STUDENT_ID, email: 'student@test.dev', user_metadata: { name: 'Student' }, created_at: new Date().toISOString() }
  return null
}

function bearer(req: http.IncomingMessage): string | null {
  const h = req.headers['authorization']
  if (!h || !h.startsWith('Bearer ')) return null
  return h.slice('Bearer '.length).trim()
}

type Op = { field: string; op: string; value: string }

function parseFilters(searchParams: URLSearchParams): { filters: Op[]; select: string; order: { field: string; asc: boolean } | null; limit: number | null } {
  const filters: Op[] = []
  let select = '*'
  let order: { field: string; asc: boolean } | null = null
  let limit: number | null = null
  for (const [field, rawVal] of searchParams.entries()) {
    if (field === 'select') { select = rawVal; continue }
    if (field === 'order') {
      const [f, dir] = rawVal.split('.')
      order = { field: f, asc: dir !== 'desc' }
      continue
    }
    if (field === 'limit') { limit = Number(rawVal); continue }
    if (field === 'offset') continue
    // PostgREST style: field=op.value  e.g. id=eq.<uuid>, slug=like.a%25, id=in.(a,b)
    const m = rawVal.match(/^(eq|neq|gt|gte|lt|lte|like|ilike|in)\.([\s\S]*)$/)
    if (m) filters.push({ field, op: m[1], value: m[2] })
  }
  return { filters, select, order, limit }
}

function matchFilter(row: any, f: Op): boolean {
  const v = row[f.field]
  switch (f.op) {
    case 'eq': return String(v) === f.value
    case 'neq': return String(v) !== f.value
    case 'gt': return v > f.value
    case 'gte': return v >= f.value
    case 'lt': return v < f.value
    case 'lte': return v <= f.value
    case 'like':
    case 'ilike': {
      const pattern = f.value.replace(/%/g, '.*').replace(/_/g, '.')
      return new RegExp(`^${pattern}$`, f.op === 'ilike' ? 'i' : '').test(String(v))
    }
    case 'in': {
      const list = f.value.replace(/^\(|\)$/g, '').split(',').map(s => s.trim().replace(/^"|"$/g, ''))
      return list.includes(String(v))
    }
    default: return false
  }
}

function applyFilters(data: any[], filters: Op[]) {
  let out = data
  for (const f of filters) out = out.filter(r => matchFilter(r, f))
  return out
}

function unknownColumns(table: string, payload: Record<string, any>): string[] {
  const cols = TABLE_COLUMNS[table]
  if (!cols) return []
  return Object.keys(payload).filter(k => !cols.includes(k))
}

function pgrst204(column: string, table: string) {
  return { code: 'PGRST204', message: `Could not find the '${column}' column of '${table}' in the schema cache`, hint: null, details: null }
}

export function createMockServer(port = 5990) {
  const server = http.createServer((req, res) => {
    const chunks: Buffer[] = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => {
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') : {}
      const url = new URL(req.url || '/', `http://127.0.0.1:${port}`)
      const json = (status: number, payload: any, headers: Record<string, string> = {}) => {
        res.writeHead(status, { 'Content-Type': 'application/json', ...headers })
        res.end(JSON.stringify(payload))
      }

      // ---- GoTrue ----
      if (url.pathname === '/auth/v1/user') {
        const user = userForToken(bearer(req))
        if (!user) return json(401, { message: 'No session found', code: 400 })
        return json(200, user)
      }

      // ---- RPC ----
      if (url.pathname === '/rest/v1/rpc/add_xp' && req.method === 'POST') {
        const p = rows.profiles.find(r => r.id === body.uid)
        if (p) p.xp_points = (p.xp_points || 0) + (body.amount || 0)
        return json(204, {})
      }

      // ---- PostgREST tables ----
      const m = url.pathname.match(/^\/rest\/v1\/([a-z_]+)$/)
      if (!m) return json(404, { message: `unmocked path ${url.pathname}` })
      const table = m[1]
      if (!TABLE_COLUMNS[table]) return json(404, { message: `unknown table ${table}` })

      const { filters, select, order, limit } = parseFilters(url.searchParams)
      const prefer = String(req.headers['prefer'] || '')
      const wantsRepresentation = prefer.includes('representation')
      const wantsObject = String(req.headers['accept'] || '').includes('vnd.pgrst.object')
      const rangeHeader = req.headers['range']

      if (req.method === 'GET' || req.method === 'HEAD') {
        let out = applyFilters(rows[table], filters)
        const total = out.length
        if (order) {
          out = [...out].sort((a, b) => (a[order!.field] > b[order!.field] ? 1 : a[order!.field] < b[order!.field] ? -1 : 0))
          if (!order.asc) out.reverse()
        }
        if (rangeHeader) {
          const [from, to] = String(rangeHeader).split('-').map(Number)
          out = out.slice(from, (Number.isFinite(to) ? to + 1 : undefined))
        }
        if (limit != null) out = out.slice(0, limit)
        if (req.method === 'HEAD') {
          res.writeHead(200, { 'Content-Range': `0-${Math.max(0, total - 1)}/${total}`, 'Content-Type': 'application/json' })
          return res.end()
        }
        if (select.split(',').map(s => s.trim()).length === 1 && select !== '*') {
          out = out.map(r => ({ [select.trim()]: r[select.trim()] }))
        } else if (select !== '*' && !select.includes('(')) {
          const cols = select.split(',').map(s => s.trim())
          out = out.map(r => Object.fromEntries(cols.map(c => [c, r[c]])))
        }
        if (wantsObject) {
          if (out.length === 0) return json(406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' })
          return json(200, out[0])
        }
        return json(200, out)
      }

      if (req.method === 'POST') {
        const payload = Array.isArray(body) ? body[0] : body
        const unknown = unknownColumns(table, payload)
        if (unknown.length > 0) return json(400, pgrst204(unknown[0], table))
        for (const col of TABLE_COLUMNS[table]) {
          if (col === 'id' || col === 'created_at') continue
          if (!(col in payload)) {
            if (col.endsWith('_at') && col !== 'completed_at') payload[col] = new Date().toISOString()
            else payload[col] = DEFAULTS[table]?.[col] !== undefined ? DEFAULTS[table][col] : null
          }
        }
        const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...payload }
        rows[table].push(row)
        if (wantsRepresentation) {
          if (wantsObject) return json(201, row)
          return json(201, [row])
        }
        return json(201, {})
      }

      if (req.method === 'PATCH') {
        const payload = body
        const unknown = unknownColumns(table, payload)
        if (unknown.length > 0) return json(400, pgrst204(unknown[0], table))
        const targets = applyFilters(rows[table], filters)
        for (const t of targets) Object.assign(t, payload, { updated_at: new Date().toISOString() })
        if (wantsRepresentation) {
          if (wantsObject) {
            if (targets.length === 0) return json(406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' })
            return json(200, targets[0])
          }
          return json(200, targets)
        }
        return json(204, {})
      }

      if (req.method === 'DELETE') {
        const before = rows[table].length
        rows[table] = rows[table].filter(r => !applyFilters([r], filters).length)
        return json(204, {})
      }

      return json(405, { message: 'method not allowed' })
    })
  })
  return server
}

if (require.main === module) {
  seedProfiles()
  const server = createMockServer(5990)
  server.listen(5990, () => console.log('mock supabase on :5990'))
}
