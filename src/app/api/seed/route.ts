import { NextResponse } from 'next/server'
import { createDocument, countDocuments } from '@/lib/supabase/db'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const results: string[] = []

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: false, error: 'Missing Supabase env vars — add them to Vercel first.' }, { status: 500 })
    }

    const supabase = createServiceClient()

    const adminEmail = 'hamussein01@gmail.com'
    let adminUser: any = null
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const found = existingUsers?.users?.find(u => u.email === adminEmail)
    if (found) {
      adminUser = found
      results.push('Admin user exists')
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: '@He00Ri#Ga4Da',
        email_confirm: true,
        user_metadata: { display_name: 'Hamed Hussein' },
      })
      if (error || !data?.user) {
        throw new Error(error?.message || 'Failed to create admin user')
      }
      adminUser = data.user

      const { error: updateError } = await supabase.auth.admin.updateUserById(adminUser.id, {
        app_metadata: { role: 'admin' },
      })
      if (updateError) throw new Error(updateError.message)
      results.push('Admin user created')
    }

    const projectCount = await countDocuments('projects')
    if (projectCount === 0) {
      const projects = [
        { title: 'FarmConnect', slug: 'farmconnect', description: 'Digital marketplace connecting Rwandan farmers directly with buyers.', long_description: 'A comprehensive platform eliminating middlemen.', category: 'large', sub_category: 'agriculture', cover_image: '', tech_stack: ['Next.js', 'TypeScript', 'MongoDB'], demo_url: 'https://farmconnect.rw', status: 'live', featured: true, is_published: true, is_open_source: true, views: 342, likes: 56, created_by: adminUser.id },
        { title: 'Kwanda EMS', slug: 'kwanda-ems', description: 'Enterprise management system for Kwanda Facility operations.', long_description: 'Full enterprise management solution.', category: 'large', sub_category: 'other', cover_image: '', tech_stack: ['Next.js', 'Express', 'PostgreSQL'], status: 'live', featured: true, is_published: true, is_open_source: false, views: 218, likes: 34, created_by: adminUser.id },
        { title: 'AI Health Assistant', slug: 'ai-health-assistant', description: 'ML-powered health screening tool for rural communities.', long_description: 'Uses ML for health assessments.', category: 'large', sub_category: 'healthcare', cover_image: '', tech_stack: ['Python', 'TensorFlow', 'React Native'], status: 'in-progress', featured: true, is_published: true, is_open_source: true, views: 189, likes: 42, created_by: adminUser.id },
        { title: 'EduConnect Platform', slug: 'educonnect', description: 'Learning management system for schools across Rwanda.', long_description: 'Modern LMS for Rwandan schools.', category: 'large', sub_category: 'education', cover_image: '', tech_stack: ['React', 'Node.js', 'Supabase'], status: 'live', featured: false, is_published: true, is_open_source: false, views: 156, likes: 28, created_by: adminUser.id },
        { title: 'PaySmart Mobile', slug: 'paysmart-mobile', description: 'Mobile payment solution for small businesses in East Africa.', long_description: 'Digital payments for SMEs.', category: 'mini', sub_category: 'finance', cover_image: '', tech_stack: ['React Native', 'Firebase'], status: 'in-progress', featured: false, is_published: true, is_open_source: false, views: 98, likes: 15, created_by: adminUser.id },
        { title: 'OpenDev CLI', slug: 'opendev-cli', description: 'Command-line tool for scaffolding fullstack projects.', long_description: 'CLI for project scaffolding.', category: 'mini', sub_category: 'other', cover_image: '', tech_stack: ['Go', 'TypeScript', 'Docker'], status: 'live', featured: false, is_published: true, is_open_source: true, views: 234, likes: 67, created_by: adminUser.id },
      ]
      await Promise.all(projects.map(p => createDocument('projects', p)))
      results.push('6 projects seeded')
    } else {
      results.push(`${projectCount} projects exist`)
    }

    const courseCount = await countDocuments('courses')
    if (courseCount === 0) {
      const courses = [
        { title: 'React.js — From Zero to Hero', slug: 'reactjs-from-zero-to-hero', description: 'Build modern web apps with React, Hooks, Context API.', long_description: 'Complete React course.', category: 'Frontend', level: 'beginner', type: 'free', price: 0, duration: 8, enrolled: 245, rating: 4.9, featured: true, is_published: true, certificate: true, tags: ['React', 'JavaScript'], cover_image: '', created_by: adminUser.id },
        { title: 'Node.js & Express — Complete Guide', slug: 'nodejs-express-complete-guide', description: 'Learn backend development with Node.js and Express.', long_description: 'Master Node.js backend.', category: 'Backend', level: 'intermediate', type: 'premium', price: 59, duration: 10, enrolled: 178, rating: 4.8, featured: true, is_published: true, certificate: true, tags: ['Node.js', 'Express'], cover_image: '', created_by: adminUser.id },
        { title: 'TypeScript — Master the Fundamentals', slug: 'typescript-master-fundamentals', description: 'Strongly type your JavaScript apps.', long_description: 'Deep TypeScript dive.', category: 'Frontend', level: 'beginner', type: 'free', price: 0, duration: 4, enrolled: 312, rating: 4.9, featured: false, is_published: true, certificate: true, tags: ['TypeScript'], cover_image: '', created_by: adminUser.id },
        { title: 'Python — For Developers', slug: 'python-for-developers', description: 'Learn Python for backend, automation, and AI.', long_description: 'Practical Python course.', category: 'Backend', level: 'beginner', type: 'free', price: 0, duration: 6, enrolled: 198, rating: 4.7, featured: false, is_published: true, certificate: true, tags: ['Python'], cover_image: '', created_by: adminUser.id },
        { title: 'Next.js 14 — The Complete Guide', slug: 'nextjs-14-complete-guide', description: 'Build production-ready apps with Next.js 14.', long_description: 'Master Next.js 14.', category: 'Frontend', level: 'intermediate', type: 'premium', price: 59, duration: 7, enrolled: 156, rating: 4.8, featured: true, is_published: true, certificate: true, tags: ['Next.js', 'React'], cover_image: '', created_by: adminUser.id },
        { title: 'Machine Learning A-Z', slug: 'machine-learning-az', description: 'From theory to deployment — learn ML models.', long_description: 'Comprehensive ML course.', category: 'AI / ML', level: 'advanced', type: 'premium', price: 79, duration: 12, enrolled: 89, rating: 4.9, featured: false, is_published: true, certificate: true, tags: ['Python', 'ML'], cover_image: '', created_by: adminUser.id },
        { title: 'Flutter & Dart — Build Mobile Apps', slug: 'flutter-dart-build-mobile-apps', description: 'Build cross-platform mobile apps.', long_description: 'Complete Flutter course.', category: 'Mobile', level: 'intermediate', type: 'premium', price: 49, duration: 9, enrolled: 134, rating: 4.7, featured: false, is_published: true, certificate: true, tags: ['Flutter', 'Dart'], cover_image: '', created_by: adminUser.id },
        { title: 'Docker & Kubernetes — Practical Guide', slug: 'docker-kubernetes-practical-guide', description: 'Containerization and orchestration for developers.', long_description: 'Docker and K8s course.', category: 'DevOps', level: 'intermediate', type: 'premium', price: 59, duration: 6, enrolled: 76, rating: 4.8, featured: false, is_published: true, certificate: true, tags: ['Docker', 'Kubernetes'], cover_image: '', created_by: adminUser.id },
        { title: 'Fullstack Project Bootcamp', slug: 'fullstack-project-bootcamp', description: 'Build a complete SaaS application from scratch.', long_description: 'Hands-on SaaS bootcamp.', category: 'Frontend', level: 'advanced', type: 'premium', price: 99, duration: 15, enrolled: 67, rating: 4.9, featured: true, is_published: true, certificate: true, tags: ['Fullstack', 'SaaS'], cover_image: '', created_by: adminUser.id },
      ]
      await Promise.all(courses.map(c => createDocument('courses', c)))
      results.push('9 courses seeded')
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
        { name: 'Next.js', category: 'Frontend', proficiency: 95, color: '#ffffff', order_index: 1, featured: true },
        { name: 'React', category: 'Frontend', proficiency: 95, color: '#61dafb', order_index: 2, featured: true },
        { name: 'TypeScript', category: 'Frontend', proficiency: 90, color: '#3178c6', order_index: 3, featured: true },
        { name: 'Tailwind CSS', category: 'Frontend', proficiency: 92, color: '#06b6d4', order_index: 4, featured: true },
        { name: 'HTML/CSS', category: 'Frontend', proficiency: 98, color: '#e34f26', order_index: 5, featured: false },
        { name: 'Node.js', category: 'Backend', proficiency: 88, color: '#339933', order_index: 6, featured: true },
        { name: 'Python', category: 'Backend', proficiency: 85, color: '#3776ab', order_index: 7, featured: true },
        { name: 'Express.js', category: 'Backend', proficiency: 87, color: '#ffffff', order_index: 8, featured: false },
        { name: 'MongoDB', category: 'Database', proficiency: 85, color: '#47a248', order_index: 9, featured: true },
        { name: 'PostgreSQL', category: 'Database', proficiency: 80, color: '#4169e1', order_index: 10, featured: false },
        { name: 'Firebase', category: 'Database', proficiency: 78, color: '#ffca28', order_index: 11, featured: false },
        { name: 'Docker', category: 'DevOps', proficiency: 82, color: '#2496ed', order_index: 12, featured: true },
        { name: 'AWS', category: 'DevOps', proficiency: 75, color: '#ff9900', order_index: 13, featured: false },
        { name: 'Git', category: 'Tools', proficiency: 92, color: '#f05032', order_index: 14, featured: false },
        { name: 'Figma', category: 'Tools', proficiency: 70, color: '#f24e1e', order_index: 15, featured: false },
        { name: 'React Native', category: 'Mobile', proficiency: 80, color: '#61dafb', order_index: 16, featured: true },
        { name: 'Flutter', category: 'Mobile', proficiency: 72, color: '#02569b', order_index: 17, featured: false },
        { name: 'TensorFlow', category: 'AI/ML', proficiency: 70, color: '#ff6f00', order_index: 18, featured: false },
      ]
      await Promise.all(skills.map(s => createDocument('skills', s)))
      results.push('18 skills seeded')
    } else {
      results.push(`${skillCount} skills exist`)
    }

    const achievementCount = await countDocuments('achievements')
    if (achievementCount === 0) {
      const achievements = [
        { title: 'AWS Certified Cloud Practitioner', description: 'Earned AWS Cloud Practitioner certification demonstrating cloud computing knowledge.', year: '2024', type: 'certification', order_index: 1, featured: true },
        { title: 'Best Innovation Award — Rwanda Tech Summit', description: 'Won first place for FarmConnect platform at the annual Rwanda Technology Summit.', year: '2024', type: 'award', order_index: 2, featured: true },
        { title: '100+ GitHub Stars on OpenDev CLI', description: 'Open-source CLI tool reached 100+ stars on GitHub, used by 500+ developers.', year: '2024', type: 'milestone', order_index: 3, featured: true },
        { title: 'FarmConnect — 5000+ Farmers Onboarded', description: 'Digital marketplace platform reached milestone of 5000+ active farmers.', year: '2023', type: 'milestone', order_index: 4, featured: true },
        { title: 'Google Developer Student Club Lead', description: 'Led GDSC at university, organizing workshops and hackathons for 200+ students.', year: '2023', type: 'milestone', order_index: 5, featured: false },
        { title: 'MongoDB Associate Developer Certification', description: 'Certified MongoDB developer, proficient in database design and aggregation.', year: '2023', type: 'certification', order_index: 6, featured: false },
        { title: 'Published Research — AI in Healthcare', description: 'Co-authored paper on ML-based health screening deployed in rural clinics.', year: '2023', type: 'publication', order_index: 7, featured: false },
        { title: 'Hackathon Winner — Africa Code Week', description: 'First place at Africa Code Week hackathon for EduConnect platform.', year: '2022', type: 'award', order_index: 8, featured: false },
      ]
      await Promise.all(achievements.map(a => createDocument('achievements', a)))
      results.push('8 achievements seeded')
    } else {
      results.push(`${achievementCount} achievements exist`)
    }

    const siteStatsCount = await countDocuments('site_stats')
    if (siteStatsCount === 0) {
      const stats = [
        { label: 'Projects Completed', value: 30, suffix: '+', icon: 'FolderOpen', order_index: 1 },
        { label: 'GitHub Stars', value: 150, suffix: '+', icon: 'Star', order_index: 2 },
        { label: 'Courses Created', value: 10, suffix: '', icon: 'BookOpen', order_index: 3 },
        { label: 'Years Experience', value: 5, suffix: '', icon: 'Calendar', order_index: 4 },
        { label: 'Client Satisfaction', value: 100, suffix: '%', icon: 'ThumbsUp', order_index: 5 },
      ]
      await Promise.all(stats.map(s => createDocument('site_stats', s)))
      results.push('5 site stats seeded')
    } else {
      results.push(`${siteStatsCount} site stats exist`)
    }

    const testimonialCount = await countDocuments('testimonials')
    if (testimonialCount === 0) {
      const testimonials = [
        { name: 'Jean Claude', role: 'CTO', company: 'AgriTech Rwanda', content: 'Hamed delivered exceptional work on our FarmConnect platform. His fullstack skills and attention to detail are outstanding. Great communication throughout the project.', rating: 5, order_index: 1, featured: true },
        { name: 'Sarah Uwase', role: 'CEO', company: 'Kwanda Facility', content: 'Hamed transformed our business operations with the Kwanda EMS system. His ability to understand complex requirements and deliver elegant solutions is remarkable.', rating: 5, order_index: 2, featured: true },
        { name: 'David N.', role: 'Founder', company: 'HealthPlus', content: 'Working with Hamed was a pleasure. His technical expertise in AI/ML and fullstack development helped us build a health screening tool that reaches thousands.', rating: 5, order_index: 3, featured: true },
      ]
      await Promise.all(testimonials.map(t => createDocument('testimonials', t)))
      results.push('3 testimonials seeded')
    } else {
      results.push(`${testimonialCount} testimonials exist`)
    }

    return NextResponse.json({ success: true, data: { results, loginUrl: '/login', credentials: { email: adminEmail, password: '@He00Ri#Ga4Da' } } })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
