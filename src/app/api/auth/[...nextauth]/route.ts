import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '../../utils/db'
import { compare } from 'bcryptjs'
import type { UserProps } from '@/types'
import axios from 'axios'
import { API_URL } from '@/data/constants'

const { NEXTAUTH_SECRET } = process.env

export default NextAuth({
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
        const loginUser = await axios.post(`${API_URL}/users/signin`, credentials)
        const { data: user } = loginUser
        if (user && user.LoggedIn === 1) {
          return Promise.resolve(user)
        }

        return Promise.resolve(null)
        try {
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
