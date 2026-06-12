import mongoose, { Document, Schema } from 'mongoose'

export interface IProject extends Document {
  title: string
  slug: string
  description: string
  longDescription: string
  category: 'large' | 'mini' | 'school'
  subCategory: 'finance' | 'education' | 'sports' | 'banking' | 'healthcare' | 'ecommerce' | 'agriculture' | 'transport' | 'social' | 'ai-ml' | 'other'
  coverImage: string
  images: string[]
  demoUrl?: string
  sourceUrl?: string
  isOpenSource: boolean
  techStack: string[]
  contributors: { name: string; github?: string; avatar?: string; role: string }[]
  status: 'live' | 'in-progress' | 'archived' | 'private'
  featured: boolean
  order: number
  views: number
  likes: number
  startDate?: Date
  endDate?: Date
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string[] }
  isPublished: boolean
  publishedAt?: Date
  createdBy: mongoose.Types.ObjectId
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true, maxlength: 160 },
  longDescription: { type: String, required: true },
  category: { type: String, enum: ['large', 'mini', 'school'], required: true },
  subCategory: { type: String, enum: ['finance', 'education', 'sports', 'banking', 'healthcare', 'ecommerce', 'agriculture', 'transport', 'social', 'ai-ml', 'other'], default: 'other' },
  coverImage: { type: String, required: true },
  images: [String],
  demoUrl: String,
  sourceUrl: String,
  isOpenSource: { type: Boolean, default: false },
  techStack: [{ type: String }],
  contributors: [{
    name: String,
    github: String,
    avatar: String,
    role: String,
  }],
  status: { type: String, enum: ['live', 'in-progress', 'archived', 'private'], default: 'in-progress' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

ProjectSchema.index({ slug: 1 })
ProjectSchema.index({ isPublished: 1, status: 1 })
ProjectSchema.index({ category: 1, subCategory: 1 })

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
