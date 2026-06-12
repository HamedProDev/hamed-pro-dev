import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { Project } from '@/lib/db/models/Project'
import { BlogPost } from '@/lib/db/models/BlogPost'
import { Course } from '@/lib/db/models/Course'
import { Job } from '@/lib/db/models/Job'
import { apiSuccess, apiError } from '@/lib/auth/middleware'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    if (!q || q.length < 2) return apiSuccess({ projects: [], posts: [], courses: [], jobs: [] })

    const regex = { $regex: q, $options: 'i' }
    const [projects, posts, courses, jobs] = await Promise.all([
      Project.find({ isPublished: true, $or: [{ title: regex }, { description: regex }] }).limit(5).lean(),
      BlogPost.find({ isPublished: true, $or: [{ title: regex }, { excerpt: regex }] }).limit(5).lean(),
      Course.find({ isPublished: true, $or: [{ title: regex }, { description: regex }] }).limit(5).lean(),
      Job.find({ status: 'active', $or: [{ title: regex }, { company: regex }] }).limit(5).lean(),
    ])
    return apiSuccess({ projects, posts, courses, jobs })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
