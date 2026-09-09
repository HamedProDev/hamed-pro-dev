/**
 * Demo/test data seeder — fills EVERY table with realistic data so the whole
 * site + admin can be exercised end to end. Run via:
 *
 *   npm run db:demo        (npx tsx scripts/seed-supabase.ts --demo)
 *
 * Idempotent: skips entities that already exist (keyed by email/slug), so it
 * can be re-run safely. `--reset` first removes everything if you want a
 * clean slate.
 */
// loosely typed — the seed data is intentionally schema-flexible
type SB = any

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'Demo1234!'

async function upsertAuthUser(supabase: SB, email: string, name: string) {
  const { data: list } = await supabase.auth.admin.listUsers()
  const existing = (list?.users ?? []).find((u: any) => u.email === email)
  if (existing) {
    await supabase.from('profiles').upsert(
      { id: existing.id, email, name, role: 'visitor' },
      { onConflict: 'id' }
    )
    return existing.id
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { name },
  })
  if (error) throw new Error(`auth.createUser(${email}): ${error.message}`)
  await supabase.from('profiles').upsert(
    { id: data.user.id, email, name, role: 'visitor' },
    { onConflict: 'id' }
  )
  return data.user.id
}

async function firstRow(supabase: SB, table: string, match: Record<string, any>) {
  const { data } = await supabase.from(table).select('*').match(match).limit(1)
  return data?.[0] ?? null
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 3600 * 1000).toISOString()
}

