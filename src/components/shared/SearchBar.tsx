'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
  debounceMs?: number
}

export function SearchBar({ placeholder = 'Search...', onSearch, className, debounceMs = 300 }: SearchBarProps) {
  const [value, setValue] = useState('')
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
    if (timer) clearTimeout(timer)
    const t = setTimeout(() => onSearch(v), debounceMs)
    setTimer(t)
  }

  const clear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 h-4 w-4 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex h-10 w-full rounded-lg border border-dark-500 bg-dark-700 pl-10 pr-10 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      />
      {value && (
        <button onClick={clear} className="absolute right-3 text-text-muted hover:text-text-primary">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
