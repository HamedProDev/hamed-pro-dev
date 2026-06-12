import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    await connectToDatabase()

    const existingUser = await User.findOne({ email: 'hamed@novasoft.rw' })
    if (existingUser) {
      return NextResponse.json({ message: 'Admin user already exists', email: existingUser.email })
    }

    const hashedPassword = await bcrypt.hash('Admin@123456', 12)

    const adminUser = await User.create({
      name: 'Hamed Hussein',
      email: 'hamed@novasoft.rw',
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    })

    return NextResponse.json({
      message: 'Admin user created successfully',
      email: adminUser.email,
      loginUrl: 'https://hamedprodev.onrender.com/login',
      credentials: { email: 'hamed@novasoft.rw', password: 'Admin@123456' },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
