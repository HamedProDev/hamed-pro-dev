/**
 * End-to-end tests for the admin CMS + course/lesson/enrollment/certificate
 * flow, run against REAL route handlers with a mock Supabase backend.
 *
 * Run: npx tsx scripts/test/api-e2e.ts
 */
import { NextRequest } from 'next/server'

process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:5990'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY = 'test-service-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

import { createMockServer, seedProfiles, rows, ADMIN_ID, STUDENT_ID } from './mock-supabase'

let passed = 0
let failed = 0
const failures: string[] = []
function check(name: string, cond: boolean, extra?: any) {
  if (cond) {
    passed++
    console.log(`  ✅ ${name}`)
  } else {
    failed++
    failures.push(name)
    console.log(`  ❌ ${name}`, extra !== undefined ? JSON.stringify(extra) : '')
  }
}

function sessionCookie(token: string) {
  const session = { access_token: token, refresh_token: token, token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600 }
  const value = 'base64-' + Buffer.from(JSON.stringify(session)).toString('base64')
  return `sb-127-auth-token=${encodeURIComponent(value)}`
}

function req(path: string, opts: { method?: string; body?: any; as?: 'admin' | 'student' | 'anon' } = {}) {
  const cookies = opts.as === 'admin' ? sessionCookie('admin-token') : opts.as === 'student' ? sessionCookie('student-token') : ''
  return new NextRequest(`http://localhost:3000${path}`, {
    method: opts.method || 'GET',
    headers: { 'content-type': 'application/json', ...(cookies ? { cookie: cookies } : {}) },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  })
}

async function jsonOf(res: Response) {
  try { return await res.json() } catch { return null }
}

async function main() {
  seedProfiles()
  const server = createMockServer(5990)
  await new Promise<void>(resolve => server.listen(5990, resolve))
  console.log('\n========== SETTINGS ==========')
  await testSettings()
  console.log('\n========== COURSES (admin CRUD) ==========')
  await testCourses()
  console.log('\n========== LESSONS (admin CRUD) ==========')
  await testLessons()
  console.log('\n========== ENROLL → LEARN → CERTIFICATE (student) ==========')
  await testLearningFlow()
  console.log('\n========== CONTACT (public + admin) ==========')
  await testContact()
  console.log('\n========== OTHER ADMIN ENTITIES ==========')
  await testOtherEntities()
  server.close()

  console.log(`\n========== RESULTS: ${passed} passed, ${failed} failed ==========`)
  if (failures.length) {
    console.log('Failures:')
    failures.forEach(f => console.log(' - ' + f))
    process.exit(1)
  }
  process.exit(0)
}

// ---------------------------------------------------------------------------
async function testSettings() {
  const { GET, POST } = await import('@/app/api/settings/route')
  const getSettings = GET as (r?: any) => Promise<Response>

  const g = await getSettings(req('/api/settings'))
  const gd = await jsonOf(g)
  check('settings GET creates a row when missing', gd?.success && !!gd.data?.id)

  const post = await POST(req('/api/settings', { method: 'POST', as: 'admin', body: { site_name: 'Hamed', contact_email: 'a@b.c', seoDefaults: { metaTitle: 'T' }, NOT_A_COLUMN: 'x' } }))
  const pd = await jsonOf(post)
  check('settings POST saves known keys + camelCase json blobs', pd?.success && pd.data?.site_name === 'Hamed' && pd.data?.seo_defaults?.metaTitle === 'T', pd)
  check('settings POST message is plain when nothing dropped', pd?.message === 'Settings updated', pd?.message)

  // Simulate a stale DB: remove resume_url column support by sending only that key
  rows.settings = []
  seedProfiles()
  const g2 = await getSettings(req('/api/settings'))
  const gd2 = await jsonOf(g2)
  check('settings row re-created after loss', gd2?.success && !!gd2.data?.id)
}

