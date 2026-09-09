// Shared seed content — single source of truth.
// Used by src/app/api/seed/route.ts (web seeding) and scripts/seed-supabase.ts (CLI seeding).
// NOTE: all course prices are intentionally 'Free' (type: 'free').

export const seedProjects = [
  // ── Flagship products ────────────────────────────────────────────────────────
  { title: 'Yashfi Market', slug: 'yashfi-market', description: 'Healthy & e-commerce website for everyone — Yashfi. Shop cosmetics, health and wellness products online.', content: `## Overview
Yashfi Market is a full e-commerce platform for health, wellness and cosmetics products.

## Highlights
- Product catalog with categories, search and filters
- Shopping cart and secure checkout flow
- Order management and admin dashboard
- Responsive storefront that works on every device`, category: 'saas', status: 'Completed', client: 'Yashfi', year: '2025', role: 'Full Stack Developer', tags: ['ecommerce', 'health', 'marketplace'], tech_stack: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'CSS'], image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop', demo_url: 'https://yashfimarket.onrender.com/', github_url: 'https://github.com/HamedProDev/yashfi-platform', screenshots: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=450&fit=crop'], featured: true, is_published: true, order_index: 1 },
  { title: 'HahuMoviePlus', slug: 'hahumovieplus', description: 'A modern movie streaming platform to browse, discover and watch movies and series online.', content: `## Overview
HahuMoviePlus is a streaming web app for discovering and watching movies and series.

## Highlights
- Movie and series catalog with rich metadata
- Search and genre-based discovery
- Player-ready detail pages with trailers
- Clean, cinematic responsive UI`, category: 'saas', status: 'Completed', client: 'Personal', year: '2025', role: 'Full Stack Developer', tags: ['movies', 'streaming', 'entertainment'], tech_stack: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS'], image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop', demo_url: 'https://hahumovieplus.vercel.app', github_url: 'https://github.com/HamedProDev/hahumovieplus', screenshots: ['https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&h=450&fit=crop'], featured: true, is_published: true, order_index: 2 },
  { title: 'IslamAI', slug: 'islamai', description: 'An AI-powered Quran assistant that helps users study, search and understand the Holy Quran.', content: `## Overview
IslamAI brings AI assistance to Quran study — search, translation and Q&A over Quranic content.

## Highlights
- Semantic search across Quran text
- AI-powered explanations and Q&A
- Multilingual interface
- Clean, distraction-free reading experience`, category: 'ai', status: 'Maintained', client: 'Personal', year: '2025', role: 'AI Engineer', tags: ['AI', 'Quran', 'NLP', 'islamic'], tech_stack: ['TypeScript', 'Next.js', 'OpenAI', 'Tailwind CSS'], image_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=400&fit=crop', demo_url: 'https://islamquranai.vercel.app', github_url: 'https://github.com/HamedProDev/islamai', screenshots: ['https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&h=450&fit=crop'], featured: true, is_published: true, order_index: 3 },
  { title: 'The Invincibles', slug: 'the-invincibles', description: 'A real-time chat and social app to message friends, join groups and stay connected.', content: `## Overview
The Invincibles is a chat and social platform with real-time messaging.

## Highlights
- Real-time one-to-one and group chat
- Presence indicators and typing status
- User profiles and social feed
- Works across devices with a fast, modern UI`, category: 'saas', status: 'Beta', client: 'Personal', year: '2025', role: 'Full Stack Developer', tags: ['chat', 'social', 'realtime'], tech_stack: ['TypeScript', 'React', 'Firebase', 'Tailwind CSS'], image_url: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=400&fit=crop', demo_url: 'https://invincibles-chat.netlify.app/', github_url: 'https://github.com/HamedProDev/the-invincibles', screenshots: ['https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=450&fit=crop'], featured: true, is_published: true, order_index: 4 },
  { title: 'Jay Nursing', slug: 'jay-nursing', description: 'A professional website for Jay Nursing — healthcare services, team and contact information.', content: `## Overview
A polished public website for Jay Nursing, presenting healthcare services and staff.

## Highlights
- Services and care programs showcase
- Team and facility sections
- Contact and appointment request form
- Accessible, mobile-first design`, category: 'large', status: 'Completed', client: 'Jay Nursing', year: '2025', role: 'Full Stack Developer', tags: ['healthcare', 'nursing', 'business'], tech_stack: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'], image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop', demo_url: 'https://jay-nursing.vercel.app', github_url: 'https://github.com/HamedProDev/jay-nursing', screenshots: ['https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=450&fit=crop'], featured: true, is_published: true, order_index: 5 },
  { title: 'MindCare', slug: 'mindcare', description: 'A mental wellness app to help people practice mindfulness, track mood and access self-care resources.', content: `## Overview
MindCare is a mental wellness platform focused on mindfulness and self-care.

## Highlights
- Mood tracking and journaling
- Guided mindfulness and breathing exercises
- Self-care resources and tips
- Calm, soothing design for daily use`, category: 'large', status: 'Beta', client: 'Personal', year: '2025', role: 'Full Stack Developer', tags: ['health', 'wellness', 'mental-health'], tech_stack: ['React', 'Firebase', 'Tailwind CSS'], image_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=400&fit=crop', demo_url: 'https://isomomindcare.web.app/', github_url: 'https://github.com/HamedProDev/mindcare', screenshots: ['https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&h=450&fit=crop'], featured: true, is_published: true, order_index: 6 },

  // ── Web platforms ────────────────────────────────────────────────────────────
  { title: 'HahuMovies', slug: 'hahumovies', description: 'An online movie streaming service to watch movies and series from a growing catalog.', content: `## Overview
HahuMovies is an online streaming service for movies and series.

## Highlights
- Streaming catalog with categories
- Search and detail pages
- Watchlist and favorites
- Fast, media-friendly interface`, category: 'saas', status: 'Maintained', client: 'Personal', year: '2025', role: 'Full Stack Developer', tags: ['movies', 'streaming'], tech_stack: ['TypeScript', 'React', 'Node.js'], image_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/hahumovies', screenshots: [], featured: false, is_published: true, order_index: 7 },
  { title: 'Lycée Ruhango', slug: 'lycee-ruhango', description: 'An official school website for Lycée Ruhango with news, admissions and contact information.', content: `## Overview
A public website for Lycée Ruhango secondary school.

## Highlights
- School news and announcements
- Admissions and programs information
- Staff and gallery sections
- Contact and location details`, category: 'school', status: 'Completed', client: 'Lycée Ruhango', year: '2024', role: 'Full Stack Developer', tags: ['education', 'school', 'website'], tech_stack: ['TypeScript', 'React', 'Tailwind CSS'], image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/lycee-ruhango', screenshots: [], featured: false, is_published: true, order_index: 8 },
  { title: 'Cykelsmedjan', slug: 'cykelsmedjan', description: 'A website for a bicycle workshop (Cykelsmedjan) — services, booking and shop information.', content: `## Overview
A modern site for Cykelsmedjan, a bicycle repair shop.

## Highlights
- Services and pricing showcase
- Booking and appointment requests
- Workshop gallery and location
- Responsive storefront design`, category: 'large', status: 'Completed', client: 'Cykelsmedjan', year: '2025', role: 'Full Stack Developer', tags: ['bicycle', 'business', 'booking'], tech_stack: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS'], image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/cykelsmedjan', screenshots: [], featured: false, is_published: true, order_index: 9 },
  { title: 'AgriKwanda', slug: 'agrikwanda', description: "Rwanda's agriculture monitoring website where people sell and buy agricultural products online.", content: `## Overview
AgriKwanda connects farmers and buyers with an agriculture marketplace and monitoring tools.

## Highlights
- Buy and sell agricultural products
- Market monitoring and price trends
- Farmer and buyer profiles
- Localized for the Rwandan market`, category: 'saas', status: 'In Progress', client: 'Personal', year: '2025', role: 'Full Stack Developer', tags: ['agriculture', 'marketplace', 'rwanda'], tech_stack: ['TypeScript', 'Next.js', 'Node.js', 'Supabase'], image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/AgriKwanda', screenshots: [], featured: false, is_published: true, order_index: 10 },
  { title: 'Social Cash', slug: 'social-cash', description: 'A platform to make money online easily through social tasks and rewards.', content: `## Overview
Social Cash is a monetization platform built around social tasks and rewards.

## Highlights
- Task and reward system
- Wallet and earnings dashboard
- Referral tracking
- Gamified user experience`, category: 'saas', status: 'Completed', client: 'Personal', year: '2025', role: 'Full Stack Developer', tags: ['monetization', 'rewards', 'social'], tech_stack: ['TypeScript', 'React', 'Firebase'], image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop', demo_url: 'https://socialmakecash.web.app/', github_url: 'https://github.com/HamedProDev/social-cash', screenshots: [], featured: false, is_published: true, order_index: 11 },
  { title: 'Novasoft RW', slug: 'novasoft-rw', description: 'A corporate website for Novasoft Rwanda — software services, portfolio and team.', content: `## Overview
A company website for Novasoft Rwanda presenting software services and work.

## Highlights
- Services and capabilities
- Portfolio and case studies
- Team and contact sections
- Professional corporate design`, category: 'large', status: 'Completed', client: 'Novasoft RW', year: '2025', role: 'Full Stack Developer', tags: ['company', 'software', 'business'], tech_stack: ['TypeScript', 'Next.js', 'Tailwind CSS'], image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop', demo_url: 'https://novasoftrw.vercel.app', github_url: 'https://github.com/HamedProDev/novasoftrw', screenshots: [], featured: false, is_published: true, order_index: 12 },

  // ── Mobile apps ──────────────────────────────────────────────────────────────
  { title: 'Islam Quran AI App', slug: 'islam-quran-ai-app', description: 'An Android app that brings AI-powered Quran study and assistance to every Muslim.', content: `## Overview
A native Android application for AI-assisted Quran reading and study.

## Highlights
- Native Android experience
- AI-assisted explanations and search
- Offline reading support
- Built with modern Kotlin tooling`, category: 'mobile', status: 'In Progress', client: 'Personal', year: '2025', role: 'Mobile Developer', tags: ['android', 'kotlin', 'quran', 'AI'], tech_stack: ['Kotlin', 'Android', 'Jetpack Compose'], image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/islam-quran-ai-app', screenshots: [], featured: true, is_published: true, order_index: 13 },
  { title: 'Modern E-commerce (Kotlin)', slug: 'modern-ecommerce-kotlin', description: 'A modern Android e-commerce app built with Kotlin featuring product browsing and cart.', content: `## Overview
A native Android e-commerce application built with Kotlin.

## Highlights
- Product catalog and detail pages
- Cart and checkout flow
- Clean MVVM architecture
- Modern Material Design UI`, category: 'mobile', status: 'Completed', client: 'Personal', year: '2024', role: 'Mobile Developer', tags: ['android', 'kotlin', 'ecommerce'], tech_stack: ['Kotlin', 'Android', 'MVVM'], image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/modern-ecommerce-kotlin', screenshots: [], featured: false, is_published: true, order_index: 14 },

  // ── AI & data projects ───────────────────────────────────────────────────────
  { title: 'Kinyarwanda Datasets', slug: 'kinyarwanda-datasets', description: 'Curated Kinyarwanda language datasets (text and numbers) for NLP and speech research.', content: `## Overview
A collection of Kinyarwanda datasets for NLP and speech model training.

## Highlights
- Text corpora for language modeling
- Numeric and structured datasets
- Ready-to-use for ML pipelines
- Supports local-language AI research`, category: 'ai', status: 'Maintained', client: 'Open Source', year: '2024', role: 'AI Engineer', tags: ['NLP', 'datasets', 'kinyarwanda', 'open-source'], tech_stack: ['Python', 'NLP', 'Hugging Face'], image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/Kinyarwanda-datasets', screenshots: [], featured: false, is_published: true, order_index: 15 },
  { title: 'Claude Code (Mini)', slug: 'claude-code-mini', description: 'A mini Claude-style code chatbot that runs with your own custom API key.', content: `## Overview
A lightweight Claude-style coding assistant that connects to a custom API.

## Highlights
- Conversational coding assistant
- Bring-your-own API key
- Inline code formatting
- Minimal, fast interface`, category: 'ai', status: 'Completed', client: 'Personal', year: '2025', role: 'AI Engineer', tags: ['AI', 'chatbot', 'developer-tools'], tech_stack: ['JavaScript', 'Node.js', 'OpenAI API'], image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/Claude-Code', screenshots: [], featured: false, is_published: true, order_index: 16 },

  // ── Mini projects, tools & learning ─────────────────────────────────────────
  { title: 'Full Admin-Control Portfolio', slug: 'full-admin-control-dynamic-portfolio', description: 'A complete CRUD dynamic portfolio template with a full admin panel for fast setup.', content: `## Overview
A dynamic portfolio starter with full admin control for developers who need a site fast.

## Highlights
- CRUD admin panel for projects, skills and more
- Dynamic content, no code changes needed
- Auth-protected admin dashboard
- Reusable, customizable template`, category: 'mini', status: 'Completed', client: 'Open Source', year: '2025', role: 'Full Stack Developer', tags: ['portfolio', 'template', 'open-source', 'admin'], tech_stack: ['TypeScript', 'React', 'Supabase'], image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/full-admin-control-dynamic-portfolio', screenshots: [], featured: false, is_published: true, order_index: 17 },
  { title: 'Code Publisher Assistant', slug: 'code-publisher-assistant', description: 'A portfolio assistant that helps developers publish and present their code and projects.', content: `## Overview
A portfolio assistant that showcases projects and helps publish code elegantly.

## Highlights
- Project showcase and cards
- Developer profile presentation
- Clean, modern layout
- Easy customization`, category: 'mini', status: 'Completed', client: 'Personal', year: '2025', role: 'Frontend Developer', tags: ['portfolio', 'developer-tools'], tech_stack: ['TypeScript', 'Next.js', 'Tailwind CSS'], image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop', demo_url: 'https://hahupro.vercel.app', github_url: 'https://github.com/HamedProDev/code-publisher-assistant', screenshots: [], featured: false, is_published: true, order_index: 18 },
  { title: 'ES Mukingi', slug: 'es-mukingi', description: 'A school website for ES MUKINGI built with Vue.js.', content: `## Overview
A public school website for ES MUKINGI built with Vue.js.

## Highlights
- School information and news
- Programs and departments
- Gallery and events
- Responsive Vue.js frontend`, category: 'school', status: 'Completed', client: 'ES Mukingi', year: '2024', role: 'Frontend Developer', tags: ['school', 'vue', 'education'], tech_stack: ['Vue.js', 'JavaScript', 'CSS'], image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/es-mukingi', screenshots: [], featured: false, is_published: true, order_index: 19 },
  { title: 'JavaScript Projects', slug: 'javascript-projects-collection', description: 'A collection of hand-coded JavaScript projects to practice and understand core logic.', content: `## Overview
A set of non-AI-generated JavaScript projects to build real understanding of the language.

## Highlights
- Vanilla JavaScript exercises
- Logic-focused, framework-free
- Great for beginners and interviews
- Each project is self-contained`, category: 'mini', status: 'Maintained', client: 'Open Source', year: '2024', role: 'Developer', tags: ['javascript', 'learning', 'open-source'], tech_stack: ['JavaScript', 'HTML', 'CSS'], image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/javascript-projects', screenshots: [], featured: false, is_published: true, order_index: 20 },
  { title: 'JavaScript Test', slug: 'javascript-test', description: 'A quiz platform that helps you know your JavaScript level with questions and answers.', content: `## Overview
An interactive test to measure and improve your JavaScript knowledge.

## Highlights
- JavaScript questions and answers
- Score tracking and explanations
- Beginner to advanced levels
- Great interview prep tool`, category: 'mini', status: 'Completed', client: 'Open Source', year: '2024', role: 'Developer', tags: ['javascript', 'quiz', 'learning'], tech_stack: ['JavaScript', 'HTML', 'CSS'], image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/javascript-test', screenshots: [], featured: false, is_published: true, order_index: 21 },
  { title: 'Iga Vue.js', slug: 'iga-vue-js', description: 'A website teaching Vue.js in Kinyarwanda with lessons, games and practice exercises.', content: `## Overview
"Yiga Vue.js mu Kinyarwanda" — learn Vue.js in Kinyarwanda with interactive content.

## Highlights
- Vue.js lessons in Kinyarwanda
- Built-in mini games (Tic Tac Toe, Memory, Click Counter)
- Practice exercises and examples
- Community links and resources`, category: 'mini', status: 'Completed', client: 'Open Source', year: '2025', role: 'Full Stack Developer', tags: ['vue', 'education', 'kinyarwanda'], tech_stack: ['TypeScript', 'Vue.js', 'Tailwind CSS'], image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/Iga-Vue-js', screenshots: [], featured: false, is_published: true, order_index: 22 },
  { title: 'Home Shop Vue 3', slug: 'home-shop-vue3', description: 'A practical Vue 3 shop project using Vue 3, Bootstrap, Vite and PrimeVue.', content: `## Overview
A practical shop application built with Vue 3 and modern tooling.

## Highlights
- Vue 3 Composition API
- Bootstrap + PrimeVue components
- Vite-powered development
- Product listing and cart flows`, category: 'mini', status: 'Completed', client: 'Personal', year: '2024', role: 'Frontend Developer', tags: ['vue', 'shop', 'frontend'], tech_stack: ['Vue 3', 'Bootstrap', 'Vite', 'PrimeVue'], image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/home-shop-Vue3', screenshots: [], featured: false, is_published: true, order_index: 23 },
  { title: 'AgriSmart', slug: 'agrismart', description: 'A farm management system that tracks and manages farms in Rwanda and worldwide.', content: `## Overview
AgriSmart is a farm management system for tracking and managing farms.

## Highlights
- Farm and crop tracking
- Production and inventory management
- Reporting and analytics
- Built to scale across regions`, category: 'saas', status: 'In Progress', client: 'Personal', year: '2025', role: 'Full Stack Developer', tags: ['agriculture', 'management', 'saas'], tech_stack: ['TypeScript', 'Next.js', 'PostgreSQL'], image_url: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=800&h=400&fit=crop', demo_url: '', github_url: 'https://github.com/HamedProDev/AgriSmart', screenshots: [], featured: false, is_published: true, order_index: 24 },
];

export const seedCourses = [
  // ── Core programming ────────────────────────────────────────────────────────
  { title: 'JavaScript — The Complete Guide', slug: 'javascript-complete-guide', description: 'Master JavaScript from zero to advanced: syntax, DOM, async, ES6+, and real projects.', content: `## What You'll Learn
- JavaScript fundamentals and modern ES6+ syntax
- DOM manipulation and browser events
- Asynchronous JavaScript (promises, async/await)
- Working with APIs and JSON
- Object-oriented and functional patterns
- Building real-world projects from scratch

## Who This Is For
Absolute beginners and developers who want a rock-solid JavaScript foundation.`, category: 'Frontend', level: 'beginner', price: 'Free', type: 'free', duration: '10 weeks', image_url: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop', tags: ['JavaScript', 'Frontend', 'ES6'], prerequisites: ['Basic computer skills'], outcomes: ['Build interactive websites with vanilla JavaScript', 'Understand async patterns', 'Prepare for frontend frameworks'], featured: true, is_published: true, order_index: 1, final_quiz: [
    { question: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'global', 'int'], correctIndex: 1, explanation: 'let (and const) are block-scoped.' },
    { question: 'What does JSON.parse() do?', options: ['Converts an object to a string', 'Converts a JSON string to an object', 'Formats a date', 'Encrypts data'], correctIndex: 1, explanation: 'JSON.parse() turns a JSON string into a JavaScript object.' },
    { question: 'Which method handles a rejected promise?', options: ['.then()', '.catch()', '.finally() only', '.done()'], correctIndex: 1, explanation: '.catch() handles promise rejections.' },
  ] },
  { title: 'React.js — From Zero to Hero', slug: 'reactjs-from-zero-to-hero', description: 'Build modern, reactive web applications from scratch. Learn components, hooks, state management, routing, and real-world project patterns.', content: `## What You'll Learn
- JSX and component architecture
- useState, useEffect, useRef, useContext
- React Router v6
- Fetching data and handling loading states
- Building a complete project from scratch

## Who This Is For
Beginners who want to master React for modern web development.`, category: 'Frontend', level: 'beginner', price: 'Free', type: 'free', duration: '8 weeks', image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop', tags: ['React', 'Frontend', 'Hooks'], prerequisites: ['JavaScript fundamentals'], outcomes: ['Build production React apps', 'Manage state with hooks'], featured: true, is_published: true, order_index: 2, final_quiz: [
    { question: 'Which hook manages local state inside a function component?', options: ['useState', 'useEffect', 'useRouter', 'createStore'], correctIndex: 0, explanation: 'useState is the core hook for local component state.' },
    { question: 'What does JSX compile down to?', options: ['HTML', 'React.createElement calls', 'CSS', 'JSON'], correctIndex: 1, explanation: 'JSX is syntactic sugar for React.createElement.' },
    { question: 'Which of these is a correct way to fetch data on mount?', options: ['fetch() in render', 'useEffect with an empty dependency array', 'setInterval in JSX', 'a CSS animation'], correctIndex: 1, explanation: 'useEffect with [] runs once after mount.' },
  ] },
  { title: 'Node.js & Express — Complete Backend Guide', slug: 'nodejs-express-complete-guide', description: 'Master backend development with Node.js, Express, REST APIs, authentication, file uploads, and deployment.', content: `## What You'll Learn
- Express.js routing and middleware
- Building RESTful APIs
- JWT authentication and authorization
- File uploads with Multer
- Database integration with MongoDB
- Deploying to production

## Who This Is For
Developers who want to build scalable backend services.`, category: 'Backend', level: 'intermediate', price: 'Free', type: 'free', duration: '10 weeks', image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop', tags: ['Node.js', 'Express', 'Backend', 'API'], prerequisites: ['JavaScript fundamentals'], outcomes: ['Build REST APIs', 'Implement authentication'], featured: true, is_published: true, order_index: 3 },
  { title: 'Python — For Developers & AI Engineers', slug: 'python-for-developers-ai', description: 'Learn Python from scratch with a focus on automation, data processing, and AI/ML foundations.', content: `## What You'll Learn
- Python syntax and data structures
- Object-oriented programming
- File handling and automation
- Working with APIs
- Introduction to NumPy and Pandas
- Setting up ML environments

## Who This Is For
Developers transitioning to Python or starting with AI/ML.`, category: 'Backend', level: 'beginner', price: 'Free', type: 'free', duration: '6 weeks', image_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop', tags: ['Python', 'Backend', 'Automation'], prerequisites: ['Basic programming logic'], outcomes: ['Write clean Python', 'Automate tasks', 'Prepare for data science'], featured: false, is_published: true, order_index: 4, final_quiz: [
    { question: 'Which structure is best for unique, unordered values?', options: ['list', 'set', 'tuple', 'dict'], correctIndex: 1, explanation: 'A set stores unique, unordered values.' },
    { question: 'What does a list comprehension produce?', options: ['A dictionary', 'A new list', 'A generator object only', 'A string'], correctIndex: 1, explanation: 'List comprehensions build a new list concisely.' },
  ] },
  { title: 'PHP & MySQL — Build Dynamic Web Apps', slug: 'php-mysql-dynamic-web-apps', description: 'Learn PHP from scratch and build database-driven websites with MySQL, forms, sessions and CRUD.', content: `## What You'll Learn
- PHP syntax, functions and OOP
- Handling forms and user input safely
- Sessions, cookies and authentication
- MySQL database design and queries
- Full CRUD applications
- Securing against SQL injection and XSS

## Who This Is For
Beginners who want to build classic server-rendered web apps and understand the LAMP stack.`, category: 'Backend', level: 'beginner', price: 'Free', type: 'free', duration: '8 weeks', image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop', tags: ['PHP', 'MySQL', 'Backend'], prerequisites: ['Basic HTML'], outcomes: ['Build CRUD apps with PHP and MySQL', 'Secure user input'], featured: true, is_published: true, order_index: 5, final_quiz: [
    { question: 'Which superglobal holds form data sent via POST?', options: ['$_GET', '$_POST', '$_SESSION', '$_COOKIE'], correctIndex: 1, explanation: '$_POST contains form data sent with the POST method.' },
    { question: 'What does PDO help prevent?', options: ['CSS conflicts', 'SQL injection', 'Slow images', 'Caching'], correctIndex: 1, explanation: 'Prepared statements via PDO prevent SQL injection.' },
  ] },
  { title: 'TypeScript — Master the Fundamentals', slug: 'typescript-master-fundamentals', description: 'Write safer, more maintainable JavaScript with TypeScript. Learn types, generics, interfaces, and advanced patterns.', content: `## What You'll Learn
- Type system fundamentals
- Interfaces, types, and generics
- Utility types and mapped types
- TypeScript with React and Node.js
- Configuring tsconfig

## Who This Is For
JavaScript developers who want to level up with TypeScript.`, category: 'Frontend', level: 'beginner', price: 'Free', type: 'free', duration: '4 weeks', image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop', tags: ['TypeScript', 'Frontend', 'Types'], prerequisites: ['JavaScript fundamentals'], outcomes: ['Add static types to projects'], featured: false, is_published: true, order_index: 6 },
  { title: 'Next.js 14 — The Complete Production Guide', slug: 'nextjs-14-complete-production-guide', description: 'Build and deploy production-ready applications with Next.js 14 App Router, Server Components, and Server Actions.', content: `## What You'll Learn
- App Router and file-based routing
- React Server Components
- Server Actions and forms
- API routes and middleware
- Authentication patterns
- Deployment on Vercel

## Who This Is For
React developers ready to build production apps.`, category: 'Frontend', level: 'intermediate', price: 'Free', type: 'free', duration: '7 weeks', image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', tags: ['Next.js', 'React', 'Fullstack'], prerequisites: ['React fundamentals'], outcomes: ['Ship production Next.js apps'], featured: true, is_published: true, order_index: 7 },

  // ── Data & databases ─────────────────────────────────────────────────────────
  { title: 'SQL & Databases — PostgreSQL from Scratch', slug: 'sql-postgresql-from-scratch', description: 'Learn SQL and relational databases with PostgreSQL: design, queries, joins, indexes and optimization.', content: `## What You'll Learn
- Relational database concepts and design
- SELECT, INSERT, UPDATE, DELETE
- Joins, subqueries and aggregations
- Indexes and query optimization
- Transactions and constraints
- Connecting SQL to your apps

## Who This Is For
Developers who want a strong database foundation.`, category: 'Backend', level: 'beginner', price: 'Free', type: 'free', duration: '5 weeks', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop', tags: ['SQL', 'PostgreSQL', 'Database'], prerequisites: ['None'], outcomes: ['Design and query relational databases'], featured: false, is_published: true, order_index: 8 },
  { title: 'Git & GitHub — Version Control Essentials', slug: 'git-github-version-control', description: 'Master Git and GitHub: commits, branches, merges, pull requests, and team workflows.', content: `## What You'll Learn
- Git fundamentals and the three states
- Committing, branching and merging
- Resolving conflicts
- GitHub pull requests and code review
- Collaboration workflows (Git Flow)
- GitHub Actions basics

## Who This Is For
Every developer — version control is non-negotiable.`, category: 'DevOps', level: 'beginner', price: 'Free', type: 'free', duration: '3 weeks', image_url: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop', tags: ['Git', 'GitHub', 'DevOps'], prerequisites: ['None'], outcomes: ['Collaborate confidently with Git'], featured: false, is_published: true, order_index: 9 },

  // ── AI & Machine Learning ────────────────────────────────────────────────────
  { title: 'Machine Learning A-Z — From Theory to Production', slug: 'machine-learning-az-production', description: 'Comprehensive ML course covering regression, classification, clustering, neural networks, and deploying models to production.', content: `## What You'll Learn
- Supervised and unsupervised learning
- Data preprocessing and feature engineering
- Model evaluation and tuning
- Neural networks with TensorFlow/Keras
- Deploying ML models with FastAPI
- Computer vision basics

## Who This Is For
Developers and data enthusiasts who want practical ML skills.`, category: 'AI / ML', level: 'advanced', price: 'Free', type: 'free', duration: '12 weeks', image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop', tags: ['Machine Learning', 'Python', 'TensorFlow'], prerequisites: ['Python fundamentals'], outcomes: ['Train and deploy ML models'], featured: false, is_published: true, order_index: 10, final_quiz: [
    { question: 'Which is a supervised learning task?', options: ['Clustering', 'Classification', 'Dimensionality reduction', 'Association rules'], correctIndex: 1, explanation: 'Classification uses labeled data — supervised.' },
    { question: 'What is overfitting?', options: ['Model too simple', 'Model memorizes training data', 'Missing data', 'Bad data types'], correctIndex: 1, explanation: 'Overfitting means the model fits noise in training data.' },
  ] },
  { title: 'Deep Learning & Neural Networks', slug: 'deep-learning-neural-networks', description: 'Build and train neural networks with PyTorch/TensorFlow: CNNs, RNNs, transfer learning and more.', content: `## What You'll Learn
- Neural network fundamentals
- Activation functions and backpropagation
- Convolutional Neural Networks (CNNs)
- Recurrent networks and sequences
- Transfer learning with pretrained models
- Training best practices and GPU workflows

## Who This Is For
Developers ready to go deeper into modern AI.`, category: 'AI / ML', level: 'intermediate', price: 'Free', type: 'free', duration: '10 weeks', image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop', tags: ['Deep Learning', 'PyTorch', 'Neural Networks'], prerequisites: ['Python', 'Basic ML concepts'], outcomes: ['Train neural networks from scratch'], featured: false, is_published: true, order_index: 11 },
  { title: 'Generative AI & LLMs — Prompt Engineering, RAG & Agents', slug: 'generative-ai-llms-rag-agents', description: 'Build with large language models: prompt engineering, retrieval-augmented generation, and AI agents.', content: `## What You'll Learn
- How LLMs work and their limits
- Prompt engineering techniques
- Retrieval-Augmented Generation (RAG)
- Vector databases and embeddings
- Building AI agents and tool use
- Deploying LLM apps to production

## Who This Is For
Developers who want to ship real generative AI products.`, category: 'AI / ML', level: 'intermediate', price: 'Free', type: 'free', duration: '8 weeks', image_url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=400&fit=crop', tags: ['Generative AI', 'LLM', 'RAG', 'Agents'], prerequisites: ['Python or JavaScript'], outcomes: ['Build RAG pipelines and AI agents'], featured: true, is_published: true, order_index: 12 },
  { title: 'Natural Language Processing with Python', slug: 'natural-language-processing-python', description: 'Process and understand text with Python: tokenization, embeddings, sentiment analysis and transformers.', content: `## What You'll Learn
- Text preprocessing and tokenization
- Word embeddings (Word2Vec, GloVe)
- Sentiment analysis and text classification
- Named entity recognition
- Transformers with Hugging Face
- Building NLP pipelines

## Who This Is For
Developers who want to work with text data and language models.`, category: 'AI / ML', level: 'intermediate', price: 'Free', type: 'free', duration: '8 weeks', image_url: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=800&h=400&fit=crop', tags: ['NLP', 'Python', 'Transformers'], prerequisites: ['Python fundamentals'], outcomes: ['Build text analysis pipelines'], featured: false, is_published: true, order_index: 13 },
  { title: 'Computer Vision Fundamentals', slug: 'computer-vision-fundamentals', description: 'Teach computers to see: image processing, object detection, segmentation and real-world CV apps.', content: `## What You'll Learn
- Image processing with OpenCV
- Feature detection and descriptors
- Object detection (YOLO, SSD)
- Image segmentation
- Face detection and recognition
- Deploying vision models

## Who This Is For
Developers who want to build vision-powered applications.`, category: 'AI / ML', level: 'intermediate', price: 'Free', type: 'free', duration: '9 weeks', image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop', tags: ['Computer Vision', 'OpenCV', 'Python'], prerequisites: ['Python', 'Basic ML'], outcomes: ['Build object detection apps'], featured: false, is_published: true, order_index: 14 },
  { title: 'Data Science with Python — NumPy, Pandas & Visualization', slug: 'data-science-python-pandas', description: 'Analyze and visualize data with Python: NumPy, Pandas, Matplotlib, Seaborn and real datasets.', content: `## What You'll Learn
- NumPy arrays and vectorized operations
- Pandas DataFrames and data wrangling
- Cleaning and transforming real datasets
- Visualization with Matplotlib and Seaborn
- Exploratory data analysis (EDA)
- Telling stories with data

## Who This Is For
Anyone who wants to turn raw data into insights.`, category: 'AI / ML', level: 'beginner', price: 'Free', type: 'free', duration: '6 weeks', image_url: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&h=400&fit=crop', tags: ['Data Science', 'Pandas', 'Python'], prerequisites: ['Python fundamentals'], outcomes: ['Analyze and visualize datasets'], featured: false, is_published: true, order_index: 15 },
  { title: 'Prompt Engineering — Master ChatGPT & Claude', slug: 'prompt-engineering-master', description: 'Get the most out of ChatGPT, Claude and other LLMs with professional prompt patterns and workflows.', content: `## What You'll Learn
- How prompts shape model output
- Role, context and few-shot patterns
- Chain-of-thought prompting
- Structured outputs and constraints
- Prompt templates and iteration
- Using AI assistants for real work

## Who This Is For
Anyone who wants to use AI tools effectively — no coding required.`, category: 'AI / ML', level: 'beginner', price: 'Free', type: 'free', duration: '3 weeks', image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop', tags: ['Prompt Engineering', 'ChatGPT', 'AI'], prerequisites: ['None'], outcomes: ['Write effective prompts for any LLM'], featured: false, is_published: true, order_index: 16 },
  { title: 'AI Chatbot Builder — LangChain & OpenAI', slug: 'ai-chatbot-builder-langchain', description: 'Build intelligent chatbots and AI agents using LangChain, OpenAI, and vector databases.', content: `## What You'll Learn
- Prompt engineering basics
- LangChain framework and chains
- Vector databases and embeddings
- RAG (Retrieval-Augmented Generation)
- Building conversational agents
- Deploying AI apps to production

## Who This Is For
Developers who want to build AI-powered applications.`, category: 'AI / ML', level: 'intermediate', price: 'Free', type: 'free', duration: '8 weeks', image_url: 'https://images.unsplash.com/photo-1684163761883-8cba5e0d8154?w=800&h=400&fit=crop', tags: ['LangChain', 'OpenAI', 'Chatbot'], prerequisites: ['Python or JavaScript'], outcomes: ['Build production chatbots'], featured: true, is_published: true, order_index: 17 },

  // ── Mobile & DevOps ──────────────────────────────────────────────────────────
  { title: 'Flutter & Dart — Build Cross-Platform Apps', slug: 'flutter-dart-cross-platform', description: 'Build beautiful, natively compiled mobile apps for iOS and Android from a single codebase.', content: `## What You'll Learn
- Dart language fundamentals
- Flutter widgets and layouts
- State management with Provider and Riverpod
- Navigation and routing
- HTTP requests and APIs
- Publishing to App Store and Play Store

## Who This Is For
Developers who want to build mobile apps efficiently.`, category: 'Mobile', level: 'intermediate', price: 'Free', type: 'free', duration: '9 weeks', image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop', tags: ['Flutter', 'Dart', 'Mobile'], prerequisites: ['Basic programming'], outcomes: ['Publish cross-platform apps'], featured: false, is_published: true, order_index: 18 },
  { title: 'React Native — Build Mobile Apps for iOS & Android', slug: 'react-native-mobile-apps', description: 'Build real-world mobile applications with React Native, Expo, and native device features.', content: `## What You'll Learn
- React Native components and navigation
- Working with native APIs (camera, GPS, storage)
- State management with Redux Toolkit
- Push notifications
- Offline-first patterns
- Publishing to app stores

## Who This Is For
React developers who want to build mobile apps.`, category: 'Mobile', level: 'intermediate', price: 'Free', type: 'free', duration: '10 weeks', image_url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&h=400&fit=crop', tags: ['React Native', 'Expo', 'Mobile'], prerequisites: ['React fundamentals'], outcomes: ['Build and publish mobile apps'], featured: false, is_published: true, order_index: 19 },
  { title: 'Docker & Kubernetes — Practical DevOps Guide', slug: 'docker-kubernetes-practical-devops', description: 'Learn containerization, orchestration, CI/CD pipelines, and modern DevOps practices.', content: `## What You'll Learn
- Docker fundamentals and Dockerfile
- Docker Compose for multi-container apps
- Kubernetes architecture and concepts
- Deploying apps to Kubernetes
- CI/CD with GitHub Actions
- Monitoring and logging

## Who This Is For
Developers and DevOps engineers looking to master containers.`, category: 'DevOps', level: 'intermediate', price: 'Free', type: 'free', duration: '6 weeks', image_url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop', tags: ['Docker', 'Kubernetes', 'DevOps'], prerequisites: ['Basic Linux/CLI'], outcomes: ['Containerize and orchestrate apps'], featured: false, is_published: true, order_index: 20 },

  // ── Advanced & projects ──────────────────────────────────────────────────────
  { title: 'Fullstack SaaS Bootcamp — Build & Launch', slug: 'fullstack-saas-bootcamp', description: 'Build a complete SaaS application from scratch with authentication, payments, dashboard, and admin panel.', content: `## What You'll Learn
- Planning and architecting a SaaS app
- User authentication and roles
- Stripe payment integration
- Building admin dashboards
- Multi-tenancy patterns
- Deploying and scaling

## Who This Is For
Developers who want to build and launch their own SaaS product.`, category: 'Frontend', level: 'advanced', price: 'Free', type: 'free', duration: '15 weeks', image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop', tags: ['SaaS', 'Fullstack', 'Stripe'], prerequisites: ['React and Node.js'], outcomes: ['Launch your own SaaS product'], featured: true, is_published: true, order_index: 21 },
  { title: 'Game Development with JavaScript — Build 2D Games', slug: 'game-dev-javascript-2d', description: 'Create fun, interactive 2D games using JavaScript, Canvas API, and Phaser.js framework.', content: `## What You'll Learn
- Canvas API and rendering
- Game loops and physics
- Sprite sheets and animations
- Collision detection
- Sound effects and scoring
- Building a complete platformer game

## Who This Is For
Developers who want to get into game development with web technologies.`, category: 'Frontend', level: 'beginner', price: 'Free', type: 'free', duration: '6 weeks', image_url: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&h=400&fit=crop', tags: ['JavaScript', 'Games', 'Canvas'], prerequisites: ['JavaScript fundamentals'], outcomes: ['Build and ship 2D games'], featured: false, is_published: true, order_index: 22 },
];

export const seedSettings = {
  site_name: 'Hamed Hussein',
  tagline: 'Fullstack & AI/ML Developer',
  description: 'I build modern web applications, mobile apps, and AI-powered solutions. Passionate about creating technology that makes a difference in Africa and beyond. You can find me online as @hamedprodev.',
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
};

export const seedSkills = [
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
];

export const seedAchievements: any[] = [
  // Intentionally empty — Hamed adds his own achievements via Admin → Achievements.
];

export const seedSiteStats = [
  { label: 'Projects Completed', value: '30', icon: 'FolderOpen', order_index: 1, is_published: true },
  { label: 'GitHub Stars', value: '150', icon: 'Star', order_index: 2, is_published: true },
  { label: 'Courses Created', value: '10', icon: 'BookOpen', order_index: 3, is_published: true },
  { label: 'Years Experience', value: '5', icon: 'Calendar', order_index: 4, is_published: true },
  { label: 'Client Satisfaction', value: '100%', icon: 'ThumbsUp', order_index: 5, is_published: true },
];

export const seedTestimonials = [
  { name: 'Jean Claude', role: 'CTO', company: 'AgriTech Rwanda', content: 'Hamed delivered exceptional work on our FarmConnect platform. His fullstack skills and attention to detail are outstanding. Great communication throughout the project.', rating: 5, order_index: 1, is_published: true },
  { name: 'Sarah Uwase', role: 'CEO', company: 'Kwanda Facility', content: 'Hamed transformed our business operations with the Kwanda EMS system. His ability to understand complex requirements and deliver elegant solutions is remarkable.', rating: 5, order_index: 2, is_published: true },
  { name: 'David N.', role: 'Founder', company: 'HealthPlus', content: 'Working with Hamed was a pleasure. His technical expertise in AI/ML and fullstack development helped us build a health screening tool that reaches thousands.', rating: 5, order_index: 3, is_published: true },
];
