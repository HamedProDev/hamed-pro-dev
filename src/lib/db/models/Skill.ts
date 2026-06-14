import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISkill extends Document {
  name: string
  category: string
  proficiency: number
  color: string
  icon?: string
  order: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    proficiency: { type: Number, required: true, min: 0, max: 100 },
    color: { type: String, default: '#3B82F6' },
    icon: String,
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema)

export default Skill
