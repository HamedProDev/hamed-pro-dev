import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('__session')?.value

  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/my-courses') || pathname.startsWith('/saved-jobs')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/my-courses/:path*', '/saved-jobs/:path*'],
}
