'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  { name: 'Jean Claude', role: 'CTO', company: 'AgriTech Rwanda', content: 'Hamed delivered exceptional work. Outstanding fullstack skills and great communication.', rating: 5 },
  { name: 'Sarah Uwase', role: 'CEO', company: 'Kwanda Facility', content: 'Transformed our business with a powerful system. Highly recommended!', rating: 5 },
  { name: 'David N.', role: 'Founder', company: 'HealthPlus', content: 'Top-notch technical expertise and professionalism. A pleasure to work with!', rating: 5 },
]

export function Testimonials() {
  return (
    <section className="section-padding">
      <div className="container-wide text-center">
        <h2 className="text-3xl font-bold mb-4">What People Say</h2>
        <p className="text-text-secondary mb-12">Testimonials from clients and collaborators</p>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full text-left card-hover">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-text-primary mb-6 text-sm leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.role} at {t.company}</p>
                    </div>
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
