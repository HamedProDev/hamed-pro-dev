'use client'
import { useEffect } from 'react'

interface Props {
  title: string
  description: string
  image?: string
  url?: string
  keywords?: string
  noindex?: boolean
}

export function MetadataInjector({ title, description, image, url, keywords, noindex }: Props) {
  const siteName = 'HamedProDev'
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://hamedprodev.onrender.com'
  const fullTitle = `${title} | ${siteName}`
  const ogImage = image || `${baseUrl}/og/default.png`
  const canonical = url ? `${baseUrl}${url}` : (typeof window !== 'undefined' ? window.location.href : baseUrl)

  useEffect(() => {
    document.title = fullTitle
    const setMeta = (n: string, c: string) => {
      const attr = n.startsWith('og:') || n.startsWith('twitter:') ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${n}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, n); document.head.appendChild(el) }
      el.setAttribute('content', c)
    }
    setMeta('description', description)
    setMeta('keywords', keywords || 'Hamed Hussein, Fullstack Developer, AI/ML, Rwanda, Kigali, Next.js, React')
    setMeta('og:title', fullTitle); setMeta('og:description', description)
    setMeta('og:image', ogImage); setMeta('og:url', canonical)
    setMeta('og:type', 'website'); setMeta('og:site_name', siteName)
    setMeta('twitter:card', 'summary_large_image'); setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description); setMeta('twitter:image', ogImage)
    setMeta('twitter:creator', '@hamedProDev')
    let ce = document.querySelector('link[rel="canonical"]')
    if (!ce) { ce = document.createElement('link'); ce.setAttribute('rel', 'canonical'); document.head.appendChild(ce) }
    ce.setAttribute('href', canonical)
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, image, url, keywords, noindex, fullTitle, ogImage, canonical])
  return null
}
