import { API_URL } from '@/data/constants'
import { UserProps } from '@/types'
import axios from 'axios'
import type { NextAuthOptions, User } from 'next-auth'
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
      async authorize(credentials): Promise<User | null> {
        console.log('credentials =>', credentials)

        const loginUser = await axios.post(`${API_URL}/users/signin`, credentials)
        const { data: user }: { data: User & UserProps } = loginUser

        console.log('loginUser Options.ts', loginUser)

        // if User is Logged in successfully
        if (user && user.loggedIn === 1) {
          return user
        }

        return null
      }
    })
  ]
}
