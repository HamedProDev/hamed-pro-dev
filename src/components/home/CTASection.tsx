'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-2xl border border-dark-500 bg-gradient-to-br from-dark-700 to-dark-800 p-8 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_50%)]" />
          {/* Decorative corner circles */}
          <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-brand-primary/10 blur-xl" />
          <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-brand-accent/10 blur-xl" />
          {/* Floating icon */}
          <div className="absolute top-8 right-12 hidden md:block">
            <Sparkles className="h-8 w-8 text-brand-primary/30 animate-float" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let&apos;s Build Something Together</h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">Whether you need a web app, mobile app, AI solution, or consultation — I&apos;m here to help.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="gradient-bg text-white hover:shadow-lg hover:shadow-brand-primary/30 transition-all duration-200">
                <Link href="/contact">Start a Project <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/hire">Hire Me <Mail className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
