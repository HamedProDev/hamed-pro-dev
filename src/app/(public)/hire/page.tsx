import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/utils/seo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Globe, Smartphone, Brain, Code2 } from 'lucide-react'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
export const metadata: Metadata = generateSEOMetadata({ title: 'Hire Me', description: 'Hire Hamed Hussein for web development, mobile apps, AI/ML solutions, and technical consultation.', url: '/hire' })

const services = [
  { icon: Globe, title: 'Web Development', description: 'Full-stack web apps with React, Next.js, Node.js', price: 'From $500' },
  { icon: Smartphone, title: 'Mobile Development', description: 'Cross-platform apps with React Native, Kotlin', price: 'From $800' },
  { icon: Brain, title: 'AI/ML Solutions', description: 'Custom AI models, data pipelines, ML integration', price: 'From $1000' },
  { icon: Code2, title: 'Technical Consultation', description: 'Architecture review, code audits, team mentoring', price: 'From $100/hr' },
]

export default function HirePage() {
  return (
    <main id="main-content" className="section-padding">
      <div className="container-wide">
        <Breadcrumbs items={[{ label: 'Hire Me' }]} />
        <h1 className="text-4xl font-bold mb-4">Hire Me</h1>
        <p className="text-text-secondary mb-8">Available for freelance and contract work. Based in Kigali, Rwanda — working globally.</p>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {services.map((s, i) => (
            <Card key={i} className="card-hover"><CardContent className="p-6">
              <s.icon className="h-10 w-10 text-brand-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary mb-4">{s.description}</p>
              <p className="text-brand-primary font-semibold">{s.price}</p>
            </CardContent></Card>
          ))}
        </div>
        <div className="text-center"><Button size="lg" asChild><Link href="/contact">Get In Touch</Link></Button></div>
      </div>
    </main>
  )
}
