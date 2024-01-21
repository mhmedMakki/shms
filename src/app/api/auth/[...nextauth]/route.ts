import NextAuth, { type AuthOptions, Session, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import { API_URL } from '@/data/constants'
import type { JWT } from 'next-auth/jwt'
import type { UserProps } from '@/types'

const { NEXTAUTH_SECRET } = process.env

const handler = NextAuth({
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrPhone: { label: 'Email or Phone Number', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(
        credentials: Record<'emailOrPhone' | 'password', string> | undefined
      ): Promise<User | null> {
        try {
          const loginUser = await axios.post(`${API_URL}/users/login`, credentials)
          const { data: user }: { data: UserProps & { id: string } } = loginUser
          if (user && user.loggedIn === 1) {
            return Promise.resolve(user)
          }

          return Promise.resolve(null)
        } catch (error) {
          console.error('Error during authorization:', error)
          return Promise.resolve(null)
        }
      }
    })
  ],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async session(params: { session: Session; token: JWT; user: User }) {
      const { session, token } = params
      return Promise.resolve({ session, token, expires: session.expires })
    },
    async jwt(params: { token: JWT; user: User }) {
      const { token, user } = params
      token.user = user

      return token
    }
  }
} as AuthOptions)

export { handler as GET, handler as POST }