// ---------------------------------------------------------------------------
let courseA: any, courseB: any
async function testCourses() {
  seedProfiles()
  const { GET, POST } = await import('@/app/api/courses/route')
  const { POST: courseItemPost, GET: courseItemGet } = await import('@/app/api/courses/[id]/route')

  // Unauthorized create must be rejected
  const anon = await POST(req('/api/courses', { method: 'POST', body: { title: 'X' } }))
  check('course create requires admin', anon.status === 401)

  // Create with the exact payload the admin form sends (camelCase junk included)
  const formBody = {
    title: 'React Basics', description: 'Learn React', longDescription: 'Deep dive', coverImage: '/img.png',
    category: 'Frontend', level: 'beginner', type: 'free', price: '0', duration: '5', rating: 4.5,
    tags: ['react'], prerequisites: [], outcomes: [], youtubePlaylistUrl: 'https://youtube.com/playlist?list=1',
    final_quiz: [{ question: 'Q?', options: ['a', 'b'], correctIndex: 0, explanation: '' }],
    finalQuiz: [{ question: 'Q?', options: ['a', 'b'], correctIndex: 0 }], // legacy junk key
    isPublished: true,
  }
  const r1 = await POST(req('/api/courses', { method: 'POST', as: 'admin', body: formBody }))
  const d1 = await jsonOf(r1)
  check('course create succeeds with form payload (junk columns dropped)', d1?.success === true, d1)
  check('course slug generated', d1?.data?.slug === 'react-basics', d1?.data?.slug)
  courseA = d1?.data

  // Duplicate title → unique slug
  const r2 = await POST(req('/api/courses', { method: 'POST', as: 'admin', body: { ...formBody, title: 'React Basics' } }))
  const d2 = await jsonOf(r2)
  check('duplicate course title gets unique slug', d2?.success && d2.data?.slug === 'react-basics-2', d2?.data?.slug)
  courseB = d2?.data

  // Update (the edit-page payload)
  const upd = await courseItemPost(req(`/api/courses/${courseA.id}`, { method: 'POST', as: 'admin', body: { title: 'React Basics Updated', description: 'x', longDescription: 'y', coverImage: '', category: 'Frontend', level: 'beginner', type: 'free', price: '0', duration: '6', rating: 5, tags: [], prerequisites: [], outcomes: [], finalQuiz: [], final_quiz: [] } }), { params: { id: courseA.id } })
  const updd = await jsonOf(upd)
  check('course update succeeds with edit-page payload', updd?.success && updd.data?.title === 'React Basics Updated' && updd.data?.duration === '6', updd)

  // Public list (published filter) + admin list with lesson counts
  const { POST: bulkInCourses } = await import('@/app/api/admin/bulk/route')
  await bulkInCourses(req('/api/admin/bulk', { method: 'POST', as: 'admin', body: { table: 'courses', ids: [courseB.id], action: 'unpublish' } }))
  const pub = await GET(req('/api/courses'))
  const pubd = await jsonOf(pub)
  check('public course list hides drafts', pubd?.success && pubd.data.length === 1 && pubd.data[0].id === courseA.id, pubd?.data?.map((c: any) => c.slug))

  const adm = await GET(req('/api/courses?all=true'))
  const admd = await jsonOf(adm)
  check('admin course list returns all with lessons_count', admd?.success && admd.data.length === 2 && admd.data[0].lessons_count === 0, admd?.data?.map((c: any) => c.lessons_count))

  const one = await courseItemGet(req(`/api/courses/${courseA.id}`), { params: { id: courseA.id } })
  const oned = await jsonOf(one)
  check('course GET returns course with lessons array', oned?.success && Array.isArray(oned.data.lessons))
}

