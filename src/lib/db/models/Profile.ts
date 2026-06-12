import mongoose, { Document, Schema } from 'mongoose'

export interface IProfile extends Document {
  name: string
  tagline: string
  bio: string
  avatar: string
  coverImage: string
  location: string
  email: string
  phone?: string
  github: string
  linkedin?: string
  twitter?: string
  youtube?: string
  skills: { category: string; items: { name: string; level: number }[] }[]
  experience: { title: string; company: string; location: string; start: Date; end?: Date; current: boolean; description: string }[]
  education: { degree: string; institution: string; location: string; start: Date; end?: Date; grade?: string }[]
  certifications: { name: string; issuer: string; date: Date; url?: string; credentialId?: string }[]
  languages: { name: string; level: 'Native' | 'Fluent' | 'Intermediate' | 'Basic' }[]
  services: { title: string; description: string; price?: string; icon: string }[]
  availability: 'available' | 'limited' | 'unavailable'
  availabilityNote?: string
  cvUrl?: string
  testimonials: { name: string; role: string; company: string; avatar?: string; content: string; rating: number; approved: boolean }[]
  stats: { yearsExperience: number; projectsCompleted: number; happyClients: number; githubStars: number }
}

const ProfileSchema = new Schema<IProfile>({
  name: { type: String, required: true },
  tagline: { type: String, default: 'Fullstack & AI/ML Engineer' },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  location: { type: String, default: 'Kigali, Rwanda' },
  email: { type: String, default: '' },
  phone: String,
  github: { type: String, default: '' },
  linkedin: String,
  twitter: String,
  youtube: String,
  skills: [{ category: String, items: [{ name: String, level: Number }] }],
  experience: [{ title: String, company: String, location: String, start: Date, end: Date, current: Boolean, description: String }],
  education: [{ degree: String, institution: String, location: String, start: Date, end: Date, grade: String }],
  certifications: [{ name: String, issuer: String, date: Date, url: String, credentialId: String }],
  languages: [{ name: String, level: { type: String, enum: ['Native', 'Fluent', 'Intermediate', 'Basic'] } }],
  services: [{ title: String, description: String, price: String, icon: String }],
  availability: { type: String, enum: ['available', 'limited', 'unavailable'], default: 'available' },
  availabilityNote: String,
  cvUrl: String,
  testimonials: [{
    name: String, role: String, company: String, avatar: String,
    content: String, rating: { type: Number, min: 1, max: 5 },
    approved: { type: Boolean, default: false },
  }],
  stats: {
    yearsExperience: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    happyClients: { type: Number, default: 0 },
    githubStars: { type: Number, default: 0 },
  },
}, { timestamps: true })

export const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema)
