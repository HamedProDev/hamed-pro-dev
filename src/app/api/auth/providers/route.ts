import { NextResponse } from 'next/server'

export async function GET() {
  const providers: string[] = ['credentials']
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) providers.push('google')
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) providers.push('github')
  return NextResponse.json({ providers })
}
