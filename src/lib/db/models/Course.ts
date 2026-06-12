import mongoose, { Document, Schema } from 'mongoose'

export interface ICourse extends Document {
  title: string
  slug: string
  description: string
  longDescription: string
  coverImage: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  type: 'free' | 'premium'
  price?: number
  language: string
  youtubePlaylistUrl?: string
  duration: number
  lessons: mongoose.Types.ObjectId[]
  prerequisites: string[]
  outcomes: string[]
  tags: string[]
  enrolled: number
  rating: number
  ratings: { user: mongoose.Types.ObjectId; score: number; comment?: string }[]
  certificate: boolean
  featured: boolean
  isPublished: boolean
  publishedAt?: Date
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string[] }
  createdBy: mongoose.Types.ObjectId
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  coverImage: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  type: { type: String, enum: ['free', 'premium'], default: 'free' },
  price: { type: Number, default: 0 },
  language: { type: String, default: 'en' },
  youtubePlaylistUrl: String,
  duration: { type: Number, default: 0 },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  prerequisites: [String],
  outcomes: [String],
  tags: [String],
  enrolled: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratings: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, min: 1, max: 5 },
    comment: String,
  }],
  certificate: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  seo: { metaTitle: String, metaDescription: String, keywords: [String] },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

CourseSchema.index({ slug: 1 })
CourseSchema.index({ isPublished: 1, category: 1 })

export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)
