import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/firebase/auth'
import { getDocuments, getDocument } from '@/lib/firebase/firestore'

export async function GET() {
  try {
    const decoded = await verifySession()
    if (!decoded?.uid) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const users = await getDocuments('users', { filters: [{ field: 'email', operator: '==', value: decoded.email || '' }] })
    const user = users[0] || null
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }
    const { password, ...safeUser } = user
    return NextResponse.json({ success: true, data: safeUser })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