export async function seedDemoData(supabase: SB, adminId: string) {
  console.log('\nSeeding demo data —')

  // ---------------------------------------------------------------- users
  const studentA = await upsertAuthUser(supabase, 'student1@demo.dev', 'Aline Uwase')
  const studentB = await upsertAuthUser(supabase, 'student2@demo.dev', 'Eric Mugisha')
  const studentC = await upsertAuthUser(supabase, 'student3@demo.dev', 'Grace Ingabire')
  console.log('• users: 3 demo students (password: ' + DEMO_PASSWORD + ')')

  // -------------------------------------------------------------- courses
  const courseSpecs = [
    {
      title: 'Web Development Fundamentals',
      slug: 'web-development-fundamentals',
      description: 'Learn how the web works and build your first website with HTML, CSS and JavaScript.',
      content: '## What you will learn\n\n- How the internet works\n- HTML structure and semantics\n- CSS layout (Flexbox & Grid)\n- JavaScript basics\n\n> No prior experience needed.',
      category: 'Frontend', level: 'beginner', duration: '8', rating: 4.8,
      tags: ['html', 'css', 'javascript'], prerequisites: [], outcomes: ['Build a personal website', 'Understand the DOM'],
      is_published: true, enrolled: 0,
    },
    {
      title: 'React from Zero to Hero',
      slug: 'react-from-zero-to-hero',
      description: 'Components, state, hooks and routing — everything you need to build modern React apps.',
      content: '## React, properly\n\nFrom `useState` to full apps with routing and data fetching.',
      category: 'Frontend', level: 'intermediate', duration: '12', rating: 4.9,
      tags: ['react', 'hooks', 'spa'], prerequisites: ['JavaScript basics'], outcomes: ['Build SPAs', 'Think in components'],
      is_published: true, enrolled: 0,
    },
    {
      title: 'Intro to Machine Learning',
      slug: 'intro-to-machine-learning',
      description: 'Core ML concepts with practical examples — regression, classification and model evaluation.',
      content: '## ML without the mystery\n\n- What is a model?\n- Training vs inference\n- Evaluating accuracy',
      category: 'AI / ML', level: 'beginner', duration: '10', rating: 4.7,
      tags: ['python', 'ml', 'ai'], prerequisites: [], outcomes: ['Train your first model'],
      is_published: true, enrolled: 0,
    },
    {
      title: 'Advanced System Design (Draft)',
      slug: 'advanced-system-design',
      description: 'Draft course — scaling, caching, queues. Not published yet (visible only in admin).',
      content: 'Draft content — do not publish yet.',
      category: 'Backend', level: 'advanced', duration: '15', rating: 0,
      tags: ['architecture'], prerequisites: [], outcomes: [],
      is_published: false, enrolled: 0,
    },
  ]
  const courseIds: Record<string, string> = {}
  for (const spec of courseSpecs) {
    let row = await firstRow(supabase, 'courses', { slug: spec.slug })
    if (!row) {
      const { data, error } = await supabase.from('courses').insert(spec).select().single()
      if (error) { console.log(`  ⚠️ course ${spec.title}: ${error.message}`); continue }
      row = data
    }
    courseIds[spec.slug] = row.id
  }
  console.log(`• courses: ${Object.keys(courseIds).length} (3 published, 1 draft)`)

  // -------------------------------------------------------------- lessons
  const lessonSpecs: Record<string, any[]> = {
    'web-development-fundamentals': [
      { title: 'How the Internet Works', type: 'video', content: 'DNS, HTTP, browsers and servers — the big picture.', video_url: 'https://www.youtube.com/watch?v=7_LPdttKXPc', duration: '12', is_free: true, order_index: 1, quiz: [{ question: 'What does DNS do?', options: ['Translates domains to IPs', 'Compresses files', 'Renders pages'], correctIndex: 0, explanation: 'DNS is the phonebook of the internet.' }] },
      { title: 'HTML Structure & Semantics', type: 'text', content: '## Elements\n\nUse semantic tags: `<header>`, `<main>`, `<article>`, `<footer>`.', duration: '20', order_index: 2, quiz: [] },
      { title: 'CSS Layout with Flexbox & Grid', type: 'video', content: 'Modern layout without floats.', video_url: 'https://www.youtube.com/watch?v=qm0IfG1GyZU', duration: '35', order_index: 3, quiz: [{ question: 'Which property starts a flex container?', options: ['display: flex', 'flex: 1', 'layout: flex'], correctIndex: 0 }] },
      { title: 'JavaScript Basics + Quiz', type: 'mixed', content: 'Variables, functions, and the DOM.', duration: '45', order_index: 4, quiz: [{ question: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'def'], correctIndex: 1, explanation: 'let (and const) are block-scoped.' }] },
    ],
    'react-from-zero-to-hero': [
      { title: 'Thinking in Components', type: 'text', content: 'UI = f(state). Break screens into a component tree.', duration: '25', is_free: true, order_index: 1, quiz: [] },
      { title: 'State & Hooks Deep Dive', type: 'video', content: 'useState, useEffect, and custom hooks.', video_url: 'https://www.youtube.com/watch?v=O6P86uwfdR0', duration: '40', order_index: 2, quiz: [{ question: 'When does useEffect run by default?', options: ['After every render', 'Only on mount', 'Never'], correctIndex: 0 }] },
      { title: 'Routing & Data Fetching', type: 'text', content: 'Client-side routing and fetching patterns.', duration: '30', order_index: 3, quiz: [] },
    ],
    'intro-to-machine-learning': [
      { title: 'What Is a Model?', type: 'text', content: 'A function with learned parameters.', duration: '15', is_free: true, order_index: 1, quiz: [{ question: 'Training is…', options: ['Adjusting parameters from data', 'Writing SQL', 'Buying GPUs'], correctIndex: 0 }] },
      { title: 'Your First Classifier', type: 'video', content: 'Hands-on with a simple dataset.', video_url: 'https://www.youtube.com/watch?v=Zi7BNvsI2VY', duration: '50', order_index: 2, quiz: [] },
    ],
    'advanced-system-design': [
      { title: 'Draft Lesson — Caching', type: 'text', content: 'Draft — CDN vs app cache vs DB cache.', duration: '20', order_index: 1, quiz: [] },
    ],
  }
  let lessonCount = 0
  const lessonsByCourse: Record<string, any[]> = {}
  for (const [slug, specs] of Object.entries(lessonSpecs)) {
    const courseId = courseIds[slug]
    if (!courseId) continue
    lessonsByCourse[slug] = []
    for (const spec of specs) {
      let row = await firstRow(supabase, 'lessons', { course_id: courseId, slug: spec.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })
      if (!row) {
        const { data, error } = await supabase
          .from('lessons')
          .insert({ ...spec, course_id: courseId, slug: spec.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), is_published: true })
          .select().single()
        if (error) { console.log(`  ⚠️ lesson ${spec.title}: ${error.message}`); continue }
        row = data
      }
      lessonsByCourse[slug].push(row)
      lessonCount++
    }
  }
  console.log(`• lessons: ${lessonCount} across the courses`)

  // ------------------------------------------- enrollments/progress/certs
  const finalQuiz: Record<string, any[]> = {
    'web-development-fundamentals': [{ question: 'HTML is used for…', options: ['Structure', 'Styling', 'Logic'], correctIndex: 0, explanation: 'HTML structures content.' }],
    'react-from-zero-to-hero': [{ question: 'useState returns…', options: ['[value, setter]', 'A promise', 'A class'], correctIndex: 0 }],
    'intro-to-machine-learning': [],
  }
  let enrollCount = 0, progressCount = 0, certCount = 0
  const enroll = async (studentId: string, slug: string, completeThrough: number) => {
    const courseId = courseIds[slug]
    if (!courseId) return
    let enrollment = await firstRow(supabase, 'enrollments', { user_id: studentId, course_id: courseId })
    if (!enrollment) {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({ user_id: studentId, course_id: courseId, status: 'active', progress: 0 })
        .select().single()
      if (error) { console.log(`  ⚠️ enrollment: ${error.message}`); return }
      enrollment = data
    }
    enrollCount++
    const lessons = lessonsByCourse[slug] || []
    const total = lessons.length
    for (let i = 0; i < completeThrough && i < total; i++) {
      const lesson = lessons[i]
      const hasQuiz = (lesson.quiz || []).length > 0
      const existing = await firstRow(supabase, 'lesson_progress', { user_id: studentId, lesson_id: lesson.id })
      if (!existing) {
        const { error } = await supabase.from('lesson_progress').insert({
          user_id: studentId,
          course_id: courseId,
          lesson_id: lesson.id,
          completed: true,
          quiz_score: hasQuiz ? 100 : null,
          time_spent_seconds: 600 + i * 240,
          last_accessed_at: daysAgo(total - i),
          completed_at: daysAgo(total - i),
        })
        if (!error) progressCount++
      } else {
        progressCount++
      }
    }
    const percent = total > 0 ? Math.round((Math.min(completeThrough, total) / total) * 100) : 0
    if (percent >= 100) {
      // Student finished every lesson (and passed the final quiz where present)
      // — mark completed and issue the verifiable certificate.
      await supabase.from('enrollments').update({ progress: 100, status: 'completed', completed_at: daysAgo(1) }).eq('id', enrollment.id)
      const hasCert = await firstRow(supabase, 'certificates', { user_id: studentId, course_id: courseId })
      if (!hasCert) {
        const number = `HH-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
        const { error } = await supabase.from('certificates').insert({
          certificate_number: number,
          user_id: studentId,
          course_id: courseId,
          enrollment_id: enrollment.id,
          recipient_name: 'Demo Student',
          course_title: courseSpecs.find(c => c.slug === slug)?.title || slug,
          score: 90,
          issue_date: new Date().toISOString().slice(0, 10),
          is_verified: true,
        })
        if (!error) certCount++
      } else {
        certCount++
      }
    } else {
      await supabase.from('enrollments').update({ progress: percent, status: 'active' }).eq('id', enrollment.id)
    }
  }
  await enroll(studentA, 'web-development-fundamentals', 4) // → completed + certificate
  await enroll(studentA, 'react-from-zero-to-hero', 2)      // → in progress
  await enroll(studentB, 'intro-to-machine-learning', 1)    // → just started
  await enroll(studentB, 'web-development-fundamentals', 2) // → halfway
  console.log(`• enrollments: ${enrollCount}, lesson_progress rows: ${progressCount}, certificates: ${certCount} (verify at /verify/<number>)`)

  // ------------------------------------------------------------- projects
  const projectSpecs = [
    { title: 'NovaSoft Platform', slug: 'novasoft-platform', description: 'Full-stack business management platform for Rwandan SMEs.', content: 'Inventory, invoicing and analytics in one place.', category: 'Web App', tags: ['next.js', 'supabase'], tech_stack: ['Next.js', 'Supabase', 'Tailwind'], demo_url: 'https://novasoft.rw', image_url: null, featured: true, is_published: true, order_index: 1, year: '2025', role: 'Lead Developer', status: 'Live' },
    { title: 'Kigali Transit Mapper', slug: 'kigali-transit-mapper', description: 'Real-time public transport map for Kigali with route planning.', content: 'React Native + GTFS feeds.', category: 'Mobile', tags: ['react-native'], tech_stack: ['React Native', 'Mapbox'], featured: false, is_published: true, order_index: 2, year: '2024', role: 'Developer', status: 'Live' },
    { title: 'ML Stock Predictor', slug: 'ml-stock-predictor', description: 'Time-series forecasting experiments with Python.', content: 'LSTM vs Transformer baselines.', category: 'AI/ML', tags: ['python', 'pytorch'], tech_stack: ['Python', 'PyTorch'], featured: false, is_published: true, order_index: 3, year: '2024', status: 'Experiment' },
  ]
  let projects = 0
  for (const spec of projectSpecs) {
    if (!(await firstRow(supabase, 'projects', { slug: spec.slug }))) {
      const { error } = await supabase.from('projects').insert(spec)
      if (!error) projects++
    }
  }
  console.log(`• projects: ${projects} added`)

  // --------------------------------------------------------------- skills
  const skillSpecs = [
    { name: 'TypeScript', category: 'Languages', proficiency: 95, color: '#3178c6', is_published: true, order_index: 1 },
    { name: 'React / Next.js', category: 'Frontend', proficiency: 92, color: '#61dafb', is_published: true, order_index: 2 },
    { name: 'Node.js', category: 'Backend', proficiency: 88, color: '#68a063', is_published: true, order_index: 3 },
    { name: 'Python & ML', category: 'AI/ML', proficiency: 80, color: '#eab308', is_published: true, order_index: 4 },
    { name: 'PostgreSQL / Supabase', category: 'Database', proficiency: 85, color: '#3ecf8e', is_published: true, order_index: 5 },
  ]
  let skills = 0
  for (const spec of skillSpecs) {
    if (!(await firstRow(supabase, 'skills', { name: spec.name }))) {
      const { error } = await supabase.from('skills').insert(spec)
      if (!error) skills++
    }
  }
  console.log(`• skills: ${skills} added`)

  // --------------------------------------------------------- achievements
  const achievementSpecs = [
    { title: 'AWS Certified Developer', description: 'Associate-level certification.', category: 'certificate', date: '2024', certificate_url: 'https://aws.amazon.com/verification', is_published: true, order_index: 1 },
    { title: 'Hackathon Winner — Kigali Tech Week', description: '1st place, 48-hour build.', category: 'award', date: '2025', is_published: true, order_index: 2 },
    { title: 'BSc Computer Science', description: 'University of Rwanda.', category: 'education', date: '2022', is_published: true, order_index: 3 },
  ]
  let achievements = 0
  for (const spec of achievementSpecs) {
    if (!(await firstRow(supabase, 'achievements', { title: spec.title }))) {
      const { error } = await supabase.from('achievements').insert(spec)
      if (!error) achievements++
    }
  }
  console.log(`• achievements: ${achievements} added`)

  // --------------------------------------------------------- testimonials
  const testimonialSpecs = [
    { name: 'Aline Uwase', role: 'Student', company: 'Demo', content: 'The courses are clear and the certificate helped me land my first internship!', rating: 5, is_published: true, order_index: 1 },
    { name: 'Jean Bosco', role: 'CTO', company: 'NovaSoft', content: 'Delivered our platform ahead of schedule. Excellent communication.', rating: 5, is_published: true, order_index: 2 },
    { name: 'Maria Kim', role: 'Mentor', company: 'TechBridge', content: 'A fast learner who now teaches others — the ML course is great.', rating: 4, is_published: true, order_index: 3 },
  ]
  let testimonials = 0
  for (const spec of testimonialSpecs) {
    if (!(await firstRow(supabase, 'testimonials', { name: spec.name, content: spec.content }))) {
      const { error } = await supabase.from('testimonials').insert(spec)
      if (!error) testimonials++
    }
  }
  console.log(`• testimonials: ${testimonials} added`)

  // ----------------------------------------------------------- site stats
  const statSpecs = [
    { label: 'Projects Completed', value: '32', suffix: '+', icon: 'FolderOpen', is_published: true, order_index: 1 },
    { label: 'Happy Clients', value: '18', suffix: '+', icon: 'ThumbsUp', is_published: true, order_index: 2 },
    { label: 'Students Taught', value: '450', suffix: '+', icon: 'Users', is_published: true, order_index: 3 },
    { label: 'Certificates Issued', value: '120', suffix: '+', icon: 'Award', is_published: true, order_index: 4 },
  ]
  let stats = 0
  for (const spec of statSpecs) {
    if (!(await firstRow(supabase, 'site_stats', { label: spec.label }))) {
      const { error } = await supabase.from('site_stats').insert(spec)
      if (!error) stats++
    }
  }
  console.log(`• site stats: ${stats} added`)

  // ------------------------------------------------------ contact messages
  const messageSpecs = [
    { name: 'Prospective Client', email: 'client@demo.dev', subject: 'Web app quote', message: 'Reason: Web Application Development\n\nHi! We need a dashboard for our logistics business. What is your availability?', is_read: false },
    { name: 'Curious Learner', email: 'learner@demo.dev', subject: 'Certificate question', message: 'Reason: Other\n\nAre the certificates verifiable by employers?', is_read: true },
  ]
  let messages = 0
  for (const spec of messageSpecs) {
    if (!(await firstRow(supabase, 'contacts', { email: spec.email, subject: spec.subject }))) {
      const { error } = await supabase.from('contacts').insert(spec)
      if (!error) messages++
    }
  }
  console.log(`• contact messages: ${messages} added`)

  // ------------------------------------------------- newsletter subscribers
  const subSpecs = [
    { email: 'subscriber1@demo.dev', is_active: true },
    { email: 'subscriber2@demo.dev', is_active: true },
    { email: 'subscriber3@demo.dev', is_active: false },
  ]
  let subs = 0
  for (const spec of subSpecs) {
    if (!(await firstRow(supabase, 'newsletter_subscribers', { email: spec.email }))) {
      const { error } = await supabase.from('newsletter_subscribers').insert(spec)
      if (!error) subs++
    }
  }
  console.log(`• newsletter subscribers: ${subs} added (view in Admin → Contact → Newsletter)`)

  // ------------------------------------------------------ lesson comments
  let comments = 0
  const fundamentals = lessonsByCourse['web-development-fundamentals'] || []
  if (fundamentals[0]) {
    const existing = await firstRow(supabase, 'lesson_comments', { user_id: studentB, lesson_id: fundamentals[0].id })
    if (!existing) {
      const { error } = await supabase.from('lesson_comments').insert([
        { lesson_id: fundamentals[0].id, user_id: studentB, content: 'Loved this intro — DNS finally makes sense!', status: 'visible' },
        { lesson_id: fundamentals[0].id, user_id: studentC, content: '[spam] Buy cheap courses at sketchy-link.example', status: 'pending' },
      ])
      if (!error) comments = 2
    }
  }
  console.log(`• lesson comments: ${comments} added (one pending → moderate in Admin → Comments)`)

  // ------------------------------------------------------------- settings
  const { data: existingSettings } = await supabase.from('settings').select('id').limit(1)
  if (!existingSettings || existingSettings.length === 0) {
    await supabase.from('settings').insert({
      site_name: 'Hamed Hussein',
      tagline: 'Full Stack Developer & AI/ML Engineer',
      description: 'I build web platforms and teach AI/ML — from Kigali, Rwanda.',
      hero_name: 'Hamed Hussein',
      hero_title: 'Full Stack Developer & AI/ML Engineer',
      hero_subtitle: 'I build products and teach what I learn.',
      contact_email: 'hello@hamedpro.dev',
      contact_phone: '+250 793 553 492',
      address: 'Kigali, Rwanda',
      location: 'Kigali, Rwanda',
      contact_success_message: "Message sent successfully! I'll get back to you within 24 hours.",
      allow_registration: true,
      social_links: { github: 'https://github.com/hamedprodev', linkedin: 'https://linkedin.com/in/hamedprodev' },
      seo_defaults: { metaTitle: 'Hamed Hussein — Full Stack Developer & AI/ML Engineer', metaDescription: 'Portfolio, free courses and verifiable certificates.', keywords: ['Hamed Hussein', 'hamedprodev', 'full stack', 'AI ML'] },
    })
    console.log('• settings: created with demo values')
  } else {
    console.log('• settings: already exists — left untouched')
  }

  // ------------------------------------------------------------ analytics
  const { data: existingAnalytics } = await supabase.from('analytics').select('id').limit(1)
  if (!existingAnalytics || existingAnalytics.length === 0) {
    const events: any[] = []
    const pages = ['/', '/courses', '/projects', '/contact', '/about']
    for (let d = 14; d >= 0; d--) {
      for (let i = 0; i < 3 + (d % 4); i++) {
        events.push({
          page: pages[(d + i) % pages.length],
          event: 'pageview',
          referrer: i % 3 === 0 ? 'https://google.com' : null,
          created_at: daysAgo(d),
        })
      }
    }
    await supabase.from('analytics').insert(events)
    console.log(`• analytics: ${events.length} pageview rows (15 days)`)
  } else {
    console.log('• analytics: already has data — left untouched')
  }

  console.log('\n✔ Demo data ready. Log in as any demo student at /login:')
  console.log(`   student1@demo.dev / ${DEMO_PASSWORD}`)
  console.log(`   student2@demo.dev / ${DEMO_PASSWORD}`)
  console.log(`   student3@demo.dev / ${DEMO_PASSWORD}`)
}
