import mongoose from 'mongoose'

export interface IOrganization {
  name: string
  type: string
  description: string
  location: string
  team: string
  roles: number
  tech: string[]
  hiring: boolean
  website?: string
  logo?: string
  order: number
  featured: boolean
}

const OrganizationSchema = new mongoose.Schema<IOrganization>({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Startup', 'Agency', 'Company', 'Open Source'] },
  description: { type: String, required: true },
  location: { type: String, default: '' },
  team: { type: String, default: '' },
  roles: { type: Number, default: 0 },
  tech: [{ type: String }],
  hiring: { type: Boolean, default: false },
  website: { type: String, default: '' },
  logo: { type: String, default: '' },
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema)
