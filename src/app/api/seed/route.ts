import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { Project } from '@/lib/db/models/Project'
import { Course } from '@/lib/db/models/Course'
import { Job } from '@/lib/db/models/Job'
import { SiteSettings } from '@/lib/db/models/SiteSettings'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    await connectDB()
    const results: string[] = []

    // 1. Admin user
    const adminEmail = 'hamedpro.work@gmail.com'
    let adminUser = await User.findOne({ email: adminEmail })
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('@He00Ri#Ga4Da', 12)
      adminUser = await User.create({
        name: 'Hamed Hussein',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        bio: 'Senior Fullstack Developer from Kigali, Rwanda.',
        location: 'Kigali, Rwanda',
        skills: ['Next.js', 'TypeScript', 'React', 'Node.js', 'Python', 'MongoDB', 'AWS'],
        emailVerified: new Date(),
      })
      results.push('Admin user created')
    } else {
      results.push('Admin user exists')
    }

    // 2. Projects
    const projectCount = await Project.countDocuments()
    if (projectCount === 0) {
      await Project.insertMany([
        { title: 'FarmConnect', slug: 'farmconnect', description: 'Digital marketplace connecting Rwandan farmers directly with buyers.', longDescription: 'A comprehensive platform eliminating middlemen.', category: 'large', subCategory: 'agriculture', coverImage: '/images/projects/farmconnect.jpg', techStack: ['Next.js', 'TypeScript', 'MongoDB'], demoUrl: 'https://farmconnect.rw', status: 'live', featured: true, isPublished: true, isOpenSource: true, views: 342, likes: 56, createdBy: adminUser._id },
        { title: 'Kwanda EMS', slug: 'kwanda-ems', description: 'Enterprise management system for Kwanda Facility operations.', longDescription: 'Full enterprise management solution.', category: 'large', subCategory: 'other', coverImage: '/images/projects/kwanda.jpg', techStack: ['Next.js', 'Express', 'PostgreSQL'], status: 'live', featured: true, isPublished: true, isOpenSource: false, views: 218, likes: 34, createdBy: adminUser._id },
        { title: 'AI Health Assistant', slug: 'ai-health-assistant', description: 'ML-powered health screening tool for rural communities.', longDescription: 'Uses ML for health assessments.', category: 'large', subCategory: 'healthcare', coverImage: '/images/projects/ai-health.jpg', techStack: ['Python', 'TensorFlow', 'React Native'], status: 'in-progress', featured: true, isPublished: true, isOpenSource: true, views: 189, likes: 42, createdBy: adminUser._id },
        { title: 'EduConnect Platform', slug: 'educonnect', description: 'Learning management system for schools across Rwanda.', longDescription: 'Modern LMS for Rwandan schools.', category: 'large', subCategory: 'education', coverImage: '/images/projects/educonnect.jpg', techStack: ['React', 'Node.js', 'Supabase'], status: 'live', featured: false, isPublished: true, isOpenSource: false, views: 156, likes: 28, createdBy: adminUser._id },
        { title: 'PaySmart Mobile', slug: 'paysmart-mobile', description: 'Mobile payment solution for small businesses in East Africa.', longDescription: 'Digital payments for SMEs.', category: 'mini', subCategory: 'finance', coverImage: '/images/projects/paysmart.jpg', techStack: ['React Native', 'Firebase'], status: 'in-progress', featured: false, isPublished: true, isOpenSource: false, views: 98, likes: 15, createdBy: adminUser._id },
        { title: 'OpenDev CLI', slug: 'opendev-cli', description: 'Command-line tool for scaffolding fullstack projects.', longDescription: 'CLI for project scaffolding.', category: 'mini', subCategory: 'other', coverImage: '/images/projects/opendev.jpg', techStack: ['Go', 'TypeScript', 'Docker'], status: 'live', featured: false, isPublished: true, isOpenSource: true, views: 234, likes: 67, createdBy: adminUser._id },
      ])
      results.push('6 projects seeded')
    } else {
      results.push(`${projectCount} projects exist`)
    }

    // 3. Courses
    const courseCount = await Course.countDocuments()
    if (courseCount === 0) {
      await Course.insertMany([
        { title: 'React.js — From Zero to Hero', slug: 'reactjs-from-zero-to-hero', description: 'Build modern web apps with React, Hooks, Context API.', longDescription: 'Complete React course.', category: 'Frontend', level: 'beginner', type: 'free', price: 0, duration: 8, enrolled: 245, rating: 4.9, featured: true, isPublished: true, certificate: true, tags: ['React', 'JavaScript'], coverImage: '/images/courses/react.jpg', createdBy: adminUser._id },
        { title: 'Node.js & Express — Complete Guide', slug: 'nodejs-express-complete-guide', description: 'Learn backend development with Node.js and Express.', longDescription: 'Master Node.js backend.', category: 'Backend', level: 'intermediate', type: 'premium', price: 59, duration: 10, enrolled: 178, rating: 4.8, featured: true, isPublished: true, certificate: true, tags: ['Node.js', 'Express'], coverImage: '/images/courses/nodejs.jpg', createdBy: adminUser._id },
        { title: 'TypeScript — Master the Fundamentals', slug: 'typescript-master-fundamentals', description: 'Strongly type your JavaScript apps.', longDescription: 'Deep TypeScript dive.', category: 'Frontend', level: 'beginner', type: 'free', price: 0, duration: 4, enrolled: 312, rating: 4.9, featured: false, isPublished: true, certificate: true, tags: ['TypeScript'], coverImage: '/images/courses/typescript.jpg', createdBy: adminUser._id },
        { title: 'Python — For Developers', slug: 'python-for-developers', description: 'Learn Python for backend, automation, and AI.', longDescription: 'Practical Python course.', category: 'Backend', level: 'beginner', type: 'free', price: 0, duration: 6, enrolled: 198, rating: 4.7, featured: false, isPublished: true, certificate: true, tags: ['Python'], coverImage: '/images/courses/python.jpg', createdBy: adminUser._id },
        { title: 'Next.js 14 — The Complete Guide', slug: 'nextjs-14-complete-guide', description: 'Build production-ready apps with Next.js 14.', longDescription: 'Master Next.js 14.', category: 'Frontend', level: 'intermediate', type: 'premium', price: 59, duration: 7, enrolled: 156, rating: 4.8, featured: true, isPublished: true, certificate: true, tags: ['Next.js', 'React'], coverImage: '/images/courses/nextjs.jpg', createdBy: adminUser._id },
        { title: 'Machine Learning A-Z', slug: 'machine-learning-az', description: 'From theory to deployment — learn ML models.', longDescription: 'Comprehensive ML course.', category: 'AI / ML', level: 'advanced', type: 'premium', price: 79, duration: 12, enrolled: 89, rating: 4.9, featured: false, isPublished: true, certificate: true, tags: ['Python', 'ML'], coverImage: '/images/courses/ml.jpg', createdBy: adminUser._id },
        { title: 'Flutter & Dart — Build Mobile Apps', slug: 'flutter-dart-build-mobile-apps', description: 'Build cross-platform mobile apps.', longDescription: 'Complete Flutter course.', category: 'Mobile', level: 'intermediate', type: 'premium', price: 49, duration: 9, enrolled: 134, rating: 4.7, featured: false, isPublished: true, certificate: true, tags: ['Flutter', 'Dart'], coverImage: '/images/courses/flutter.jpg', createdBy: adminUser._id },
        { title: 'Docker & Kubernetes — Practical Guide', slug: 'docker-kubernetes-practical-guide', description: 'Containerization and orchestration for developers.', longDescription: 'Docker and K8s course.', category: 'DevOps', level: 'intermediate', type: 'premium', price: 59, duration: 6, enrolled: 76, rating: 4.8, featured: false, isPublished: true, certificate: true, tags: ['Docker', 'Kubernetes'], coverImage: '/images/courses/docker.jpg', createdBy: adminUser._id },
        { title: 'Fullstack Project Bootcamp', slug: 'fullstack-project-bootcamp', description: 'Build a complete SaaS application from scratch.', longDescription: 'Hands-on SaaS bootcamp.', category: 'Frontend', level: 'advanced', type: 'premium', price: 99, duration: 15, enrolled: 67, rating: 4.9, featured: true, isPublished: true, certificate: true, tags: ['Fullstack', 'SaaS'], coverImage: '/images/courses/fullstack.jpg', createdBy: adminUser._id },
      ])
      results.push('9 courses seeded')
    } else {
      results.push(`${courseCount} courses exist`)
    }

    // 4. Jobs
    const jobCount = await Job.countDocuments()
    if (jobCount === 0) {
      const now = new Date()
      const deadline = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
      await Job.insertMany([
        { title: 'Frontend Developer', company: 'TechStart Rwanda', location: 'Kigali, Rwanda', locationType: 'onsite', type: 'full-time', category: 'frontend', description: 'Build modern web applications using React and Next.js.', skills: ['React', 'TypeScript', 'Tailwind CSS'], salaryMin: 800, salaryMax: 1500, status: 'active', featured: true, isApproved: true, views: 234, applications: 18, postedBy: adminUser._id, deadline, expiresAt: deadline },
        { title: 'Fullstack Engineer', company: 'InnoHub Africa', location: 'Remote, Africa', locationType: 'remote', type: 'full-time', category: 'fullstack', description: 'Build end-to-end solutions for agritech platforms.', skills: ['Next.js', 'Node.js', 'PostgreSQL'], salaryMin: 2000, salaryMax: 3500, status: 'active', featured: true, isApproved: true, views: 189, applications: 24, postedBy: adminUser._id, deadline, expiresAt: deadline },
        { title: 'Mobile Developer', company: 'FarmConnect', location: 'Kigali, Rwanda', locationType: 'hybrid', type: 'full-time', category: 'mobile', description: 'Develop cross-platform mobile apps.', skills: ['React Native', 'TypeScript', 'Firebase'], salaryMin: 600, salaryMax: 1200, status: 'active', featured: false, isApproved: true, views: 156, applications: 12, postedBy: adminUser._id, deadline, expiresAt: deadline },
        { title: 'Backend Developer', company: 'NovaSoft Solutions', location: 'Remote, Global', locationType: 'remote', type: 'contract', category: 'backend', description: 'Build scalable backend services and APIs.', skills: ['Python', 'Django', 'AWS'], salaryMin: 1500, salaryMax: 2800, status: 'active', featured: false, isApproved: true, views: 198, applications: 15, postedBy: adminUser._id, deadline, expiresAt: deadline },
        { title: 'DevOps Engineer', company: 'CloudRwanda', location: 'Kigali, Rwanda', locationType: 'onsite', type: 'full-time', category: 'devops', description: 'Manage cloud infrastructure and CI/CD pipelines.', skills: ['Docker', 'Kubernetes', 'AWS'], salaryMin: 2500, salaryMax: 4000, status: 'active', featured: false, isApproved: true, views: 112, applications: 8, postedBy: adminUser._id, deadline, expiresAt: deadline },
        { title: 'AI/ML Engineer', company: 'DataKigali', location: 'Hybrid, Kigali', locationType: 'hybrid', type: 'full-time', category: 'ai-ml', description: 'Build and deploy ML models for healthcare.', skills: ['Python', 'TensorFlow', 'PyTorch'], salaryMin: 3000, salaryMax: 5000, status: 'active', featured: true, isApproved: true, views: 167, applications: 11, postedBy: adminUser._id, deadline, expiresAt: deadline },
      ])
      results.push('6 jobs seeded')
    } else {
      results.push(`${jobCount} jobs exist`)
    }

    // 5. Site Settings
    const settingsCount = await SiteSettings.countDocuments()
    if (settingsCount === 0) {
      await SiteSettings.create({
        siteName: 'HamedProDev',
        tagline: 'Fullstack & AI/ML Developer',
        description: 'I build modern web applications, mobile apps, and AI-powered solutions. Passionate about creating technology that makes a difference in Africa and beyond.',
        heroName: 'Hamed Hussein',
        heroTitle: 'Full Stack Developer & AI Engineer',
        heroSubtitle: 'Building scalable solutions that make an impact.',
        location: 'Kigali, Rwanda',
        contactEmail: 'hamedpro.work@gmail.com',
        contactPhone: '+250 788 123 456',
        address: 'Kwanda Facility, Kigali',
        socialLinks: {
          github: 'https://github.com/HamedProDev',
          linkedin: 'https://linkedin.com/in/hamedprodev',
          twitter: 'https://twitter.com/hamedprodev',
          youtube: 'https://youtube.com/@hamedprodev',
          instagram: 'https://instagram.com/hamedprodev',
          whatsapp: 'https://wa.me/250788123456',
          facebook: '',
          discord: '',
          telegram: '',
          tiktok: '',
        },
        integrations: {
          cloudinaryCloudName: '',
          whatsappNumber: '+250788123456',
        },
      })
      results.push('Site settings created')
    } else {
      results.push('Site settings exist')
    }

    return NextResponse.json({ success: true, data: { results, loginUrl: '/login', credentials: { email: adminEmail, password: '@He00Ri#Ga4Da' } } })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
