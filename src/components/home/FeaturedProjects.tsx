'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const featured = [
  { title: 'FarmConnect', description: 'Digital marketplace connecting Rwandan farmers directly with buyers.', techStack: ['React', 'Node.js', 'MongoDB'], status: 'live' as const, demoUrl: '#', sourceUrl: '#' },
  { title: 'Kwanda EMS', description: 'Enterprise management system for Kwanda Facility operations.', techStack: ['Next.js', 'TypeScript', 'Supabase'], status: 'in-progress' as const, demoUrl: '#', sourceUrl: '#' },
  { title: 'AI Health Assistant', description: 'ML-powered health screening tool for rural communities.', techStack: ['Python', 'TensorFlow', 'React Native'], status: 'live' as const, demoUrl: '#', sourceUrl: '#' },
]

export function FeaturedProjects() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-10">
          <div><h2 className="text-3xl font-bold">Featured Projects</h2><p className="text-text-secondary mt-2">Some of my best work</p></div>
          <Button variant="ghost" asChild><Link href="/projects">View All <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full card-hover">
                <div className="h-48 bg-dark-600 rounded-t-xl" />
                <CardContent className="p-6">
                  <Badge variant="outline" className={`mb-3 ${p.status === 'live' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>{p.status}</Badge>
                  <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-text-secondary mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">{p.techStack.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild><a href={p.demoUrl} target="_blank"><ExternalLink className="h-3 w-3 mr-1" />Demo</a></Button>
                    <Button size="sm" variant="ghost" asChild><a href={p.sourceUrl} target="_blank"><Github className="h-3 w-3 mr-1" />Code</a></Button>
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
