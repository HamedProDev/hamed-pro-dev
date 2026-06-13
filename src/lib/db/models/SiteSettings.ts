import mongoose, { Document, Schema } from 'mongoose'

export interface ISiteSettings extends Document {
  siteName: string
  tagline: string
  description: string
  keywords: string[]
  logo: string
  favicon: string
  ogImage: string
  profilePhoto: string
  heroName: string
  heroTitle: string
  heroSubtitle: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    youtube?: string
    instagram?: string
    discord?: string
    whatsapp?: string
    facebook?: string
    tiktok?: string
    telegram?: string
  }
  contactEmail: string
  contactPhone?: string
  address?: string
  location?: string
  maintenanceMode: boolean
  allowRegistration: boolean
  emailNotifications: { newContact: boolean; newJob: boolean; newNewsletter: boolean }
  seoDefaults: { titleTemplate: string; twitterHandle: string; locale: string }
  integrations: { cloudinaryCloudName: string; calComUrl?: string; discordInvite?: string; whatsappNumber?: string }
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  siteName: { type: String, default: 'HamedProDev' },
  tagline: { type: String, default: 'Fullstack & AI/ML Developer' },
  description: { type: String, default: '' },
  keywords: [String],
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
  ogImage: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  heroName: { type: String, default: 'Hamed Hussein' },
  heroTitle: { type: String, default: 'Full Stack Developer & AI Engineer' },
  heroSubtitle: { type: String, default: 'Building scalable solutions that make an impact.' },
  socialLinks: {
    github: String, linkedin: String, twitter: String,
    youtube: String, instagram: String, discord: String,
    whatsapp: String, facebook: String, tiktok: String, telegram: String,
  },
  contactEmail: { type: String, default: 'hamedpro.work@gmail.com' },
  contactPhone: String,
  address: String,
  location: { type: String, default: 'Kigali, Rwanda' },
  maintenanceMode: { type: Boolean, default: false },
  allowRegistration: { type: Boolean, default: true },
  emailNotifications: {
    newContact: { type: Boolean, default: true },
    newJob: { type: Boolean, default: true },
    newNewsletter: { type: Boolean, default: true },
  },
  seoDefaults: {
    titleTemplate: { type: String, default: '%s | HamedProDev' },
    twitterHandle: { type: String, default: '@hamedProDev' },
    locale: { type: String, default: 'en_US' },
  },
  integrations: {
    cloudinaryCloudName: { type: String, default: '' },
    calComUrl: String,
    discordInvite: String,
    whatsappNumber: String,
  },
}, { timestamps: true })

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema)
