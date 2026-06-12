import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hamedpro_dev'

const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, default: 'visitor' }, isActive: { type: Boolean, default: true },
}, { timestamps: true })

const ProfileSchema = new mongoose.Schema({
  name: String, tagline: String, bio: String, avatar: String,
  location: { type: String, default: 'Kigali, Rwanda' },
  email: String, github: String, availability: { type: String, default: 'available' },
  skills: [{ category: String, items: [{ name: String, level: Number }] }],
  stats: { yearsExperience: Number, projectsCompleted: Number, happyClients: Number, githubStars: Number },
  services: [{ title: String, description: String, price: String, icon: String }],
  testimonials: [{ name: String, role: String, company: String, content: String, rating: Number, approved: Boolean }],
}, { timestamps: true })

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'HamedProDev' },
  tagline: { type: String, default: 'Fullstack & AI/ML Developer' },
  contactEmail: { type: String, default: 'hello@hamedpro.rw' },
  maintenanceMode: { type: Boolean, default: false },
  allowRegistration: { type: Boolean, default: true },
}, { timestamps: true })

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')

  const User = mongoose.models.User || mongoose.model('User', UserSchema)
  const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema)
  const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)

  const adminEmail = process.env.ADMIN_EMAIL || 'hamed@novasoft.rw'
  const existingAdmin = await User.findOne({ email: adminEmail })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 12)
    await User.create({
      name: 'Hamed Hussein', email: adminEmail, password: hashedPassword,
      role: 'admin', isActive: true,
    })
    console.log(`Admin user created: ${adminEmail}`)
  }

  const existingProfile = await Profile.findOne()
  if (!existingProfile) {
    await Profile.create({
      name: 'Hamed Hussein', tagline: 'Fullstack & AI/ML Engineer',
      bio: 'Passionate fullstack developer building innovative solutions from Kigali, Rwanda.',
      email: adminEmail, github: 'https://github.com/hamedProDev',
      location: 'Kigali, Rwanda', availability: 'available',
      skills: [
        { category: 'Frontend', items: [{ name: 'React', level: 95 }, { name: 'Next.js', level: 90 }, { name: 'TypeScript', level: 88 }] },
        { category: 'Backend', items: [{ name: 'Node.js', level: 90 }, { name: 'Python', level: 85 }, { name: 'PHP', level: 80 }] },
        { category: 'AI/ML', items: [{ name: 'TensorFlow', level: 75 }, { name: 'PyTorch', level: 70 }] },
      ],
      stats: { yearsExperience: 5, projectsCompleted: 30, happyClients: 20, githubStars: 150 },
      services: [
        { title: 'Web Development', description: 'Full-stack web applications with modern tech stacks', price: 'From $500', icon: 'Globe' },
        { title: 'Mobile Development', description: 'Cross-platform mobile apps with React Native / Kotlin', price: 'From $800', icon: 'Smartphone' },
        { title: 'AI/ML Solutions', description: 'Custom AI models and data pipelines', price: 'From $1000', icon: 'Brain' },
      ],
      testimonials: [],
    })
    console.log('Profile created')
  }

  const existingSettings = await Settings.findOne()
  if (!existingSettings) {
    await Settings.create({})
    console.log('Site settings created')
  }

  console.log('Seed complete!')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
