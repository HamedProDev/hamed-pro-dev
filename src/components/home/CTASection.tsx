'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ y: -4 }}
          className="relative rounded-2xl border border-border-primary bg-gradient-to-br from-surface-card to-surface-secondary p-8 md:p-16 text-center overflow-hidden group"
        >
          <motion.div
            animate={{ opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_60%)]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-blue-500/10 blur-xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-cyan-500/10 blur-xl"
          />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let&apos;s Build Something Amazing Together</h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">Whether you need a web app, mobile app, AI solution, or consultation — I&apos;m here to help.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" asChild className="gradient-bg text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <Link href="/contact">Start a Project <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" asChild className="hover:border-blue-500/40 hover:text-blue-400 transition-all duration-300">
                  <Link href="/hire">Schedule a Call <Phone className="ml-2 h-4 w-4" /></Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
