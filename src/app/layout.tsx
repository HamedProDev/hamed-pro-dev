import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { WebSiteJsonLd } from '@/components/shared/JsonLd'
import './globals.css'

export const dynamic = 'force-dynamic'

const inter = localFont({
  src: [
    { path: '../../public/fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Inter-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Inter-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  title: { default: 'HamedProDev — Fullstack & AI/ML Engineer', template: '%s | HamedProDev' },
  description: 'Personal developer ecosystem of Hamed Hussein — Fullstack & AI/ML Engineer based in Kigali, Rwanda. Building innovative solutions for Africa and beyond.',
  keywords: ['Hamed Hussein', 'Fullstack Developer', 'AI/ML Engineer', 'Rwanda', 'Kigali', 'React', 'Next.js', 'Python', 'Kwanda Facility'],
  authors: [{ name: 'Hamed Hussein' }],
  creator: 'Hamed Hussein',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hamedprodev.onrender.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'HamedProDev',
    title: 'HamedProDev — Fullstack & AI/ML Engineer',
    description: 'Personal developer ecosystem of Hamed Hussein — building innovative solutions from Kigali, Rwanda.',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HamedProDev — Fullstack & AI/ML Engineer',
    description: 'Personal developer ecosystem of Hamed Hussein — building innovative solutions from Kigali, Rwanda.',
    creator: '@hamedProDev',
    images: ['/og/default.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', shortcut: '/favicon.png', apple: '/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>
          <WebSiteJsonLd />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded-lg">Skip to main content</a>
          {children}
          <Toaster position="bottom-right" theme="dark" richColors />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
