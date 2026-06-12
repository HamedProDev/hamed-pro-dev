'use client'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

const skillCategories = [
  {
    name: 'Frontend',
    color: 'text-blue-500',
    skills: [
      { name: 'Next.js', icon: 'N', iconBg: 'bg-white text-black' },
      { name: 'React', icon: '⚛', iconBg: 'bg-cyan-500/20 text-cyan-400' },
      { name: 'TypeScript', icon: 'TS', iconBg: 'bg-blue-500/20 text-blue-400' },
      { name: 'Tailwind CSS', icon: '🌊', iconBg: 'bg-cyan-500/20 text-cyan-400' },
    ],
  },
  {
    name: 'Backend',
    color: 'text-green-500',
    skills: [
      { name: 'Node.js', icon: 'N', iconBg: 'bg-green-500/20 text-green-400' },
      { name: 'Python', icon: '🐍', iconBg: 'bg-yellow-500/20 text-yellow-400' },
      { name: 'Express', icon: 'Ex', iconBg: 'bg-gray-500/20 text-gray-400' },
      { name: 'GraphQL', icon: 'GQ', iconBg: 'bg-pink-500/20 text-pink-400' },
    ],
  },
  {
    name: 'Database',
    color: 'text-orange-500',
    skills: [
      { name: 'PostgreSQL', icon: 'Pg', iconBg: 'bg-blue-600/20 text-blue-400' },
      { name: 'MongoDB', icon: 'M', iconBg: 'bg-green-600/20 text-green-400' },
      { name: 'Redis', icon: 'R', iconBg: 'bg-red-500/20 text-red-400' },
      { name: 'Supabase', icon: 'S', iconBg: 'bg-green-500/20 text-green-400' },
    ],
  },
  {
    name: 'AI/ML',
    color: 'text-purple-500',
    skills: [
      { name: 'TensorFlow', icon: 'TF', iconBg: 'bg-orange-500/20 text-orange-400' },
      { name: 'PyTorch', icon: 'PT', iconBg: 'bg-red-500/20 text-red-400' },
      { name: 'Scikit-learn', icon: 'Sk', iconBg: 'bg-blue-500/20 text-blue-400' },
      { name: 'OpenAI', icon: 'OA', iconBg: 'bg-teal-500/20 text-teal-400' },
    ],
  },
  {
    name: 'DevOps',
    color: 'text-brand-accent',
    skills: [
      { name: 'Docker', icon: 'D', iconBg: 'bg-blue-500/20 text-blue-400' },
      { name: 'AWS', icon: 'aws', iconBg: 'bg-orange-500/20 text-orange-400' },
      { name: 'GitHub Actions', icon: 'GA', iconBg: 'bg-gray-500/20 text-gray-400' },
      { name: 'Vercel', icon: '▲', iconBg: 'bg-white/10 text-white' },
    ],
  },
]

export function SkillsSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
          <p className="text-text-secondary">Technologies I work with daily</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {skillCategories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full card-hover border-white/5">
                <CardContent className="p-5">
                  <h3 className={cn('text-sm font-bold mb-4 uppercase tracking-wider', cat.color)}>{cat.name}</h3>
                  <div className="space-y-3">
                    {cat.skills.map(skill => (
                      <div key={skill.name} className="flex items-center gap-3">
                        <span className={cn('h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0', skill.iconBg)}>
                          {skill.icon}
                        </span>
                        <span className="text-sm text-text-secondary">{skill.name}</span>
                      </div>
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
