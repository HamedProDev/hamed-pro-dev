'use client'
import { motion } from 'framer-motion'

const skillCategories = [
  { name: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Vue.js'] },
  { name: 'Backend', skills: ['Node.js', 'Python', 'PHP', 'Express', 'Django'] },
  { name: 'Database', skills: ['MongoDB', 'PostgreSQL', 'Supabase', 'Redis'] },
  { name: 'AI/ML', skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV'] },
  { name: 'Mobile', skills: ['React Native', 'Kotlin', 'Flutter'] },
  { name: 'DevOps', skills: ['Docker', 'AWS', 'Vercel', 'GitHub Actions'] },
]

export function SkillsSection() {
  return (
    <section className="section-padding">
      <div className="container-wide text-center">
        <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
        <p className="text-text-secondary mb-12">Technologies I work with daily</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {skillCategories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <h3 className="text-sm font-semibold text-brand-primary mb-3 uppercase tracking-wider">{cat.name}</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {cat.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 text-xs rounded-full border border-dark-500 bg-dark-700 text-text-secondary hover:border-brand-primary/40 hover:text-brand-primary transition-colors">{skill}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
