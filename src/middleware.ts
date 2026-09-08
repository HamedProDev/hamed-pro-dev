import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  return await updateSession(req)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/my-courses/:path*',
    '/certificates/:path*',
    '/profile/:path*',
    '/admin-control/:path*',
    '/saved-jobs/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
}