// ---------------------------------------------------------------------------
let lessons: any[] = []
async function testLessons() {
  const { GET, POST } = await import('@/app/api/courses/[id]/lessons/route')
  const { POST: lessonItemPost } = await import('@/app/api/courses/[id]/lessons/[lessonId]/route')
  const { POST: bulk } = await import('@/app/api/admin/bulk/route')

  const lessonForm = (title: string, extra: any = {}) => ({
    title, type: 'video', content: '# Hello', youtubeUrl: 'https://youtube.com/watch?v=abc', videoDuration: '12',
    isFree: true, isPublished: true, resources: [{ title: 'Docs', url: 'https://r.dev', type: 'link' }],
    quiz: [{ question: 'What?', options: ['a', 'b'], correctIndex: 1, explanation: 'because' }], ...extra,
  })

  const r1 = await POST(req(`/api/courses/${courseA.id}/lessons`, { method: 'POST', as: 'admin', body: lessonForm('Introduction') }), { params: { id: courseA.id } })
  const d1 = await jsonOf(r1)
  check('lesson create with admin form payload', d1?.success === true, d1)
  check('lesson mapped youtubeUrl→video_url, isFree→is_free', d1?.data?.video_url?.includes('youtube') && d1?.data?.is_free === true && d1?.data?.duration === '12', d1?.data)
  check('lesson order_index = 1', d1?.data?.order_index === 1, d1?.data?.order_index)

  const r2 = await POST(req(`/api/courses/${courseA.id}/lessons`, { method: 'POST', as: 'admin', body: lessonForm('Introduction') }), { params: { id: courseA.id } })
  const d2 = await jsonOf(r2)
  check('duplicate lesson title gets unique slug in same course', d2?.success && d2.data?.slug === 'introduction-2', d2?.data?.slug)
  check('lesson order_index = 2', d2?.data?.order_index === 2, d2?.data?.order_index)

  const r3 = await POST(req(`/api/courses/${courseA.id}/lessons`, { method: 'POST', as: 'admin', body: lessonForm('Components') }), { params: { id: courseA.id } })
  const d3 = await jsonOf(r3)

  // lesson creation on another course must not disturb ordering
  const rOther = await POST(req(`/api/courses/${courseB.id}/lessons`, { method: 'POST', as: 'admin', body: lessonForm('Introduction') }), { params: { id: courseB.id } })
  const dOther = await jsonOf(rOther)
  check('same lesson title allowed across different courses', dOther?.success && dOther.data?.slug === 'introduction', dOther?.data?.slug)

  // list
  const list = await GET(req(`/api/courses/${courseA.id}/lessons`), { params: { id: courseA.id } })
  const listd = await jsonOf(list)
  lessons = listd?.data || []
  check('lessons list ordered by order_index', lessons.length === 3 && lessons[0].order_index === 1 && lessons[2].order_index === 3, lessons.map((l: any) => l.order_index))

  // update a lesson (edit page payload)
  const upd = await lessonItemPost(req(`/api/courses/${courseA.id}/lessons/${lessons[0].id}`, { method: 'POST', as: 'admin', body: lessonForm('Intro Updated', { isFree: false }) }), { params: { id: courseA.id, lessonId: lessons[0].id } })
  const updd = await jsonOf(upd)
  check('lesson update succeeds', updd?.success && updd.data.title === 'Intro Updated' && updd.data.is_free === false, updd)

  // bulk unpublish/publish
  const bu = await bulk(req('/api/admin/bulk', { method: 'POST', as: 'admin', body: { table: 'lessons', ids: [lessons[1].id, lessons[2].id], action: 'unpublish' } }))
  check('bulk unpublish lessons', (await jsonOf(bu))?.success && rows.lessons.find(l => l.id === lessons[1].id).is_published === false)
  const bp = await bulk(req('/api/admin/bulk', { method: 'POST', as: 'admin', body: { table: 'lessons', ids: [lessons[1].id], action: 'publish' } }))
  check('bulk publish lessons', (await jsonOf(bp))?.success)

  // delete a middle lesson, then create → order must be max+1 (4), not count+1 (3)
  const del = await lessonItemPost(req(`/api/courses/${courseA.id}/lessons/${lessons[1].id}`, { method: 'POST', as: 'admin', body: { _method: 'DELETE' } }), { params: { id: courseA.id, lessonId: lessons[1].id } })
  check('lesson delete via _method', (await jsonOf(del))?.success)
  const r4 = await POST(req(`/api/courses/${courseA.id}/lessons`, { method: 'POST', as: 'admin', body: lessonForm('State & Props') }), { params: { id: courseA.id } })
  const d4 = await jsonOf(r4)
  check('new lesson after delete gets max+1 order', d4?.success && d4.data?.order_index === 4, d4?.data?.order_index)

  // slug-coursed course id must also work (public-style URL)
  const rSlug = await POST(req(`/api/courses/${courseA.slug}/lessons`, { method: 'POST', as: 'admin', body: lessonForm('By slug') }), { params: { id: courseA.slug } })
  const dSlug = await jsonOf(rSlug)
  check('lesson create resolves course slug → UUID FK', dSlug?.success === true, dSlug)

  const list2 = await GET(req(`/api/courses/${courseA.id}/lessons`), { params: { id: courseA.id } })
  lessons = (await jsonOf(list2)).data
}

