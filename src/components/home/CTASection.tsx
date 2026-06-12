'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-2xl border border-dark-500 bg-gradient-to-br from-dark-700 to-dark-800 p-8 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_50%)]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let&apos;s Build Something Together</h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">Whether you need a web app, mobile app, AI solution, or consultation — I&apos;m here to help.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild><Link href="/contact">Start a Project <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button size="lg" variant="outline" asChild><Link href="/hire">Hire Me <Mail className="ml-2 h-4 w-4" /></Link></Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
