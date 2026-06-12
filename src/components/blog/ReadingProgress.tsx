'use client'
import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
    }
    window.addEventListener('scroll', update)
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-dark-800">
      <div className="h-full bg-brand-primary transition-all duration-150" style={{ width: `${progress}%` }} />
    </div>
  )
}