// ---------------------------------------------------------------------------
async function testLearningFlow() {
  // Admin adds a final assessment to the course (edit page payload)
  const { POST: courseItemPost } = await import('@/app/api/courses/[id]/route')
  const upd = await courseItemPost(req(`/api/courses/${courseA.id}`, { method: 'POST', as: 'admin', body: { title: 'React Basics Updated', description: 'x', tags: [], prerequisites: [], outcomes: [], final_quiz: [{ question: 'Final: what is React?', options: ['library', 'fruit'], correctIndex: 0, explanation: '' }] } }), { params: { id: courseA.id } })
  check('final assessment saved via course update', (await jsonOf(upd))?.data?.final_quiz?.length === 1)

  const { POST: enrollPost, GET: enrollGet } = await import('@/app/api/enrollments/route')
  const { GET: enrollMe } = await import('@/app/api/enrollments/me/route')
  const { GET: progressGet } = await import('@/app/api/courses/[id]/progress/route')
  const { POST: progressPost } = await import('@/app/api/enrollments/[id]/progress/route')
  const { POST: completePost } = await import('@/app/api/enrollments/[id]/complete/route')
  const { GET: certsMe } = await import('@/app/api/certificates/me/route')
  const { POST: lessonTime } = await import('@/app/api/lessons/[lessonId]/time/route')

  // enroll via slug
  const er = await enrollPost(req('/api/enrollments', { method: 'POST', as: 'student', body: { courseId: courseA.slug } }))
  const ed = await jsonOf(er)
  check('enroll by course slug', ed?.success && ed.data.course_id === courseA.id, ed)
  const er2 = await enrollPost(req('/api/enrollments', { method: 'POST', as: 'student', body: { courseId: courseA.id } }))
  check('re-enroll is idempotent', (await jsonOf(er2))?.message === 'Already enrolled')
  const anonEnroll = await enrollPost(req('/api/enrollments', { method: 'POST', body: { courseId: courseA.id } }))
  check('enroll requires auth', anonEnroll.status === 401)

  const enrollment = ed.data

  // progress snapshot
  const pg = await progressGet(req(`/api/courses/${courseA.id}/progress`, { as: 'student' }), { params: { id: courseA.id } })
  const pgd = await jsonOf(pg)
  check('progress: enrolled, 0 completed, first lesson unlocked', pgd?.data?.enrolled && pgd.data.completedCount === 0 && pgd.data.unlockedLessonId === lessons[0].id, pgd?.data)

  // ordered completion: lesson 3 must be blocked
  const skip = await progressPost(req(`/api/enrollments/${enrollment.id}/progress`, { method: 'POST', as: 'student', body: { lessonId: lessons[2].id, answers: [] } }), { params: { id: enrollment.id } })
  check('skipping ahead is blocked (403)', skip.status === 403)

  // time heartbeat on lesson 1
  const t1 = await lessonTime(req(`/api/lessons/${lessons[0].id}/time`, { method: 'POST', as: 'student', body: { seconds: 30, courseId: courseA.id } }), { params: { lessonId: lessons[0].id } })
  const t1d = await jsonOf(t1)
  check('lesson time heartbeat upserts', t1d?.success && t1d.data.timeSpentSeconds === 30, t1d)
  const t2 = await lessonTime(req(`/api/lessons/${lessons[0].id}/time`, { method: 'POST', as: 'student', body: { seconds: 45, courseId: courseA.id } }), { params: { lessonId: lessons[0].id } })
  check('lesson time accumulates', (await jsonOf(t2))?.data?.timeSpentSeconds === 75)

  // complete lesson 1 (has quiz — wrong answer first)
  const fail1 = await progressPost(req(`/api/enrollments/${enrollment.id}/progress`, { method: 'POST', as: 'student', body: { lessonId: lessons[0].id, answers: [0] } }), { params: { id: enrollment.id } })
  const fail1d = await jsonOf(fail1)
  check('lesson quiz fail (score < 70) blocks completion', fail1d?.success && fail1d.data.passed === false && fail1d.data.score === 0, fail1d)
  const ok1 = await progressPost(req(`/api/enrollments/${enrollment.id}/progress`, { method: 'POST', as: 'student', body: { lessonId: lessons[0].id, answers: [1] } }), { params: { id: enrollment.id } })
  const ok1d = await jsonOf(ok1)
  check('lesson 1 completed with passing quiz', ok1d?.success && ok1d.data.passed === true && ok1d.data.progress === 25, ok1d)

  // complete remaining lessons (no quiz now? lessons 2,3,4 have quiz from the form)
  for (let i = 1; i < lessons.length; i++) {
    const r = await progressPost(req(`/api/enrollments/${enrollment.id}/progress`, { method: 'POST', as: 'student', body: { lessonId: lessons[i].id, answers: [1, 1, 1, 1] } }), { params: { id: enrollment.id } })
    const d = await jsonOf(r)
    if (!d?.success) check(`lesson ${i + 1} completes`, false, d)
  }
  const pg2 = await progressGet(req(`/api/courses/${courseA.id}/progress`, { as: 'student' }), { params: { id: courseA.id } })
  const pg2d = await jsonOf(pg2)
  check('all lessons completed → 100%, needsFinalQuiz', pg2d?.data?.completedCount === lessons.length && pg2d.data.needsFinalQuiz === true, pg2d?.data)

  // final quiz — course A has 1 question with correctIndex 0
  const wrong = await completePost(req(`/api/enrollments/${enrollment.id}/complete`, { method: 'POST', as: 'student', body: { answers: [1] } }), { params: { id: enrollment.id } })
  const wrongd = await jsonOf(wrong)
  check('final quiz fail does not issue certificate', wrongd?.success && wrongd.data.passed === false, wrongd)

  const right = await completePost(req(`/api/enrollments/${enrollment.id}/complete`, { method: 'POST', as: 'student', body: { answers: [0] } }), { params: { id: enrollment.id } })
  const rightd = await jsonOf(right)
  check('final quiz pass issues certificate', rightd?.success && rightd.data.passed === true && !!rightd.data.certificateNumber, rightd)
  const certNumber = rightd?.data?.certificateNumber

  const cert = rows.certificates.find(c => c.certificate_number === certNumber)
  check('certificate row persisted with snapshot fields', cert && cert.user_id === STUDENT_ID && cert.course_id === courseA.id && cert.recipient_name === 'Student', cert)

  const mine = await certsMe(req('/api/certificates/me', { as: 'student' }))
  const mined = await jsonOf(mine)
  check('certificates/me lists the certificate', mined?.success && mined.data?.length === 1 && mined.data[0].certificate_number === certNumber, mined)

  const list = await enrollGet(req('/api/enrollments', { as: 'student' }))
  check('enrollments GET lists completed enrollment', (await jsonOf(list))?.data?.[0]?.status === 'completed')
  const me = await enrollMe(req('/api/enrollments/me', { as: 'student' }))
  const med = await jsonOf(me)
  check('enrollments/me returns enriched row (title/slug/progress)', med?.success && med.data[0].title === 'React Basics Updated' && med.data[0].progress === 100 && med.data[0].isCertificateIssued === true, med?.data?.[0])

  const xp = rows.profiles.find(p => p.id === STUDENT_ID)
  check('XP awarded along the way (enroll+lessons+final+cert)', (xp?.xp_points || 0) >= 100, xp?.xp_points)
}

