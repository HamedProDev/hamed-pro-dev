import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAchievement extends Document {
  title: string
  description: string
  year: string
  type: 'award' | 'certification' | 'milestone' | 'project' | 'publication'
  icon?: string
  link?: string
  order: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const AchievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: String, required: true },
    type: {
      type: String,
      enum: ['award', 'certification', 'milestone', 'project', 'publication'],
      required: true,
    },
    icon: String,
    link: String,
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Achievement: Model<IAchievement> =
  mongoose.models.Achievement ||
  mongoose.model<IAchievement>('Achievement', AchievementSchema)

export default Achievement
