import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4f7cff',
          secondary: '#8b5cf6',
          accent: '#22d3ee',
        },
        dark: {
          900: '#05060f',
          800: '#090b1c',
          700: '#10132e',
          600: '#161a3a',
          500: '#1e2350',
        },
        text: {
          primary: 'var(--text-heading)',
          secondary: 'var(--text-body)',
          muted: 'var(--text-muted)',
        },
        surface: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          card: 'var(--bg-card)',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 24px rgba(79, 124, 255, 0.35)',
        glow: '0 0 44px rgba(79, 124, 255, 0.45)',
        'glow-violet': '0 0 44px rgba(139, 92, 246, 0.45)',
        glass: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.09)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Fira Code', 'monospace'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        blink: 'blink 1s step-end infinite',
        'spin-slow': 'spin 6s linear infinite',
        aurora: 'aurora 26s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        aurora: {
          '0%': { transform: 'translate(-3%, -2%) rotate(0deg) scale(1)' },
          '50%': { transform: 'translate(3%, 2%) rotate(6deg) scale(1.08)' },
          '100%': { transform: 'translate(-2%, 3%) rotate(-4deg) scale(1.04)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}

export default config
