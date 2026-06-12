import mongoose, { Document, Schema } from 'mongoose'

export interface IContact extends Document {
  name: string
  email: string
  subject: string
  reason: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  repliedAt?: Date
  createdAt: Date
}

const ContactSchema = new Schema<IContact>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  subject: { type: String, required: true },
  reason: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
  repliedAt: Date,
}, { timestamps: true })

ContactSchema.index({ status: 1, createdAt: -1 })

export const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema)
