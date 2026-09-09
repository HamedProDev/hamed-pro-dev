'use client'

import { ThemeProvider } from 'next-themes'
import { AuthProvider } from './auth-provider'
import { AnalyticsTracker } from '@/components/shared/AnalyticsTracker'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AnalyticsTracker />
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
}
