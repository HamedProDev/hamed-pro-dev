'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FolderOpen, Star, BookOpen, Calendar } from 'lucide-react'

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const steps = 60, increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) { setCount(value); clearInterval(timer) } else setCount(Math.floor(current))
    }, 2000 / steps)
    return () => clearInterval(timer)
  }, [inView, value])
  return <span ref={ref}>{count}{suffix}</span>
}

export function StatsBar() {
  const stats = [
    { icon: <FolderOpen className="h-6 w-6" />, value: 30, label: 'Projects Completed', suffix: '+' },
    { icon: <Star className="h-6 w-6" />, value: 150, label: 'GitHub Stars', suffix: '+' },
    { icon: <BookOpen className="h-6 w-6" />, value: 10, label: 'Courses Created' },
    { icon: <Calendar className="h-6 w-6" />, value: 5, label: 'Years Experience' },
  ]
  return (
    <section className="py-16 border-y border-dark-500 bg-dark-800/50">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-brand-primary/10 text-brand-primary mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-text-primary"><AnimatedNumber value={stat.value} suffix={stat.suffix} /></div>
              <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
