const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hamedprodev:@He00Ri%23Ga4Da@hamedprodev.aiwnhac.mongodb.net/hamedpro_dev?appName=HamedProDev'

async function seed() {
  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db('hamedpro_dev')
    console.log('Connected to MongoDB')

    // 1. Create admin user
    const hashedPassword = await bcrypt.hash('@He00Ri#Ga4Da', 12)
    const adminEmail = 'hamedpro.work@gmail.com'

    let adminUser = await db.collection('users').findOne({ email: adminEmail })
    if (!adminUser) {
      const result = await db.collection('users').insertOne({
        name: 'Hamed Hussein',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        bio: 'Senior Fullstack Developer from Kigali, Rwanda. Building modern web applications, mobile apps, and AI-powered solutions.',
        location: 'Kigali, Rwanda',
        skills: ['Next.js', 'TypeScript', 'React', 'Node.js', 'Python', 'MongoDB', 'AWS'],
        isActive: true,
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      adminUser = { _id: result.insertedId }
      console.log('✅ Admin user created:', adminEmail)
    } else {
      console.log('ℹ️  Admin user already exists:', adminEmail)
    }

    // 2. Create demo projects
    const projects = [
      { title: 'FarmConnect', slug: 'farmconnect', description: 'Digital marketplace connecting Rwandan farmers directly with buyers.', longDescription: 'A comprehensive platform that eliminates middlemen and connects farmers to urban markets.', category: 'large', subCategory: 'agriculture', coverImage: '/images/projects/farmconnect.jpg', techStack: ['Next.js', 'TypeScript', 'MongoDB', 'Tailwind CSS'], demoUrl: 'https://farmconnect.rw', status: 'live', featured: true, isPublished: true, isOpenSource: true, views: 342, likes: 56, createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Kwanda EMS', slug: 'kwanda-ems', description: 'Enterprise management system for Kwanda Facility operations.', longDescription: 'Full enterprise management solution handling inventory, HR, finance, and operations.', category: 'large', subCategory: 'other', coverImage: '/images/projects/kwanda.jpg', techStack: ['Next.js', 'Express', 'PostgreSQL', 'Docker'], status: 'live', featured: true, isPublished: true, isOpenSource: false, views: 218, likes: 34, createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'AI Health Assistant', slug: 'ai-health-assistant', description: 'ML-powered health screening tool for rural communities.', longDescription: 'Uses machine learning to provide preliminary health assessments in areas with limited medical access.', category: 'large', subCategory: 'healthcare', coverImage: '/images/projects/ai-health.jpg', techStack: ['Python', 'TensorFlow', 'React Native', 'FastAPI'], status: 'in-progress', featured: true, isPublished: true, isOpenSource: true, views: 189, likes: 42, createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'EduConnect Platform', slug: 'educonnect', description: 'Learning management system for schools across Rwanda.', longDescription: 'A modern LMS designed for Rwandan schools with offline-first capabilities.', category: 'large', subCategory: 'education', coverImage: '/images/projects/educonnect.jpg', techStack: ['React', 'Node.js', 'Supabase', 'Tailwind CSS'], status: 'live', featured: false, isPublished: true, isOpenSource: false, views: 156, likes: 28, createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'PaySmart Mobile', slug: 'paysmart-mobile', description: 'Mobile payment solution for small businesses in East Africa.', longDescription: 'Simplifies digital payments for SMEs across East Africa with M-Pesa integration.', category: 'mini', subCategory: 'finance', coverImage: '/images/projects/paysmart.jpg', techStack: ['React Native', 'Firebase', 'Stripe'], status: 'in-progress', featured: false, isPublished: true, isOpenSource: false, views: 98, likes: 15, createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'OpenDev CLI', slug: 'opendev-cli', description: 'Command-line tool for scaffolding fullstack projects.', longDescription: 'An opinionated CLI that generates fullstack project boilerplates with best practices.', category: 'mini', subCategory: 'other', coverImage: '/images/projects/opendev.jpg', techStack: ['Go', 'TypeScript', 'Docker'], status: 'live', featured: false, isPublished: true, isOpenSource: true, views: 234, likes: 67, createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
    ]

    const existingProjects = await db.collection('projects').countDocuments()
    if (existingProjects === 0) {
      await db.collection('projects').insertMany(projects)
      console.log('✅ Projects seeded:', projects.length)
    } else {
      console.log('ℹ️  Projects already exist, skipping')
    }

    // 3. Create demo courses
    const courses = [
      { title: 'React.js — From Zero to Hero', slug: 'reactjs-from-zero-to-hero', description: 'Build modern, responsive web apps with React, Hooks, Context API, and real-world projects.', longDescription: 'Complete React.js course covering everything from basics to advanced patterns.', category: 'Frontend', level: 'beginner', type: 'free', price: 0, duration: 8, enrolled: 245, rating: 4.9, featured: true, isPublished: true, certificate: true, tags: ['React', 'JavaScript', 'Frontend'], prerequisites: ['Basic JavaScript knowledge'], outcomes: ['Build React apps from scratch', 'Master Hooks and Context API'], coverImage: '/images/courses/react.jpg', createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Node.js & Express — Complete Guide', slug: 'nodejs-express-complete-guide', description: 'Learn backend development with Node.js, Express, MongoDB, authentication & more.', longDescription: 'Master backend development with Node.js ecosystem.', category: 'Backend', level: 'intermediate', type: 'premium', price: 59, duration: 10, enrolled: 178, rating: 4.8, featured: true, isPublished: true, certificate: true, tags: ['Node.js', 'Express', 'MongoDB'], prerequisites: ['Basic JavaScript'], outcomes: ['Build REST APIs', 'Implement authentication'], coverImage: '/images/courses/nodejs.jpg', createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'TypeScript — Master the Fundamentals', slug: 'typescript-master-fundamentals', description: 'Strongly type your JavaScript apps and scale your development career.', longDescription: 'Deep dive into TypeScript for JavaScript developers.', category: 'Frontend', level: 'beginner', type: 'free', price: 0, duration: 4, enrolled: 312, rating: 4.9, featured: false, isPublished: true, certificate: true, tags: ['TypeScript', 'JavaScript'], prerequisites: ['JavaScript basics'], outcomes: ['Write type-safe code', 'Use advanced types'], coverImage: '/images/courses/typescript.jpg', createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Python — For Developers', slug: 'python-for-developers', description: 'Learn Python programming for backend, automation, data analysis and AI.', longDescription: 'Practical Python course for developers coming from other languages.', category: 'Backend', level: 'beginner', type: 'free', price: 0, duration: 6, enrolled: 198, rating: 4.7, featured: false, isPublished: true, certificate: true, tags: ['Python', 'Backend'], prerequisites: ['Any programming experience'], outcomes: ['Write Python scripts', 'Build APIs with FastAPI'], coverImage: '/images/courses/python.jpg', createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Next.js 14 — The Complete Guide', slug: 'nextjs-14-complete-guide', description: 'Build production-ready apps with Next.js, App Router, SSR, and API routes.', longDescription: 'Master Next.js 14 with the App Router and server components.', category: 'Frontend', level: 'intermediate', type: 'premium', price: 59, duration: 7, enrolled: 156, rating: 4.8, featured: true, isPublished: true, certificate: true, tags: ['Next.js', 'React', 'SSR'], prerequisites: ['React basics'], outcomes: ['Build fullstack apps', 'Master App Router'], coverImage: '/images/courses/nextjs.jpg', createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Machine Learning A-Z', slug: 'machine-learning-az', description: 'From theory to deployment — learn ML models, training, and real projects.', longDescription: 'Comprehensive ML course from theory to production.', category: 'AI / ML', level: 'advanced', type: 'premium', price: 79, duration: 12, enrolled: 89, rating: 4.9, featured: false, isPublished: true, certificate: true, tags: ['Python', 'ML', 'TensorFlow'], prerequisites: ['Python basics', 'Math fundamentals'], outcomes: ['Build ML models', 'Deploy to production'], coverImage: '/images/courses/ml.jpg', createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Flutter & Dart — Build Mobile Apps', slug: 'flutter-dart-build-mobile-apps', description: 'Build beautiful cross-platform mobile applications for iOS & Android.', longDescription: 'Complete Flutter development course.', category: 'Mobile', level: 'intermediate', type: 'premium', price: 49, duration: 9, enrolled: 134, rating: 4.7, featured: false, isPublished: true, certificate: true, tags: ['Flutter', 'Dart', 'Mobile'], prerequisites: ['Any programming language'], outcomes: ['Build cross-platform apps', 'Deploy to app stores'], coverImage: '/images/courses/flutter.jpg', createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Docker & Kubernetes — Practical Guide', slug: 'docker-kubernetes-practical-guide', description: 'Containerization, orchestration and DevOps workflows for developers.', longDescription: 'Learn containerization and orchestration from scratch.', category: 'DevOps', level: 'intermediate', type: 'premium', price: 59, duration: 6, enrolled: 76, rating: 4.8, featured: false, isPublished: true, certificate: true, tags: ['Docker', 'Kubernetes', 'DevOps'], prerequisites: ['Basic Linux command line'], outcomes: ['Containerize apps', 'Orchestrate with K8s'], coverImage: '/images/courses/docker.jpg', createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Fullstack Project Bootcamp', slug: 'fullstack-project-bootcamp', description: 'Build a complete SaaS application from scratch using modern technologies.', longDescription: 'Hands-on bootcamp building a production SaaS app.', category: 'Frontend', level: 'advanced', type: 'premium', price: 99, duration: 15, enrolled: 67, rating: 4.9, featured: true, isPublished: true, certificate: true, tags: ['Next.js', 'TypeScript', 'Fullstack'], prerequisites: ['React', 'Node.js'], outcomes: ['Build SaaS apps', 'Deploy to production'], coverImage: '/images/courses/fullstack.jpg', createdBy: adminUser._id, createdAt: new Date(), updatedAt: new Date() },
    ]

    const existingCourses = await db.collection('courses').countDocuments()
    if (existingCourses === 0) {
      await db.collection('courses').insertMany(courses)
      console.log('✅ Courses seeded:', courses.length)
    } else {
      console.log('ℹ️  Courses already exist, skipping')
    }

    // 4. Create demo jobs
    const now = new Date()
    const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
    const jobs = [
      { title: 'Frontend Developer', company: 'TechStart Rwanda', location: 'Kigali, Rwanda', locationType: 'onsite', type: 'full-time', category: 'frontend', description: 'Join our team to build modern web applications using React and Next.js.', skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'], salaryMin: 800, salaryMax: 1500, salaryCurrency: 'USD', status: 'active', featured: true, isApproved: true, views: 234, applications: 18, postedBy: adminUser._id, deadline: threeMonthsLater, expiresAt: threeMonthsLater, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Fullstack Engineer', company: 'InnoHub Africa', location: 'Remote, Africa', locationType: 'remote', type: 'full-time', category: 'fullstack', description: 'Build end-to-end solutions for agricultural technology platforms.', skills: ['Next.js', 'Node.js', 'PostgreSQL', 'Docker'], salaryMin: 2000, salaryMax: 3500, salaryCurrency: 'USD', status: 'active', featured: true, isApproved: true, views: 189, applications: 24, postedBy: adminUser._id, deadline: threeMonthsLater, expiresAt: threeMonthsLater, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Mobile Developer', company: 'FarmConnect', location: 'Kigali, Rwanda', locationType: 'hybrid', type: 'full-time', category: 'mobile', description: 'Develop cross-platform mobile applications for our farmer marketplace.', skills: ['React Native', 'TypeScript', 'Firebase'], salaryMin: 600, salaryMax: 1200, salaryCurrency: 'USD', status: 'active', featured: false, isApproved: true, views: 156, applications: 12, postedBy: adminUser._id, deadline: threeMonthsLater, expiresAt: threeMonthsLater, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Backend Developer', company: 'NovaSoft Solutions', location: 'Remote, Global', locationType: 'remote', type: 'contract', category: 'backend', description: 'Build scalable backend services and APIs for enterprise clients.', skills: ['Python', 'Django', 'AWS', 'PostgreSQL'], salaryMin: 1500, salaryMax: 2800, salaryCurrency: 'USD', status: 'active', featured: false, isApproved: true, views: 198, applications: 15, postedBy: adminUser._id, deadline: threeMonthsLater, expiresAt: threeMonthsLater, createdAt: new Date(), updatedAt: new Date() },
      { title: 'DevOps Engineer', company: 'CloudRwanda', location: 'Kigali, Rwanda', locationType: 'onsite', type: 'full-time', category: 'devops', description: 'Manage cloud infrastructure and CI/CD pipelines for our growing platform.', skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'], salaryMin: 2500, salaryMax: 4000, salaryCurrency: 'USD', status: 'active', featured: false, isApproved: true, views: 112, applications: 8, postedBy: adminUser._id, deadline: threeMonthsLater, expiresAt: threeMonthsLater, createdAt: new Date(), updatedAt: new Date() },
      { title: 'AI/ML Engineer', company: 'DataKigali', location: 'Hybrid, Kigali', locationType: 'hybrid', type: 'full-time', category: 'ai-ml', description: 'Build and deploy machine learning models for healthcare applications.', skills: ['Python', 'TensorFlow', 'PyTorch', 'FastAPI'], salaryMin: 3000, salaryMax: 5000, salaryCurrency: 'USD', status: 'active', featured: true, isApproved: true, views: 167, applications: 11, postedBy: adminUser._id, deadline: threeMonthsLater, expiresAt: threeMonthsLater, createdAt: new Date(), updatedAt: new Date() },
    ]

    const existingJobs = await db.collection('jobs').countDocuments()
    if (existingJobs === 0) {
      await db.collection('jobs').insertMany(jobs)
      console.log('✅ Jobs seeded:', jobs.length)
    } else {
      console.log('ℹ️  Jobs already exist, skipping')
    }

    console.log('\n🎉 Seeding complete!')
    console.log('Login credentials:')
    console.log('  Email: hamedpro.work@gmail.com')
    console.log('  Password: @He00Ri#Ga4Da')
  } catch (error) {
    console.error('❌ Seeding error:', error)
  } finally {
    await client.close()
  }
}

seed()
