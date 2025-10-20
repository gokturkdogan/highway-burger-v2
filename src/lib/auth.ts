import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email ve şifre gerekli')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error('Kullanıcı bulunamadı')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error('Geçersiz şifre')
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      
      // Eğer token'da role yoksa database'den çek
      if (token.id && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id: parseInt(token.id as string) },
          select: { role: true }
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

