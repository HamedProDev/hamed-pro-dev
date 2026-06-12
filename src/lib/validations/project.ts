import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(160),
  longDescription: z.string().min(1),
  category: z.enum(['large', 'mini', 'school']),
  subCategory: z.enum(['finance', 'education', 'sports', 'banking', 'healthcare', 'ecommerce', 'agriculture', 'transport', 'social', 'ai-ml', 'other']),
  coverImage: z.string().url(),
  images: z.array(z.string().url()).optional(),
  demoUrl: z.string().url().optional().or(z.literal('')),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  isOpenSource: z.boolean().default(false),
  techStack: z.array(z.string()).min(1),
  contributors: z.array(z.object({
    name: z.string(),
    github: z.string().optional(),
    avatar: z.string().optional(),
    role: z.string(),
  })).optional(),
  status: z.enum(['live', 'in-progress', 'archived', 'private']),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  isPublished: z.boolean().default(false),
})

export type ProjectInput = z.infer<typeof projectSchema>
