import { NextResponse } from 'next/server'
import { createDocument, countDocuments } from '@/lib/supabase/db'

const AUTH_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`

async function authFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${AUTH_URL}${path}`, {
    ...options,
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

export async function POST() {
  try {
    const results: string[] = []

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: false, error: 'Missing Supabase env vars.' }, { status: 500 })
    }

    const adminEmail = 'hamussein01@gmail.com'
    let adminUser: any = null

    const usersData = await authFetch('/admin/users')
    const found = usersData?.users?.find((u: any) => u.email === adminEmail)
    if (found) {
      adminUser = found
      // Ensure profile exists for existing user
      try {
        await createDocument('profiles', { id: found.id, email: adminEmail, name: 'Hamed Hussein', role: 'admin', avatar_url: '' })
        results.push('Admin user exists, profile created')
      } catch {
        results.push('Admin user exists, profile already exists')
      }
    } else {
      adminUser = await authFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          email: adminEmail,
          password: '@He00Ri#Ga4Da',
          email_confirm: true,
          user_metadata: { display_name: 'Hamed Hussein' },
          app_metadata: { role: 'admin' },
        }),
      })
      adminUser = adminUser.user ?? adminUser
      // Create profile for the new user
      await createDocument('profiles', { id: adminUser.id, email: adminEmail, name: 'Hamed Hussein', role: 'admin', avatar_url: '' }).catch(() => {})
      results.push('Admin user created')
    }

    const projectCount = await countDocuments('projects')
    if (projectCount === 0) {
      const projects = [
        { title: 'FarmConnect', slug: 'farmconnect', description: 'Digital marketplace connecting Rwandan farmers directly with buyers.', content: 'A comprehensive platform eliminating middlemen.', category: 'agriculture', tags: ['agriculture', 'marketplace'], tech_stack: ['Next.js', 'TypeScript', 'MongoDB'], image_url: '', demo_url: 'https://farmconnect.rw', featured: true, is_published: true, order_index: 1 },
        { title: 'Kwanda EMS', slug: 'kwanda-ems', description: 'Enterprise management system for Kwanda Facility operations.', content: 'Full enterprise management solution.', category: 'enterprise', tech_stack: ['Next.js', 'Express', 'PostgreSQL'], image_url: '', featured: true, is_published: true, order_index: 2 },
        { title: 'AI Health Assistant', slug: 'ai-health-assistant', description: 'ML-powered health screening tool for rural communities.', content: 'Uses ML for health assessments.', category: 'healthcare', tags: ['healthcare', 'AI'], tech_stack: ['Python', 'TensorFlow', 'React Native'], image_url: '', featured: true, is_published: true, order_index: 3 },
        { title: 'EduConnect Platform', slug: 'educonnect', description: 'Learning management system for schools across Rwanda.', content: 'Modern LMS for Rwandan schools.', category: 'education', tech_stack: ['React', 'Node.js', 'Supabase'], image_url: '', featured: false, is_published: true, order_index: 4 },
        { title: 'PaySmart Mobile', slug: 'paysmart-mobile', description: 'Mobile payment solution for small businesses in East Africa.', content: 'Digital payments for SMEs.', category: 'finance', tech_stack: ['React Native', 'Firebase'], image_url: '', featured: false, is_published: true, order_index: 5 },
        { title: 'OpenDev CLI', slug: 'opendev-cli', description: 'Command-line tool for scaffolding fullstack projects.', content: 'CLI for project scaffolding.', category: 'tools', tags: ['cli', 'developer-tools'], tech_stack: ['Go', 'TypeScript', 'Docker'], image_url: '', featured: false, is_published: true, order_index: 6 },
      ]
      await Promise.all(projects.map(p => createDocument('projects', p)))
      results.push('6 projects seeded')
    } else {
      results.push(`${projectCount} projects exist`)
    }

    const courseCount = await countDocuments('courses')
    if (courseCount === 0) {
      const courses = [
        { title: 'React.js — From Zero to Hero', slug: 'reactjs-from-zero-to-hero', description: 'Build modern, reactive web applications from scratch. Learn components, hooks, state management, routing, and real-world project patterns.', content: '## What You\'ll Learn\n\n- JSX and component architecture\n- useState, useEffect, useRef, useContext\n- React Router v6\n- Fetching data and handling loading states\n- Building a complete project from scratch\n\n## Who This Is For\n\nBeginners who want to master React for modern web development.', category: 'Frontend', level: 'beginner', price: 'Free', duration: '8 weeks', image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop', featured: true, is_published: true, order_index: 1 },
        { title: 'Node.js & Express — Complete Backend Guide', slug: 'nodejs-express-complete-guide', description: 'Master backend development with Node.js, Express, REST APIs, authentication, file uploads, and deployment.', content: '## What You\'ll Learn\n\n- Express.js routing and middleware\n- Building RESTful APIs\n- JWT authentication and authorization\n- File uploads with Multer\n- Database integration with MongoDB\n- Deploying to production\n\n## Who This Is For\n\nDevelopers who want to build scalable backend services.', category: 'Backend', level: 'intermediate', price: '$59', duration: '10 weeks', image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop', featured: true, is_published: true, order_index: 2 },
        { title: 'TypeScript — Master the Fundamentals', slug: 'typescript-master-fundamentals', description: 'Write safer, more maintainable JavaScript with TypeScript. Learn types, generics, interfaces, and advanced patterns.', content: '## What You\'ll Learn\n\n- Type system fundamentals\n- Interfaces, types, and generics\n- Utility types and mapped types\n- TypeScript with React and Node.js\n- Configuring tsconfig\n\n## Who This Is For\n\nJavaScript developers who want to level up with TypeScript.', category: 'Frontend', level: 'beginner', price: 'Free', duration: '4 weeks', image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop', featured: false, is_published: true, order_index: 3 },
        { title: 'Python — For Developers & AI Engineers', slug: 'python-for-developers-ai', description: 'Learn Python from scratch with a focus on automation, data processing, and AI/ML foundations.', content: '## What You\'ll Learn\n\n- Python syntax and data structures\n- Object-oriented programming\n- File handling and automation\n- Working with APIs\n- Introduction to NumPy and Pandas\n- Setting up ML environments\n\n## Who This Is For\n\nDevelopers transitioning to Python or starting with AI/ML.', category: 'Backend', level: 'beginner', price: 'Free', duration: '6 weeks', image_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop', featured: false, is_published: true, order_index: 4 },
        { title: 'Next.js 14 — The Complete Production Guide', slug: 'nextjs-14-complete-production-guide', description: 'Build and deploy production-ready applications with Next.js 14 App Router, Server Components, and Server Actions.', content: '## What You\'ll Learn\n\n- App Router and file-based routing\n- React Server Components\n- Server Actions and forms\n- API routes and middleware\n- Authentication patterns\n- Deployment on Vercel\n\n## Who This Is For\n\nReact developers ready to build production apps.', category: 'Frontend', level: 'intermediate', price: '$59', duration: '7 weeks', image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', featured: true, is_published: true, order_index: 5 },
        { title: 'Machine Learning A-Z — From Theory to Production', slug: 'machine-learning-az-production', description: 'Comprehensive ML course covering regression, classification, clustering, neural networks, and deploying models to production.', content: '## What You\'ll Learn\n\n- Supervised and unsupervised learning\n- Data preprocessing and feature engineering\n- Model evaluation and tuning\n- Neural networks with TensorFlow/Keras\n- Deploying ML models with FastAPI\n- Computer vision basics\n\n## Who This Is For\n\nDevelopers and data enthusiasts who want practical ML skills.', category: 'AI / ML', level: 'advanced', price: '$79', duration: '12 weeks', image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop', featured: false, is_published: true, order_index: 6 },
        { title: 'Flutter & Dart — Build Cross-Platform Apps', slug: 'flutter-dart-cross-platform', description: 'Build beautiful, natively compiled mobile apps for iOS and Android from a single codebase.', content: '## What You\'ll Learn\n\n- Dart language fundamentals\n- Flutter widgets and layouts\n- State management with Provider and Riverpod\n- Navigation and routing\n- HTTP requests and APIs\n- Publishing to App Store and Play Store\n\n## Who This Is For\n\nDevelopers who want to build mobile apps efficiently.', category: 'Mobile', level: 'intermediate', price: '$49', duration: '9 weeks', image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop', featured: false, is_published: true, order_index: 7 },
        { title: 'Docker & Kubernetes — Practical DevOps Guide', slug: 'docker-kubernetes-practical-devops', description: 'Learn containerization, orchestration, CI/CD pipelines, and modern DevOps practices.', content: '## What You\'ll Learn\n\n- Docker fundamentals and Dockerfile\n- Docker Compose for multi-container apps\n- Kubernetes architecture and concepts\n- Deploying apps to Kubernetes\n- CI/CD with GitHub Actions\n- Monitoring and logging\n\n## Who This Is For\n\nDevelopers and DevOps engineers looking to master containers.', category: 'DevOps', level: 'intermediate', price: '$59', duration: '6 weeks', image_url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop', featured: false, is_published: true, order_index: 8 },
        { title: 'Fullstack SaaS Bootcamp — Build & Launch', slug: 'fullstack-saas-bootcamp', description: 'Build a complete SaaS application from scratch with authentication, payments, dashboard, and admin panel.', content: '## What You\'ll Learn\n\n- Planning and architecting a SaaS app\n- User authentication and roles\n- Stripe payment integration\n- Building admin dashboards\n- Multi-tenancy patterns\n- Deploying and scaling\n\n## Who This Is For\n\nDevelopers who want to build and launch their own SaaS product.', category: 'Frontend', level: 'advanced', price: '$99', duration: '15 weeks', image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop', featured: true, is_published: true, order_index: 9 },
        { title: 'Game Development with JavaScript — Build 2D Games', slug: 'game-dev-javascript-2d', description: 'Create fun, interactive 2D games using JavaScript, Canvas API, and Phaser.js framework.', content: '## What You\'ll Learn\n\n- Canvas API and rendering\n- Game loops and physics\n- Sprite sheets and animations\n- Collision detection\n- Sound effects and scoring\n- Building a complete platformer game\n\n## Who This Is For\n\nDevelopers who want to get into game development with web technologies.', category: 'Frontend', level: 'beginner', price: 'Free', duration: '6 weeks', image_url: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&h=400&fit=crop', featured: false, is_published: true, order_index: 10 },
        { title: 'AI Chatbot Builder — LangChain & OpenAI', slug: 'ai-chatbot-builder-langchain', description: 'Build intelligent chatbots and AI agents using LangChain, OpenAI, and vector databases.', content: '## What You\'ll Learn\n\n- Prompt engineering basics\n- LangChain framework and chains\n- Vector databases and embeddings\n- RAG (Retrieval-Augmented Generation)\n- Building conversational agents\n- Deploying AI apps to production\n\n## Who This Is For\n\nDevelopers who want to build AI-powered applications.', category: 'AI / ML', level: 'intermediate', price: '$69', duration: '8 weeks', image_url: 'https://images.unsplash.com/photo-1684163761883-8cba5e0d8154?w=800&h=400&fit=crop', featured: true, is_published: true, order_index: 11 },
        { title: 'React Native — Build Mobile Apps for iOS & Android', slug: 'react-native-mobile-apps', description: 'Build real-world mobile applications with React Native, Expo, and native device features.', content: '## What You\'ll Learn\n\n- React Native components and navigation\n- Working with native APIs (camera, GPS, storage)\n- State management with Redux Toolkit\n- Push notifications\n- Offline-first patterns\n- Publishing to app stores\n\n## Who This Is For\n\nReact developers who want to build mobile apps.', category: 'Mobile', level: 'intermediate', price: '$49', duration: '10 weeks', image_url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&h=400&fit=crop', featured: false, is_published: true, order_index: 12 },
      ]
      await Promise.all(courses.map(c => createDocument('courses', c)))
      results.push('12 courses seeded')
    } else {
      results.push(`${courseCount} courses exist`)
    }

    const settingsCount = await countDocuments('settings')
    if (settingsCount === 0) {
      await createDocument('settings', {
        site_name: 'HamedProDev',
        tagline: 'Fullstack & AI/ML Developer',
        description: 'I build modern web applications, mobile apps, and AI-powered solutions. Passionate about creating technology that makes a difference in Africa and beyond.',
        hero_name: 'Hamed Hussein',
        hero_title: 'Full Stack Developer & AI Engineer',
        hero_subtitle: 'Building scalable solutions that make an impact.',
        location: 'Kigali, Rwanda',
        contact_email: 'hamedpro.work@gmail.com',
        contact_phone: '+250 788 123 456',
        address: 'Kwanda Facility, Kigali',
        social_links: {
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
          whatsapp_number: '+250788123456',
        },
      })
      results.push('Site settings created')
    } else {
      results.push('Site settings exist')
    }

    const skillCount = await countDocuments('skills')
    if (skillCount === 0) {
      const skills = [
        { name: 'Next.js', category: 'Frontend', proficiency: 95, order_index: 1, is_published: true },
        { name: 'React', category: 'Frontend', proficiency: 95, order_index: 2, is_published: true },
        { name: 'TypeScript', category: 'Frontend', proficiency: 90, order_index: 3, is_published: true },
        { name: 'Tailwind CSS', category: 'Frontend', proficiency: 92, order_index: 4, is_published: true },
        { name: 'HTML/CSS', category: 'Frontend', proficiency: 98, order_index: 5, is_published: true },
        { name: 'Node.js', category: 'Backend', proficiency: 88, order_index: 6, is_published: true },
        { name: 'Python', category: 'Backend', proficiency: 85, order_index: 7, is_published: true },
        { name: 'Express.js', category: 'Backend', proficiency: 87, order_index: 8, is_published: true },
        { name: 'MongoDB', category: 'Database', proficiency: 85, order_index: 9, is_published: true },
        { name: 'PostgreSQL', category: 'Database', proficiency: 80, order_index: 10, is_published: true },
        { name: 'Firebase', category: 'Database', proficiency: 78, order_index: 11, is_published: true },
        { name: 'Docker', category: 'DevOps', proficiency: 82, order_index: 12, is_published: true },
        { name: 'AWS', category: 'DevOps', proficiency: 75, order_index: 13, is_published: true },
        { name: 'Git', category: 'Tools', proficiency: 92, order_index: 14, is_published: true },
        { name: 'Figma', category: 'Tools', proficiency: 70, order_index: 15, is_published: true },
        { name: 'React Native', category: 'Mobile', proficiency: 80, order_index: 16, is_published: true },
        { name: 'Flutter', category: 'Mobile', proficiency: 72, order_index: 17, is_published: true },
        { name: 'TensorFlow', category: 'AI/ML', proficiency: 70, order_index: 18, is_published: true },
      ]
      await Promise.all(skills.map(s => createDocument('skills', s)))
      results.push('18 skills seeded')
    } else {
      results.push(`${skillCount} skills exist`)
    }

    const achievementCount = await countDocuments('achievements')
    if (achievementCount === 0) {
      const achievements = [
        { title: 'AWS Certified Cloud Practitioner', description: 'Earned AWS Cloud Practitioner certification demonstrating cloud computing knowledge.', date: '2024-06-01', category: 'certification', order_index: 1, is_published: true },
        { title: 'Best Innovation Award — Rwanda Tech Summit', description: 'Won first place for FarmConnect platform at the annual Rwanda Technology Summit.', date: '2024-03-15', category: 'award', order_index: 2, is_published: true },
        { title: '100+ GitHub Stars on OpenDev CLI', description: 'Open-source CLI tool reached 100+ stars on GitHub, used by 500+ developers.', date: '2024-01-01', category: 'milestone', order_index: 3, is_published: true },
        { title: 'FarmConnect — 5000+ Farmers Onboarded', description: 'Digital marketplace platform reached milestone of 5000+ active farmers.', date: '2023-11-01', category: 'milestone', order_index: 4, is_published: true },
        { title: 'Google Developer Student Club Lead', description: 'Led GDSC at university, organizing workshops and hackathons for 200+ students.', date: '2023-09-01', category: 'milestone', order_index: 5, is_published: true },
        { title: 'MongoDB Associate Developer Certification', description: 'Certified MongoDB developer, proficient in database design and aggregation.', date: '2023-06-01', category: 'certification', order_index: 6, is_published: true },
        { title: 'Published Research — AI in Healthcare', description: 'Co-authored paper on ML-based health screening deployed in rural clinics.', date: '2023-03-01', category: 'publication', order_index: 7, is_published: true },
        { title: 'Hackathon Winner — Africa Code Week', description: 'First place at Africa Code Week hackathon for EduConnect platform.', date: '2022-12-01', category: 'award', order_index: 8, is_published: true },
      ]
      await Promise.all(achievements.map(a => createDocument('achievements', a)))
      results.push('8 achievements seeded')
    } else {
      results.push(`${achievementCount} achievements exist`)
    }

    const siteStatsCount = await countDocuments('site_stats')
    if (siteStatsCount === 0) {
      const stats = [
        { label: 'Projects Completed', value: '30', icon: 'FolderOpen', order_index: 1, is_published: true },
        { label: 'GitHub Stars', value: '150', icon: 'Star', order_index: 2, is_published: true },
        { label: 'Courses Created', value: '10', icon: 'BookOpen', order_index: 3, is_published: true },
        { label: 'Years Experience', value: '5', icon: 'Calendar', order_index: 4, is_published: true },
        { label: 'Client Satisfaction', value: '100%', icon: 'ThumbsUp', order_index: 5, is_published: true },
      ]
      await Promise.all(stats.map(s => createDocument('site_stats', s)))
      results.push('5 site stats seeded')
    } else {
      results.push(`${siteStatsCount} site stats exist`)
    }

    const testimonialCount = await countDocuments('testimonials')
    if (testimonialCount === 0) {
      const testimonials = [
        { name: 'Jean Claude', role: 'CTO', company: 'AgriTech Rwanda', content: 'Hamed delivered exceptional work on our FarmConnect platform. His fullstack skills and attention to detail are outstanding. Great communication throughout the project.', rating: 5, order_index: 1, is_published: true },
        { name: 'Sarah Uwase', role: 'CEO', company: 'Kwanda Facility', content: 'Hamed transformed our business operations with the Kwanda EMS system. His ability to understand complex requirements and deliver elegant solutions is remarkable.', rating: 5, order_index: 2, is_published: true },
        { name: 'David N.', role: 'Founder', company: 'HealthPlus', content: 'Working with Hamed was a pleasure. His technical expertise in AI/ML and fullstack development helped us build a health screening tool that reaches thousands.', rating: 5, order_index: 3, is_published: true },
      ]
      await Promise.all(testimonials.map(t => createDocument('testimonials', t)))
      results.push('3 testimonials seeded')
    } else {
      results.push(`${testimonialCount} testimonials exist`)
    }

    return NextResponse.json({ success: true, data: { results, loginUrl: '/login', credentials: { email: adminEmail, password: '@He00Ri#Ga4Da' } } })
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : JSON.stringify(error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
