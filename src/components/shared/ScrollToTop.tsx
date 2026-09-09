'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', toggle)
    return () => window.removeEventListener('scroll', toggle)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border-primary bg-surface-card text-text-secondary shadow-sm transition-all hover:text-text-primary hover:border-border-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
