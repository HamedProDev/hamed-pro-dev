import { createServiceClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils/slug'

const newCourses = [
  { title: 'Game Development with JavaScript — Build 2D Games', description: 'Create fun, interactive 2D games using JavaScript, Canvas API, and Phaser.js framework.', content: '## What You\'ll Learn\n\n- Canvas API and rendering\n- Game loops and physics\n- Sprite sheets and animations\n- Collision detection\n- Sound effects and scoring\n- Building a complete platformer game\n\n## Who This Is For\n\nDevelopers who want to get into game development with web technologies.', category: 'Game Dev', level: 'beginner', price: 'Free', type: 'free', duration: '6 weeks', image_url: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&h=400&fit=crop', featured: false, is_published: true, order_index: 10 },
  { title: 'AI Chatbot Builder — LangChain & OpenAI', description: 'Build intelligent chatbots and AI agents using LangChain, OpenAI, and vector databases.', content: '## What You\'ll Learn\n\n- Prompt engineering basics\n- LangChain framework and chains\n- Vector databases and embeddings\n- RAG (Retrieval-Augmented Generation)\n- Building conversational agents\n- Deploying AI apps to production\n\n## Who This Is For\n\nDevelopers who want to build AI-powered applications.', category: 'AI / ML', level: 'intermediate', price: '$69', type: 'premium', duration: '8 weeks', image_url: 'https://images.unsplash.com/photo-1684163761883-8cba5e0d8154?w=800&h=400&fit=crop', featured: true, is_published: true, order_index: 11 },
  { title: 'React Native — Build Mobile Apps for iOS & Android', description: 'Build real-world mobile applications with React Native, Expo, and native device features.', content: '## What You\'ll Learn\n\n- React Native components and navigation\n- Working with native APIs (camera, GPS, storage)\n- State management with Redux Toolkit\n- Push notifications\n- Offline-first patterns\n- Publishing to app stores\n\n## Who This Is For\n\nReact developers who want to build mobile apps.', category: 'Mobile', level: 'intermediate', price: '$49', type: 'premium', duration: '10 weeks', image_url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&h=400&fit=crop', featured: false, is_published: true, order_index: 12 },
  { title: 'Flutter & Dart — Build Cross-Platform Apps', description: 'Build beautiful, natively compiled mobile apps for iOS and Android from a single codebase.', content: '## What You\'ll Learn\n\n- Dart language fundamentals\n- Flutter widgets and layouts\n- State management with Provider and Riverpod\n- Navigation and routing\n- HTTP requests and APIs\n- Publishing to App Store and Play Store\n\n## Who This Is For\n\nDevelopers who want to build mobile apps efficiently.', category: 'Mobile', level: 'intermediate', price: '$49', type: 'premium', duration: '9 weeks', image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop', featured: false, is_published: true, order_index: 7 },
  { title: 'Python — For Developers & AI Engineers', description: 'Learn Python from scratch with a focus on automation, data processing, and AI/ML foundations.', content: '## What You\'ll Learn\n\n- Python syntax and data structures\n- Object-oriented programming\n- File handling and automation\n- Working with APIs\n- Introduction to NumPy and Pandas\n- Setting up ML environments\n\n## Who This Is For\n\nDevelopers transitioning to Python or starting with AI/ML.', category: 'Backend', level: 'beginner', price: 'Free', type: 'free', duration: '6 weeks', image_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop', featured: false, is_published: true, order_index: 4 },
]

export async function POST() {
  try {
    const supabase = createServiceClient()
    const results: string[] = []

    for (const c of newCourses) {
      const slug = generateSlug(c.title)
      const { data } = await supabase.from('courses').select('id').eq('slug', slug).single()

      if (data) {
        results.push(`SKIP: ${c.title}`)
        continue
      }

      const { error } = await supabase.from('courses').insert({ ...c, slug })
      results.push(error ? `ERROR: ${c.title} — ${error.message}` : `OK: ${c.title}`)
    }

    return Response.json({ success: true, results })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
