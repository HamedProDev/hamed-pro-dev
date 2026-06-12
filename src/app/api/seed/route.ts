import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    await connectToDatabase()

    const existingUser = await User.findOne({ email: 'hamedpro.work@gmail.com' })
    if (existingUser) {
      return NextResponse.json({ message: 'Admin user already exists', email: existingUser.email })
    }

    const hashedPassword = await bcrypt.hash('@He00Ri#Ga4Da', 12)

    const adminUser = await User.create({
      name: 'Hamed Hussein',
      email: 'hamedpro.work@gmail.com',
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    })

    return NextResponse.json({
      message: 'Admin user created successfully',
      email: adminUser.email,
      loginUrl: 'https://hamedprodev.onrender.com/login',
      credentials: { email: 'hamedpro.work@gmail.com', password: '@He00Ri#Ga4Da' },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
