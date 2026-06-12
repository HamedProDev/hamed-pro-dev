'use client'

import { useState, useCallback, useRef } from 'react'

export function useSearch(debounceMs: number = 300) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  const search = useCallback(async (q: string) => {
    setQuery(q)
    if (!q.trim()) { setResults(null); return }

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data.data)
      } catch { setResults(null) }
      finally { setLoading(false) }
    }, debounceMs)
  }, [debounceMs])

  return { query, results, loading, search }
}
