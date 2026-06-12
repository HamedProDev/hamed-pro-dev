import mongoose, { Document, Schema } from 'mongoose'

export interface IBlogPost extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  series?: string
  seriesOrder?: number
  readingTime: number
  views: number
  reactions: { like: number; love: number; fire: number; clap: number; mind_blown: number }
  comments: { author: string; email: string; content: string; approved: boolean; createdAt: Date }[]
  featured: boolean
  isPublished: boolean
  publishedAt?: Date
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string[] }
  createdBy: mongoose.Types.ObjectId
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  excerpt: { type: String, required: true, maxlength: 160 },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  series: String,
  seriesOrder: Number,
  readingTime: { type: Number, default: 1 },
  views: { type: Number, default: 0 },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    fire: { type: Number, default: 0 },
    clap: { type: Number, default: 0 },
    mind_blown: { type: Number, default: 0 },
  },
  comments: [{
    author: String,
    email: String,
    content: String,
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],
  featured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  seo: { metaTitle: String, metaDescription: String, keywords: [String] },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

BlogPostSchema.index({ slug: 1 })
BlogPostSchema.index({ isPublished: 1, category: 1 })
BlogPostSchema.index({ '$**': 'text' })

export const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)
