'use server'

import { signIn } from '@/lib/auth/auth'
import { AuthError } from 'next-auth'

export async function loginAction(_prev: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    })
  } catch (e: any) {
    if (e?.digest?.startsWith('NEXT_REDIRECT')) {
      throw e
    }
    if (e instanceof AuthError) {
      return { error: 'Invalid email or password' }
    }
    return { error: 'Invalid email or password' }
  }

  return { error: null }
}
