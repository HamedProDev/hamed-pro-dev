'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/** Fires a lightweight pageview to /api/analytics on every route change. */
export function AnalyticsTracker() {
  const pathname = usePathname()
  const last = useRef<string>('')

  useEffect(() => {
    if (!pathname || pathname === last.current) return
    last.current = pathname
    if (pathname.startsWith('/admin-control')) return

    const payload = {
      page: pathname,
      event: 'pageview',
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
    }
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {})
    } catch {
      // ignore — analytics must never break navigation
    }
  }, [pathname])

  return null
}
