import { NextResponse } from 'next/server'

export async function GET() {
  const debug: Record<string, any> = {}
  try {
    debug.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING'
    debug.AUTH_SECRET = process.env.AUTH_SECRET ? 'SET' : 'MISSING'
    debug.MONGODB_URI = process.env.MONGODB_URI ? 'SET' : 'MISSING'
    debug.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING'
    debug.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ? 'SET' : 'MISSING'

    try {
      const { connectDB } = await import('@/lib/db/connect')
      await connectDB()
      debug.mongo = 'CONNECTED'
    } catch (e: any) {
      debug.mongo = 'FAILED: ' + e.message
    }

    try {
      const { auth } = await import('@/lib/auth/auth')
      const session = await auth()
      debug.auth = 'OK'
      debug.session = session ? 'EXISTS' : 'NULL'
    } catch (e: any) {
      debug.auth = 'FAILED: ' + e.message
      debug.authStack = e.stack
    }
  } catch (e: any) {
    debug.error = e.message
  }

  return NextResponse.json(debug)
}
