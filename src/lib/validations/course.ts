import { z } from 'zod'

export const courseSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  longDescription: z.string().min(1),
  coverImage: z.string().url(),
  category: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  type: z.enum(['free', 'premium']),
  price: z.number().min(0).optional(),
  language: z.string().default('en'),
  youtubePlaylistUrl: z.string().url().optional().or(z.literal('')),
  prerequisites: z.array(z.string()).optional(),
  outcomes: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional(),
  certificate: z.boolean().default(false),
  featured: z.boolean().default(false),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  isPublished: z.boolean().default(false),
})

export const lessonSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['video', 'text', 'quiz', 'mixed']),
  content: z.string().optional(),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.enum(['pdf', 'link', 'code']),
  })).optional(),
  quiz: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()).min(2),
    correctIndex: z.number(),
    explanation: z.string().optional(),
  })).optional(),
  isFree: z.boolean().default(false),
  isPublished: z.boolean().default(false),
})

export type CourseInput = z.infer<typeof courseSchema>
export type LessonInput = z.infer<typeof lessonSchema>
