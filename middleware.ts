import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authjs.session-token')?.value || 
                request.cookies.get('__Secure-authjs.session-token')?.value

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/my-courses') || pathname.startsWith('/saved-jobs')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/my-courses/:path*', '/saved-jobs/:path*'],
}
