import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password?: string
  image?: string
  role: 'admin' | 'student' | 'employer' | 'visitor'
  bio?: string
  github?: string
  linkedin?: string
  twitter?: string
  website?: string
  location?: string
  skills?: string[]
  savedJobs?: mongoose.Types.ObjectId[]
  enrolledCourses?: {
    course: mongoose.Types.ObjectId
    progress: number
    completedLessons: mongoose.Types.ObjectId[]
    enrolledAt: Date
    completedAt?: Date
  }[]
  newsletterSubscribed: boolean
  emailVerified?: Date
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  image: String,
  role: { type: String, enum: ['admin', 'student', 'employer', 'visitor'], default: 'visitor' },
  bio: String,
  github: String,
  linkedin: String,
  twitter: String,
  website: String,
  location: String,
  skills: [String],
  savedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  enrolledCourses: [{
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    enrolledAt: { type: Date, default: Date.now },
    completedAt: Date,
  }],
  newsletterSubscribed: { type: Boolean, default: false },
  emailVerified: Date,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, { timestamps: true })

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
