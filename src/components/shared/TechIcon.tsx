'use client'

import {
  siReact, siNextdotjs, siTypescript, siJavascript, siNodedotjs, siPython,
  siTailwindcss, siPostgresql, siMongodb, siRedis, siSupabase, siDocker,
  siTensorflow, siPytorch, siExpress, siGraphql, siVercel, siGithubactions,
  siFirebase, siFigma, siGit, siKubernetes, siFlutter, siScikitlearn, siKotlin,
  siHtml5, siCss, siMysql, siSass, siRedux, siNestjs, siFastapi, siFlask,
  siPandas, siNumpy, siVuedotjs, siAngular, siSvelte, siGo, siRust, siDjango,
  siLaravel, siUnity, siBootstrap, siDart, siSwift, siJest, siPrisma, siExpo,
  siNetlify, siGooglecloud, siGithub,
} from 'simple-icons'
import { cn } from '@/lib/utils/cn'

interface IconDef { path: string; hex: string; dark?: boolean }

// tech display name (lowercased) → simple-icon
const ICONS: Record<string, IconDef> = {
  react: { path: siReact.path, hex: siReact.hex },
  'react native': { path: siReact.path, hex: siReact.hex },
  'next.js': { path: siNextdotjs.path, hex: siNextdotjs.hex, dark: true },
  nextjs: { path: siNextdotjs.path, hex: siNextdotjs.hex, dark: true },
  typescript: { path: siTypescript.path, hex: siTypescript.hex },
  javascript: { path: siJavascript.path, hex: siJavascript.hex },
  'node.js': { path: siNodedotjs.path, hex: siNodedotjs.hex },
  nodejs: { path: siNodedotjs.path, hex: siNodedotjs.hex },
  python: { path: siPython.path, hex: siPython.hex },
  'tailwind css': { path: siTailwindcss.path, hex: siTailwindcss.hex },
  tailwind: { path: siTailwindcss.path, hex: siTailwindcss.hex },
  postgresql: { path: siPostgresql.path, hex: siPostgresql.hex },
  mongodb: { path: siMongodb.path, hex: siMongodb.hex },
  redis: { path: siRedis.path, hex: siRedis.hex },
  supabase: { path: siSupabase.path, hex: siSupabase.hex },
  docker: { path: siDocker.path, hex: siDocker.hex },
  tensorflow: { path: siTensorflow.path, hex: siTensorflow.hex },
  pytorch: { path: siPytorch.path, hex: siPytorch.hex },
  express: { path: siExpress.path, hex: siExpress.hex, dark: true },
  'express.js': { path: siExpress.path, hex: siExpress.hex, dark: true },
  graphql: { path: siGraphql.path, hex: siGraphql.hex },
  vercel: { path: siVercel.path, hex: siVercel.hex, dark: true },
  'github actions': { path: siGithubactions.path, hex: siGithubactions.hex },
  github: { path: siGithub.path, hex: siGithub.hex, dark: true },
  firebase: { path: siFirebase.path, hex: siFirebase.hex },
  figma: { path: siFigma.path, hex: siFigma.hex },
  git: { path: siGit.path, hex: siGit.hex },
  kubernetes: { path: siKubernetes.path, hex: siKubernetes.hex },
  flutter: { path: siFlutter.path, hex: siFlutter.hex },
  'scikit-learn': { path: siScikitlearn.path, hex: siScikitlearn.hex },
  kotlin: { path: siKotlin.path, hex: siKotlin.hex },
  'html/css': { path: siHtml5.path, hex: siHtml5.hex },
  html: { path: siHtml5.path, hex: siHtml5.hex },
  css: { path: siCss.path, hex: siCss.hex },
  mysql: { path: siMysql.path, hex: siMysql.hex },
  sass: { path: siSass.path, hex: siSass.hex },
  redux: { path: siRedux.path, hex: siRedux.hex },
  nestjs: { path: siNestjs.path, hex: siNestjs.hex },
  fastapi: { path: siFastapi.path, hex: siFastapi.hex },
  flask: { path: siFlask.path, hex: siFlask.hex },
  pandas: { path: siPandas.path, hex: siPandas.hex },
  numpy: { path: siNumpy.path, hex: siNumpy.hex },
  'vue.js': { path: siVuedotjs.path, hex: siVuedotjs.hex },
  angular: { path: siAngular.path, hex: siAngular.hex },
  svelte: { path: siSvelte.path, hex: siSvelte.hex },
  go: { path: siGo.path, hex: siGo.hex },
  golang: { path: siGo.path, hex: siGo.hex },
  rust: { path: siRust.path, hex: siRust.hex },
  django: { path: siDjango.path, hex: siDjango.hex },
  laravel: { path: siLaravel.path, hex: siLaravel.hex },
  php: { path: siLaravel.path, hex: siLaravel.hex },
  unity: { path: siUnity.path, hex: siUnity.hex },
  bootstrap: { path: siBootstrap.path, hex: siBootstrap.hex },
  dart: { path: siDart.path, hex: siDart.hex },
  swift: { path: siSwift.path, hex: siSwift.hex },
  jest: { path: siJest.path, hex: siJest.hex },
  prisma: { path: siPrisma.path, hex: siPrisma.hex },
  expo: { path: siExpo.path, hex: siExpo.hex },
  netlify: { path: siNetlify.path, hex: siNetlify.hex },
  'google cloud': { path: siGooglecloud.path, hex: siGooglecloud.hex },
}

// fallback monogram colors (used when a tech name isn't in the map)
const FALLBACK_COLORS = ['#7c3aed', '#d946ef', '#0d9488', '#f59e0b', '#ef4444', '#22c55e']

function fallbackColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return FALLBACK_COLORS[h % FALLBACK_COLORS.length]
}

interface TechIconProps {
  name: string
  className?: string
  size?: number
}

/** Brand-colored technology icon with a monogram fallback for unknown names. */
export function TechIcon({ name, className, size = 22 }: TechIconProps) {
  const key = name.trim().toLowerCase()
  const icon = ICONS[key]

  if (!icon) {
    const color = fallbackColor(key)
    const monogram = name
      .split(/[\s._-]+/)
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    return (
      <span
        className={cn('inline-flex items-center justify-center rounded-md font-bold text-white shrink-0', className)}
        style={{ width: size, height: size, backgroundColor: color, fontSize: Math.max(9, size * 0.42) }}
        aria-hidden="true"
      >
        {monogram}
      </span>
    )
  }

  const fill = icon.dark ? '#111827' : `#${icon.hex}`
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      fill={fill}
      role="img"
      aria-label={name}
    >
      <path d={icon.path} />
    </svg>
  )
}

/** Looks up a brand color hex for a tech name (with sensible fallback). */
export function techBrandColor(name: string): string {
  const icon = ICONS[name.trim().toLowerCase()]
  if (!icon) return fallbackColor(name)
  if (icon.dark) return '#334155'
  return `#${icon.hex}`
}

/** True when the brand mark is near-black and needs a light chip behind it. */
export function techIsDark(name: string): boolean {
  return !!ICONS[name.trim().toLowerCase()]?.dark
}
