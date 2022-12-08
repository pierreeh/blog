import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Auth(req, res) {
  try {
    await NextAuth(req, res, {
      secret: process.env.NEXTAUTH_SECRET,
      url: process.env.NEXTAUTH_URL,
      adapter: PrismaAdapter(prisma),
      session: {
        strategy: 'jwt'
      },
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
      ],
      pages: {
        signIn: '/auth/signin',
        signOut: '/'
      },
      callbacks: {
        jwt: async ({ token, user }) => {
          if (user) {
            token.id = user.id
            token.role = user.role
          }
          return token
        },
        session: async ({ session, token }) => {
          if (session) {
            session.user.id = token.id
            session.user.role = token.role
          }
          return session
        }
      }
    })
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}