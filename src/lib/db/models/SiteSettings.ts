import mongoose, { Document, Schema } from 'mongoose'

export interface ISiteSettings extends Document {
  siteName: string
  tagline: string
  description: string
  keywords: string[]
  logo: string
  favicon: string
  ogImage: string
  googleAnalyticsId?: string
  googleSearchConsoleId?: string
  socialLinks: { github?: string; linkedin?: string; twitter?: string; youtube?: string; instagram?: string; discord?: string }
  contactEmail: string
  contactPhone?: string
  address?: string
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
  googleAnalyticsId: String,
  googleSearchConsoleId: String,
  socialLinks: {
    github: String, linkedin: String, twitter: String,
    youtube: String, instagram: String, discord: String,
  },
  contactEmail: { type: String, default: 'hello@hamedpro.rw' },
  contactPhone: String,
  address: String,
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
