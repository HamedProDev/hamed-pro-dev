import { generateSlug } from './utils/slug'

export interface GeneratedLesson {
  slug: string
  title: string
  content: string
  type: string
  order_index: number
  is_published: boolean
}

function sectionBullets(content: string, heading: string): string[] {
  const re = new RegExp(`##\\s*${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i')
  const m = content.match(re)
  if (!m) return []
  return m[1]
    .split('\n')
    .map((l) => l.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
}

/**
 * Derive real "steps" for a course from its content markdown.
 *
 * Seed courses ship with `## What You'll Learn` bullet lists but no lesson
 * rows, so without this every course shows "0 lessons" and can never be
 * completed. Each bullet becomes one step; courses without that section fall
 * back to one step per `##` heading (minimum: intro + wrap-up).
 */
export function buildLessonsFromCourse(course: {
  title?: string
  description?: string
  content?: string
}): GeneratedLesson[] {
  const lessons: GeneratedLesson[] = []
  const title = course.title || 'this course'
  const description = course.description || title

  lessons.push({
    slug: 'introduction',
    title: 'Course Introduction',
    content: `## Welcome to ${title}\n\n${description}\n\n## How this course works\n\nWork through each step in order. Complete a step to unlock the next one — your progress is counted one step at a time. Finish every step to earn your free certificate.`,
    type: 'text',
    order_index: 1,
    is_published: true,
  })

  const content = course.content || ''
  const bullets = sectionBullets(content, "What You'll Learn")

  if (bullets.length > 0) {
    bullets.forEach((b, i) => {
      const base = generateSlug(b).slice(0, 50) || `step-${i + 1}`
      lessons.push({
        slug: `step-${i + 1}-${base}`,
        title: b.length > 90 ? `${b.slice(0, 90)}…` : b,
        content: `## ${b}\n\nIn this step you will master **${b}**.\n\n### What to do\n- Read the notes below carefully\n- Try each example yourself\n- Build a small exercise using **${b}**\n\n### Key takeaway\n${b} — practise it until it feels natural, then mark this step complete to unlock the next one.`,
        type: 'text',
        order_index: lessons.length + 1,
        is_published: true,
      })
    })
  } else {
    const parts = content.split(/\n##\s+/)
    for (const part of parts.slice(1)) {
      const nl = part.indexOf('\n')
      const heading = (nl === -1 ? part : part.slice(0, nl)).trim()
      const body = nl === -1 ? '' : part.slice(nl + 1).trim()
      if (!heading) continue
      const base = generateSlug(heading).slice(0, 50) || `part-${lessons.length}`
      lessons.push({
        slug: `part-${lessons.length}-${base}`,
        title: heading,
        content: body || heading,
        type: 'text',
        order_index: lessons.length + 1,
        is_published: true,
      })
    }
  }

  lessons.push({
    slug: 'wrap-up',
    title: 'Wrap-up & Certificate',
    content: `## Congratulations 🎉\n\nYou've completed every step of **${title}**. Head back to the course page — if there's a final assessment, pass it to claim your free certificate.`,
    type: 'text',
    order_index: lessons.length + 1,
    is_published: true,
  })

  return lessons
}
