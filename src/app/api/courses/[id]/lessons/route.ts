import { NextRequest } from 'next/server'
import { getDocuments, createDocument, countDocuments, getDocument, updateDocument } from '@/lib/firebase/firestore'
import { requireAdmin, apiSuccess, apiError } from '@/lib/firebase/auth'
import { generateSlug } from '@/lib/utils/slug'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lessons = await getDocuments('lessons', { filters: [{ field: 'course', operator: '==', value: params.id }], orderBy: { field: 'order', direction: 'asc' } })
    return apiSuccess(lessons)
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const slug = body.slug || generateSlug(body.title)
    const count = await countDocuments('lessons', [{ field: 'course', operator: '==', value: params.id }])
    const lesson = await createDocument('lessons', { ...body, slug, course: params.id, order: count + 1 })
    const course = await getDocument('courses', params.id)
    if (course) {
      const lessons = course.lessons || []
      lessons.push(lesson.id)
      await updateDocument('courses', params.id, { lessons })
    }
    return apiSuccess(lesson, 'Lesson created')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
