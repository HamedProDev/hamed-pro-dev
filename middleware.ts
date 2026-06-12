import { auth } from '@/lib/auth/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === 'admin'

  if (pathname.startsWith('/admin') && (!isLoggedIn || !isAdmin)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/my-courses') || pathname.startsWith('/saved-jobs')) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/my-courses/:path*', '/saved-jobs/:path*'],
}
