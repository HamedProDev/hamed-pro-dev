import { NextRequest } from 'next/server'
import { createDocument } from '@/lib/firebase/firestore'
import { requireAdmin, apiSuccess, apiError } from '@/lib/firebase/auth'
import { getFirebaseAdmin } from '@/lib/firebase/config'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { auth: adminAuth } = getFirebaseAdmin()
    const list = await adminAuth.listUsers()
    const users = list.users.map(u => ({
      id: u.uid,
      name: u.displayName,
      email: u.email,
      photoURL: u.photoURL,
      role: u.customClaims?.role || 'visitor',
      disabled: u.disabled,
    }))
    return apiSuccess(users)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { auth: adminAuth } = getFirebaseAdmin()

    const firebaseUser = await adminAuth.createUser({
      email: body.email,
      password: body.password,
      displayName: body.name,
    })

    await adminAuth.setCustomUserClaims(firebaseUser.uid, { role: 'visitor' })
    await createDocument('users', {
      id: firebaseUser.uid,
      name: body.name,
      email: body.email,
      role: 'visitor',
      createdAt: new Date(),
    })

    return apiSuccess({ id: firebaseUser.uid, name: body.name, email: body.email }, 'User created')
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return apiError('Email already registered', 409)
    }
    return apiError(error.message, 500)
  }
}
