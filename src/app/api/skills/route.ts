import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import Skill from '@/lib/db/models/Skill'
import { auth } from '@/lib/auth/auth'

export async function GET() {
  try {
    await connectDB()
    const skills = await Skill.find().sort({ order: 1, createdAt: 1 })
    return NextResponse.json({ success: true, data: skills })
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
    const skill = await Skill.create(body)
    return NextResponse.json({ success: true, data: skill }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