// ---------------------------------------------------------------------------
async function testContact() {
  const { POST, GET } = await import('@/app/api/contact/route')
  const { POST: itemPost } = await import('@/app/api/contact/[id]/route')

  const post = await POST(req('/api/contact', { method: 'POST', body: { name: 'Vis', email: 'v@x.y', subject: 'Hi', reason: 'Web Application Development', message: 'Hello there', honeypot: 'spam', extra_junk: true } }))
  const d = await jsonOf(post)
  check('contact POST accepts and succeeds', d?.success === true, d)

  const row = rows.contacts[0]
  check('contact insert whitelisted to real columns with reason folded in', row && row.message === 'Reason: Web Application Development\n\nHello there' && !('reason' in row) && !('honeypot' in row), row)

  const missing = await POST(req('/api/contact', { method: 'POST', body: { name: 'x', email: 'y' } }))
  check('contact POST validates required fields', missing.status === 400)

  const adminList = await GET(req('/api/contact', { as: 'admin' }))
  check('admin can list contact messages', (await jsonOf(adminList))?.success)
  const anonList = await GET(req('/api/contact'))
  check('contact list requires admin', anonList.status === 401)

  const mark = await itemPost(req(`/api/contact/${row.id}`, { method: 'POST', as: 'admin', body: { action: 'read' } }), { params: { id: row.id } })
  check('mark message read', (await jsonOf(mark))?.success && rows.contacts[0].is_read === true)
  const del = await itemPost(req(`/api/contact/${row.id}`, { method: 'POST', as: 'admin', body: { action: 'delete' } }), { params: { id: row.id } })
  check('delete message', (await jsonOf(del))?.success && rows.contacts.length === 0)
}

