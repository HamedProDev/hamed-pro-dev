import { z } from 'zod'

export const jobSchema = z.object({
  title: z.string().min(1).max(100),
  company: z.string().min(1),
  companyLogo: z.string().url().optional().or(z.literal('')),
  companyWebsite: z.string().url().optional().or(z.literal('')),
  location: z.string().min(1),
  locationType: z.enum(['onsite', 'remote', 'hybrid']),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']),
  category: z.enum(['frontend', 'backend', 'fullstack', 'mobile', 'ai-ml', 'devops', 'design', 'other']),
  description: z.string().min(1),
  requirements: z.array(z.string()).min(1),
  niceToHave: z.array(z.string()).optional(),
  skills: z.array(z.string()).min(1),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().default('USD'),
  applicationUrl: z.string().url().optional().or(z.literal('')),
  applicationEmail: z.string().email().optional().or(z.literal('')),
  deadline: z.string().optional(),
  isApproved: z.boolean().default(true),
})

export type JobInput = z.infer<typeof jobSchema>
