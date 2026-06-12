'use client'

import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-text-primary mb-2">Something went wrong!</h2>
      <p className="text-text-secondary mb-6">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
