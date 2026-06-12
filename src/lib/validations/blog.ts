import { z } from 'zod'

export const blogPostSchema = z.object({
  title: z.string().min(1).max(100),
  excerpt: z.string().min(1).max(160),
  content: z.string().min(1),
  coverImage: z.string().url(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  series: z.string().optional(),
  seriesOrder: z.number().optional(),
  featured: z.boolean().default(false),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  isPublished: z.boolean().default(false),
})

export const commentSchema = z.object({
  author: z.string().min(1),
  email: z.string().email(),
  content: z.string().min(1).max(1000),
})

export type BlogPostInput = z.infer<typeof blogPostSchema>
export type CommentInput = z.infer<typeof commentSchema>
