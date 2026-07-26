import { createServiceClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils/slug'

const courses = [
  {
    title: 'React.js — From Zero to Hero',
    description: 'Build modern, reactive web applications from scratch. Learn components, hooks, state management, routing, and real-world project patterns.',
    content: '## What You\'ll Learn\n\n- JSX and component architecture\n- useState, useEffect, useRef, useContext\n- React Router v6\n- Fetching data and handling loading states\n- Building a complete project from scratch\n\n## Who This Is For\n\nBeginners who want to master React for modern web development.',
    category: 'Frontend', level: 'beginner', price: 'Free', type: 'free', duration: '8 weeks',
    image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    featured: true, is_published: true, order_index: 1, enrolled: 1240, rating: 4.9,
  },
  {
    title: 'Next.js 14 — The Complete Production Guide',
    description: 'Build and deploy production-ready applications with Next.js 14 App Router, Server Components, and Server Actions.',
    content: '## What You\'ll Learn\n\n- App Router and file-based routing\n- React Server Components\n- Server Actions and forms\n- API routes and middleware\n- Authentication patterns\n- Deployment on Vercel\n\n## Who This Is For\n\nReact developers ready to build production apps.',
    category: 'Frontend', level: 'intermediate', price: '$59', type: 'premium', duration: '7 weeks',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    featured: true, is_published: true, order_index: 2, enrolled: 890, rating: 4.8,
  },
  {
    title: 'TypeScript — Master the Fundamentals',
    description: 'Write safer, more maintainable JavaScript with TypeScript. Learn types, generics, interfaces, and advanced patterns.',
    content: '## What You\'ll Learn\n\n- Type system fundamentals\n- Interfaces, types, and generics\n- Utility types and mapped types\n- TypeScript with React and Node.js\n- Configuring tsconfig\n\n## Who This Is For\n\nJavaScript developers who want to level up with TypeScript.',
    category: 'Frontend', level: 'beginner', price: 'Free', type: 'free', duration: '4 weeks',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    featured: false, is_published: true, order_index: 3, enrolled: 2100, rating: 4.7,
  },
  {
    title: 'Node.js & Express — Complete Backend Guide',
    description: 'Master backend development with Node.js, Express, REST APIs, authentication, file uploads, and deployment.',
    content: '## What You\'ll Learn\n\n- Express.js routing and middleware\n- Building RESTful APIs\n- JWT authentication and authorization\n- File uploads with Multer\n- Database integration with MongoDB\n- Deploying to production\n\n## Who This Is For\n\nDevelopers who want to build scalable backend services.',
    category: 'Backend', level: 'intermediate', price: '$59', type: 'premium', duration: '10 weeks',
    image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
    featured: true, is_published: true, order_index: 4, enrolled: 750, rating: 4.8,
  },
  {
    title: 'Python — For Developers & AI Engineers',
    description: 'Learn Python from scratch with a focus on automation, data processing, and AI/ML foundations.',
    content: '## What You\'ll Learn\n\n- Python syntax and data structures\n- Object-oriented programming\n- File handling and automation\n- Working with APIs\n- Introduction to NumPy and Pandas\n- Setting up ML environments\n\n## Who This Is For\n\nDevelopers transitioning to Python or starting with AI/ML.',
    category: 'Backend', level: 'beginner', price: 'Free', type: 'free', duration: '6 weeks',
    image_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop',
    featured: false, is_published: true, order_index: 5, enrolled: 1800, rating: 4.6,
  },
  {
    title: 'Fullstack SaaS Bootcamp — Build & Launch',
    description: 'Build a complete SaaS application from scratch with authentication, payments, dashboard, and admin panel.',
    content: '## What You\'ll Learn\n\n- Planning and architecting a SaaS app\n- User authentication and roles\n- Stripe payment integration\n- Building admin dashboards\n- Multi-tenancy patterns\n- Deploying and scaling\n\n## Who This Is For\n\nDevelopers who want to build and launch their own SaaS product.',
    category: 'Frontend', level: 'advanced', price: '$99', type: 'premium', duration: '15 weeks',
    image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
    featured: true, is_published: true, order_index: 6, enrolled: 420, rating: 4.9,
  },
  {
    title: 'Machine Learning A-Z — From Theory to Production',
    description: 'Comprehensive ML course covering regression, classification, clustering, neural networks, and deploying models.',
    content: '## What You\'ll Learn\n\n- Supervised and unsupervised learning\n- Data preprocessing and feature engineering\n- Model evaluation and tuning\n- Neural networks with TensorFlow/Keras\n- Deploying ML models with FastAPI\n- Computer vision basics\n\n## Who This Is For\n\nDevelopers and data enthusiasts who want practical ML skills.',
    category: 'AI / ML', level: 'advanced', price: '$79', type: 'premium', duration: '12 weeks',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    featured: true, is_published: true, order_index: 7, enrolled: 560, rating: 4.7,
  },
  {
    title: 'AI Chatbot Builder — LangChain & OpenAI',
    description: 'Build intelligent chatbots and AI agents using LangChain, OpenAI, and vector databases.',
    content: '## What You\'ll Learn\n\n- Prompt engineering basics\n- LangChain framework and chains\n- Vector databases and embeddings\n- RAG (Retrieval-Augmented Generation)\n- Building conversational agents\n- Deploying AI apps to production\n\n## Who This Is For\n\nDevelopers who want to build AI-powered applications.',
    category: 'AI / ML', level: 'intermediate', price: '$69', type: 'premium', duration: '8 weeks',
    image_url: 'https://images.unsplash.com/photo-1684163761883-8cba5e0d8154?w=800&h=400&fit=crop',
    featured: true, is_published: true, order_index: 8, enrolled: 340, rating: 4.8,
  },
  {
    title: 'React Native — Build Mobile Apps for iOS & Android',
    description: 'Build real-world mobile applications with React Native, Expo, and native device features.',
    content: '## What You\'ll Learn\n\n- React Native components and navigation\n- Working with native APIs (camera, GPS, storage)\n- State management with Redux Toolkit\n- Push notifications\n- Offline-first patterns\n- Publishing to app stores\n\n## Who This Is For\n\nReact developers who want to build mobile apps.',
    category: 'Mobile', level: 'intermediate', price: '$49', type: 'premium', duration: '10 weeks',
    image_url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&h=400&fit=crop',
    featured: false, is_published: true, order_index: 9, enrolled: 610, rating: 4.6,
  },
  {
    title: 'Flutter & Dart — Build Cross-Platform Apps',
    description: 'Build beautiful, natively compiled mobile apps for iOS and Android from a single codebase.',
    content: '## What You\'ll Learn\n\n- Dart language fundamentals\n- Flutter widgets and layouts\n- State management with Provider and Riverpod\n- Navigation and routing\n- HTTP requests and APIs\n- Publishing to App Store and Play Store\n\n## Who This Is For\n\nDevelopers who want to build mobile apps efficiently.',
    category: 'Mobile', level: 'intermediate', price: '$49', type: 'premium', duration: '9 weeks',
    image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    featured: false, is_published: true, order_index: 10, enrolled: 380, rating: 4.5,
  },
  {
    title: 'Game Development with JavaScript — Build 2D Games',
    description: 'Create fun, interactive 2D games using JavaScript, Canvas API, and Phaser.js framework.',
    content: '## What You\'ll Learn\n\n- Canvas API and rendering\n- Game loops and physics\n- Sprite sheets and animations\n- Collision detection\n- Sound effects and scoring\n- Building a complete platformer game\n\n## Who This Is For\n\nDevelopers who want to get into game development with web technologies.',
    category: 'Game Dev', level: 'beginner', price: 'Free', type: 'free', duration: '6 weeks',
    image_url: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&h=400&fit=crop',
    featured: false, is_published: true, order_index: 11, enrolled: 920, rating: 4.7,
  },
  {
    title: 'Docker & Kubernetes — Practical DevOps Guide',
    description: 'Learn containerization, orchestration, CI/CD pipelines, and modern DevOps practices.',
    content: '## What You\'ll Learn\n\n- Docker fundamentals and Dockerfile\n- Docker Compose for multi-container apps\n- Kubernetes architecture and concepts\n- Deploying apps to Kubernetes\n- CI/CD with GitHub Actions\n- Monitoring and logging\n\n## Who This Is For\n\nDevelopers and DevOps engineers looking to master containers.',
    category: 'DevOps', level: 'intermediate', price: '$59', type: 'premium', duration: '6 weeks',
    image_url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop',
    featured: false, is_published: true, order_index: 12, enrolled: 290, rating: 4.6,
  },
]

export async function POST() {
  try {
    const supabase = createServiceClient()
    const results: string[] = []

    // Delete all existing courses
    const { data: existing, error: fetchError } = await supabase.from('courses').select('id')
    if (fetchError) return Response.json({ success: false, error: fetchError.message }, { status: 500 })

    if (existing && existing.length > 0) {
      for (const c of existing) {
        // Delete associated lessons first
        await supabase.from('lessons').delete().eq('course_id', c.id)
      }
      const { error: deleteError } = await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (deleteError) return Response.json({ success: false, error: deleteError.message }, { status: 500 })
      results.push(`Deleted ${existing.length} old courses`)
    }

    // Insert new courses
    for (const c of courses) {
      const slug = generateSlug(c.title)
      const { error } = await supabase.from('courses').insert({ ...c, slug })
      results.push(error ? `ERROR: ${c.title} — ${error.message}` : `OK: ${c.title}`)
    }

    return Response.json({ success: true, results })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
