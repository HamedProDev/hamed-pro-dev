import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISiteStats extends Document {
  label: string
  value: number
  suffix: string
  icon: string
  order: number
  createdAt: Date
  updatedAt: Date
}

const SiteStatsSchema = new Schema<ISiteStats>(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    suffix: { type: String, default: '' },
    icon: { type: String, default: 'FolderOpen' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const SiteStats: Model<ISiteStats> =
  mongoose.models.SiteStats || mongoose.model<ISiteStats>('SiteStats', SiteStatsSchema)

export default SiteStats
