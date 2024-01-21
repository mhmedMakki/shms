import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import { API_URL } from '@/data/constants'

const { NEXTAUTH_SECRET } = process.env

const handler = NextAuth({
  pages: {
    signIn: '/'
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        emailOrPhone: { label: 'Email or Phone', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any) {
        const { emailOrPhone, password } = credentials

        if (emailOrPhone === '' || password === '') return null

        console.log('credentials ARE =>', credentials)

        try {
          const loginUser = await axios.post(`${API_URL}/users/signin`, credentials)
          const { data: user } = loginUser

          console.log('loginUser -->', loginUser)

          if (user && user.LoggedIn === 1) {
            return Promise.resolve(user)
          }

          return Promise.resolve(null)
        } catch (error) {
          return null
        }
      }
    })
  ],

  secret: NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 Days
  }
})

export { handler as GET, handler as POST }
