'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      if (res.ok) { setStatus('success'); setEmail('') } else { setStatus('error') }
    } catch { setStatus('error') }
  }

  return (
    <section className="section-padding border-t border-dark-500">
      <div className="container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 mb-4"
            >
              <Mail className="h-6 w-6" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
            <p className="text-text-secondary">Get the latest posts, courses, and opportunities delivered to your inbox. No spam, ever.</p>
          </div>
          <div>
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-400 text-center md:text-left"
                >
                  <CheckCircle className="h-5 w-5" />
                  Thanks for subscribing! Check your inbox.
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-0"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="flex-1 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" disabled={status === 'loading'} className="rounded-l-none gradient-bg text-white whitespace-nowrap hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                      <Send className="h-4 w-4 mr-2" /> {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
            {status === 'error' && <p className="text-red-400 text-sm mt-2">Something went wrong. Try again.</p>}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
