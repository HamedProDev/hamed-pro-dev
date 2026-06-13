import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'

const providers: any[] = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }))
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }))
}

providers.push(Credentials({
  name: 'credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) return null

    await connectDB()
    const user = await User.findOne({ email: credentials.email }).select('+password')
    if (!user || !user.password) return null

    const isValid = await bcrypt.compare(credentials.password as string, user.password)
    if (!isValid) return null

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    }
  },
}))

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') return true
      try {
        await connectDB()
        const existingUser = await User.findOne({ email: user.email })
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: 'visitor',
          })
        } else if (!existingUser.image && user.image) {
          existingUser.image = user.image
          await existingUser.save()
        }
      } catch (e) {
        console.error('SignIn callback error:', e)
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id as string
      } else if (token.email && !token.role) {
        try {
          await connectDB()
          const dbUser = await User.findOne({ email: token.email }).select('role').lean() as any
          if (dbUser) {
            token.role = dbUser.role
            token.id = dbUser._id.toString()
          }
        } catch (e) {
          console.error('JWT callback error:', e)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  trustHost: true,
})