// ---------------------------------------------------------------------------
async function testOtherEntities() {
  seedProfiles()
  const skillsPost = (await import('@/app/api/skills/route')).POST
  const achPost = (await import('@/app/api/achievements/route')).POST
  const tstPost = (await import('@/app/api/testimonials/route')).POST
  const statPost = (await import('@/app/api/stats/route')).POST
  const usersGet = (await import('@/app/api/users/route')).GET
  const newsPost = (await import('@/app/api/newsletter/route')).POST

  const s = await skillsPost(req('/api/skills', { method: 'POST', as: 'admin', body: { name: 'React', category: 'Frontend', proficiency: 90, color: '#3B82F6', order: 1, featured: true } }))
  const sd = await jsonOf(s)
  check('skill create maps order→order_index, featured→is_published', sd?.success && sd.data.order_index === 1 && sd.data.is_published === true, sd?.data)

  const a = await achPost(req('/api/achievements', { method: 'POST', as: 'admin', body: { title: 'Cert', type: 'certificate', year: '2026', link: 'https://x', image: '/i.png', order: 2, featured: true, description: 'd' } }))
  const ad = await jsonOf(a)
  check('achievement create maps type/year/link/image', ad?.success && ad.data.category === 'certificate' && ad.data.date === '2026' && ad.data.certificate_url === 'https://x' && ad.data.image_url === '/i.png', ad?.data)

  const t = await tstPost(req('/api/testimonials', { method: 'POST', as: 'admin', body: { name: 'Bob', role: 'CEO', company: 'Acme', content: 'Great', rating: 5, order: 3, featured: true } }))
  check('testimonial create', (await jsonOf(t))?.success)

  const st = await statPost(req('/api/stats', { method: 'POST', as: 'admin', body: { label: 'Students', value: '120', suffix: '+', icon: 'Users', order: 1 } }))
  check('site stat create with string value', (await jsonOf(st))?.success)

  const u = await usersGet(req('/api/users', { as: 'admin' }))
  const ud = await jsonOf(u)
  // auth.admin.listUsers is not mocked — the route should fail gracefully (500) but NOT crash
  check('users GET does not crash without auth admin mock', u.status === 200 || u.status === 500, u.status)

  // Update routes ([id] edit pages)
  const skillId = rows.skills[0].id
  const skillUpd = jsonOf(await (await import('@/app/api/skills/[id]/route')).POST(req(`/api/skills/${skillId}`, { method: 'POST', as: 'admin', body: { name: 'React', category: 'Frontend', proficiency: 95, color: '#fff', order: 2, featured: false } }), { params: { id: skillId } }))
  check('skill update maps order/featured', (await skillUpd)?.data?.order_index === 2 && (await skillUpd)?.data?.is_published === false)

  const achId = rows.achievements[0].id
  const achUpd = jsonOf(await (await import('@/app/api/achievements/[id]/route')).POST(req(`/api/achievements/${achId}`, { method: 'POST', as: 'admin', body: { title: 'Cert', type: 'award', year: '2025', order: 5, featured: false, description: 'd' } }), { params: { id: achId } }))
  check('achievement update maps type/year', (await achUpd)?.data?.category === 'award' && (await achUpd)?.data?.date === '2025')

  const tstId = rows.testimonials[0].id
  const tstUpd = await (await import('@/app/api/testimonials/[id]/route')).POST(req(`/api/testimonials/${tstId}`, { method: 'POST', as: 'admin', body: { name: 'Bob', role: 'CTO', company: 'Acme', content: 'Superb', rating: 5, order: 1, featured: false } }), { params: { id: tstId } })
  check('testimonial update', (await jsonOf(tstUpd))?.data?.content === 'Superb')

  const statId = rows.site_stats[0].id
  const statUpd = await (await import('@/app/api/stats/[id]/route')).POST(req(`/api/stats/${statId}`, { method: 'POST', as: 'admin', body: { label: 'Students', value: '200', suffix: '+', icon: 'Users', order: 2 } }), { params: { id: statId } })
  check('site stat update', (await jsonOf(statUpd))?.data?.value === '200')

  // Projects (manual field mapping in the route)
  const projPost = (await import('@/app/api/projects/route')).POST
  const pr = await projPost(req('/api/projects', { method: 'POST', as: 'admin', body: { title: 'Nova', description: 'Platform', longDescription: 'Long', coverImage: '/c.png', subCategory: 'Web', tags: ['next'], techStack: 'React, Node', demoUrl: 'https://d', sourceUrl: 'https://g', featured: true, isPublished: true } }))
  const prd = await jsonOf(pr)
  check('project create maps techStack/urls', prd?.success && Array.isArray(prd.data.tech_stack) && prd.data.demo_url === 'https://d' && prd.data.github_url === 'https://g', prd?.data)
  const projUpd = await (await import('@/app/api/projects/[id]/route')).POST(req(`/api/projects/${prd.data.id}`, { method: 'POST', as: 'admin', body: { title: 'Nova 2', description: 'Platform', isPublished: true } }), { params: { id: prd.data.id } })
  check('project update maps isPublished', (await jsonOf(projUpd))?.data?.is_published === true)

  const n1 = await newsPost(req('/api/newsletter', { method: 'POST', body: { email: 'sub@x.y' } }))
  check('newsletter subscribe', (await jsonOf(n1))?.success)
  const n2 = await newsPost(req('/api/newsletter', { method: 'POST', body: { email: 'sub@x.y' } }))
  check('newsletter duplicate rejected (409)', n2.status === 409)
}

main().catch(e => {
  console.error('HARNESS ERROR:', e)
  process.exit(2)
})
