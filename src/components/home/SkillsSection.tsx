'use client'
import { motion } from 'framer-motion'
import { Code2, Server, Database, Brain, Smartphone, Cloud } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

const skillCategories = [
  { name: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Vue.js'], icon: Code2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Backend', skills: ['Node.js', 'Python', 'PHP', 'Express', 'Django'], icon: Server, color: 'text-green-500', bg: 'bg-green-500/10' },
  { name: 'Database', skills: ['MongoDB', 'PostgreSQL', 'Supabase', 'Redis'], icon: Database, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'AI/ML', skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV'], icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { name: 'Mobile', skills: ['React Native', 'Kotlin', 'Flutter'], icon: Smartphone, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { name: 'DevOps', skills: ['Docker', 'AWS', 'Vercel', 'GitHub Actions'], icon: Cloud, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
]

export function SkillsSection() {
  return (
    <section className="section-padding">
      <div className="container-wide text-center">
        <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
        <p className="text-text-secondary mb-12">Technologies I work with daily</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {skillCategories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full card-hover">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center mb-4', cat.bg)}>
                    <cat.icon className={cn('h-5 w-5', cat.color)} />
                  </div>
                  <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">{cat.name}</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {cat.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 text-xs rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/30">{skill}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
