import { API_URL } from '@/data/constants'
import axios from 'axios'

import type { Account, NextAuthOptions, Profile, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
  providers: [
    // Docs: https://next-auth.js.org/configuration/providers/credentials
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrPhone: {
          label: 'البريد الالكتروني أو رقم الهاتف',
          type: 'text',
          placeholder: 'البريد الالكتروني أو رقم الهاتف'
        },
        password: { label: 'Password:', type: 'password', placeholder: 'كلمة المرور' }
      },
      async authorize(credentials) {
        try {
          const loginUser = await axios.post(`${API_URL}/users/signin`, credentials)
          const { data: user } = loginUser
          if (user && user.LoggedIn === 1) {
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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      return true
    },
    async session(params): Promise<Session> {
      const session = params.session
      // return Promise.resolve({ session, token, expires: session.expires })
      return session
    },
    async jwt(params: {
      token: JWT
      user: User
      account: Account | null
      profile?: Profile
    }) {
      const { token, user } = params

      if (user) {
        token.user = user
      }
      return Promise.resolve(token)
    }
  }
}
