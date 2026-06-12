'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  { name: 'John Doe', role: 'CTO', company: 'TechStart', content: 'Hamed delivered exceptional work. Outstanding fullstack skills.', rating: 5 },
  { name: 'Jane Smith', role: 'Founder', company: 'GreenFarm', content: 'Transformed our business. Highly recommend.', rating: 5 },
  { name: 'Patrick Habimana', role: 'Director', company: 'Kwanda Facility', content: 'Top-notch technical expertise and professionalism.', rating: 5 },
]

export function Testimonials() {
  return (
    <section className="section-padding bg-dark-800/30">
      <div className="container-wide text-center">
        <h2 className="text-3xl font-bold mb-4">What People Say</h2>
        <p className="text-text-secondary mb-12">Testimonials from clients and collaborators</p>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full text-left card-hover">
                <CardContent className="p-6 relative">
                  <span className="absolute -top-2 -left-2 text-6xl font-serif leading-none text-brand-primary/20 select-none">&ldquo;</span>
                  <p className="text-text-secondary mb-4 text-sm leading-relaxed mt-4">{t.content}</p>
                  <div className="flex gap-0.5 mb-4">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-xs font-bold text-white">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div><p className="text-sm font-medium text-text-primary">{t.name}</p><p className="text-xs text-text-muted">{t.role} at {t.company}</p></div>
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
