import mongoose, { Document, Schema } from 'mongoose'

export interface IJob extends Document {
  title: string
  company: string
  companyLogo?: string
  companyWebsite?: string
  location: string
  locationType: 'onsite' | 'remote' | 'hybrid'
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance'
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'ai-ml' | 'devops' | 'design' | 'other'
  description: string
  requirements: string[]
  niceToHave: string[]
  skills: string[]
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  applicationUrl?: string
  applicationEmail?: string
  deadline?: Date
  source: 'manual' | 'scraped'
  sourceUrl?: string
  status: 'active' | 'closed' | 'draft'
  featured: boolean
  views: number
  applications: number
  postedBy?: mongoose.Types.ObjectId
  approvedBy?: mongoose.Types.ObjectId
  isApproved: boolean
  expiresAt: Date
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  companyLogo: String,
  companyWebsite: String,
  location: { type: String, required: true },
  locationType: { type: String, enum: ['onsite', 'remote', 'hybrid'], default: 'remote' },
  type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'], required: true },
  category: { type: String, enum: ['frontend', 'backend', 'fullstack', 'mobile', 'ai-ml', 'devops', 'design', 'other'], required: true },
  description: { type: String, required: true },
  requirements: [String],
  niceToHave: [String],
  skills: [{ type: String }],
  salaryMin: Number,
  salaryMax: Number,
  salaryCurrency: { type: String, default: 'USD' },
  applicationUrl: String,
  applicationEmail: String,
  deadline: Date,
  source: { type: String, enum: ['manual', 'scraped'], default: 'manual' },
  sourceUrl: String,
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  applications: { type: Number, default: 0 },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  isApproved: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true })

JobSchema.index({ status: 1, expiresAt: 1 })
JobSchema.index({ category: 1, locationType: 1 })

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema)
