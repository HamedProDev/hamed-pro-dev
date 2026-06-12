import mongoose, { Document, Schema } from 'mongoose'

export interface ILesson extends Document {
  course: mongoose.Types.ObjectId
  title: string
  slug: string
  order: number
  type: 'video' | 'text' | 'quiz' | 'mixed'
  content: string
  youtubeUrl?: string
  videoDuration?: number
  resources: { title: string; url: string; type: 'pdf' | 'link' | 'code' }[]
  quiz?: {
    question: string
    options: string[]
    correctIndex: number
    explanation?: string
  }[]
  isFree: boolean
  isPublished: boolean
}

const LessonSchema = new Schema<ILesson>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true },
  order: { type: Number, required: true },
  type: { type: String, enum: ['video', 'text', 'quiz', 'mixed'], default: 'text' },
  content: { type: String, default: '' },
  youtubeUrl: String,
  videoDuration: Number,
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['pdf', 'link', 'code'] },
  }],
  quiz: [{
    question: String,
    options: [String],
    correctIndex: Number,
    explanation: String,
  }],
  isFree: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true })

LessonSchema.index({ course: 1, order: 1 })

export const Lesson = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema)
