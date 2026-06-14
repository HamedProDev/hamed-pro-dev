import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import Achievement from '@/lib/db/models/Achievement'
import { auth } from '@/lib/auth/auth'

export async function GET() {
  try {
    await connectDB()
    const achievements = await Achievement.find().sort({ order: 1, createdAt: 1 })
    return NextResponse.json({ success: true, data: achievements })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const body = await request.json()
    const achievement = await Achievement.create(body)
    return NextResponse.json({ success: true, data: achievement }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
