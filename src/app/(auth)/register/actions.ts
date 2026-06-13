'use server'

import { signIn } from '@/lib/auth/auth'
import { connectDB } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'

export async function registerAction(_prev: any, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!name || !email || !password) {
    return { error: 'All fields are required' }
  }
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  try {
    await connectDB()
    const existing = await User.findOne({ email })
    if (existing) {
      return { error: 'Email already registered' }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'visitor',
    })

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
      return { error: 'Failed to sign in after registration' }
    }
    return { error: e.message || 'Registration failed' }
  }

  return { error: null }
}
