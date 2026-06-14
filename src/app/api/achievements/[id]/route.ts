import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import Achievement from '@/lib/db/models/Achievement'
import { auth } from '@/lib/auth/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const achievement = await Achievement.findById(params.id)
    if (!achievement) {
      return NextResponse.json({ success: false, error: 'Achievement not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: achievement })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const body = await request.json()
    const achievement = await Achievement.findByIdAndUpdate(params.id, body, { new: true })
    if (!achievement) {
      return NextResponse.json({ success: false, error: 'Achievement not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: achievement })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const achievement = await Achievement.findByIdAndDelete(params.id)
    if (!achievement) {
      return NextResponse.json({ success: false, error: 'Achievement not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: achievement })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
