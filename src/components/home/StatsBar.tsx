'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FolderOpen, Star, BookOpen, Calendar, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const iconColors = [
  { color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { color: 'text-green-500', bg: 'bg-green-500/10' },
  { color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { color: 'text-blue-400', bg: 'bg-blue-400/10' },
]

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
    { icon: <FolderOpen className="h-5 w-5" />, value: 30, label: 'Projects Completed', suffix: '+' },
    { icon: <Star className="h-5 w-5" />, value: 150, label: 'GitHub Stars', suffix: '+' },
    { icon: <BookOpen className="h-5 w-5" />, value: 10, label: 'Courses Created' },
    { icon: <Calendar className="h-5 w-5" />, value: 5, label: 'Years Experience' },
    { icon: <ThumbsUp className="h-5 w-5" />, value: 100, label: 'Client Satisfaction', suffix: '%' },
  ]
  return (
    <section className="py-12 border-y border-border-primary bg-surface-secondary/30">
      <div className="container-wide">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -4, scale: 1.05 }}
              className="text-center cursor-default"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={cn(
                  "inline-flex items-center justify-center h-12 w-12 rounded-xl mb-3 transition-shadow duration-300",
                  iconColors[i].bg,
                  iconColors[i].color
                )}
              >
                {stat.icon}
              </motion.div>
              <div className="text-2xl md:text-3xl font-bold text-text-primary"><AnimatedNumber value={stat.value} suffix={stat.suffix} /></div>
              <div className="text-xs text-text-secondary mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
