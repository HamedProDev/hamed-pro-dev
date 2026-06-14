'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

const ease = [0.25, 0.46, 0.45, 0.94]

export function FadeIn({ children, delay = 0, className = '', direction = 'up' }: {
  children: ReactNode; delay?: number; className?: string; direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const dirMap = { up: { y: 30 }, down: { y: -30 }, left: { x: 30 }, right: { x: -30 } }
  return (
    <motion.div
      initial={{ opacity: 0, ...dirMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, delay = 0, className = '' }: {
  children: ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className = '', stagger = 0.08 }: {
  children: ReactNode; className?: string; stagger?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: {
  children: ReactNode; className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HoverCard({ children, className = '', glowColor = 'rgba(59,130,246,0.15)' }: {
  children: ReactNode; className?: string; glowColor?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease }}
      className={className}
      style={{ '--glow': glowColor } as any}
    >
      {children}
    </motion.div>
  )
}

export function PopupIn({ children, delay = 0, className = '' }: {
  children: ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 260, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({ children, delay = 0, className = '', from = 'left' }: {
  children: ReactNode; delay?: number; className?: string; from?: 'left' | 'right'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from === 'left' ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function GlowPulse({ children, className = '', color = '#3B82F6' }: {
  children: ReactNode; className?: string; color?: string
}) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 20px ${color}00`,
          `0 0 30px ${color}30`,
          `0 0 20px ${color}00`,
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({ value, suffix = '', className = '' }: {
  value: number; suffix?: string; className?: string
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {value}{suffix}
      </motion.span>
    </motion.span>
  )
}
