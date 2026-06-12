import mongoose, { Document, Schema } from 'mongoose'

export interface IAnalytics extends Document {
  page: string
  views: number
  uniqueVisitors: string[]
  referrers: { source: string; count: number }[]
  countries: { code: string; count: number }[]
  date: Date
}

const AnalyticsSchema = new Schema<IAnalytics>({
  page: { type: String, required: true },
  views: { type: Number, default: 0 },
  uniqueVisitors: [String],
  referrers: [{ source: String, count: Number }],
  countries: [{ code: String, count: Number }],
  date: { type: Date, required: true },
}, { timestamps: true })

AnalyticsSchema.index({ page: 1, date: 1 })

export const Analytics = mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema)
