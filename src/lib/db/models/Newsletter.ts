import mongoose, { Document, Schema } from 'mongoose'

export interface INewsletterSubscriber extends Document {
  email: string
  name?: string
  status: 'subscribed' | 'unsubscribed'
  source: string
  subscribedAt: Date
  unsubscribedAt?: Date
  token: string
}

const NewsletterSchema = new Schema<INewsletterSubscriber>({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: String,
  status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed' },
  source: { type: String, default: 'homepage' },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: Date,
  token: { type: String, required: true },
}, { timestamps: true })

export const NewsletterSubscriber = mongoose.models.NewsletterSubscriber || mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSchema)
