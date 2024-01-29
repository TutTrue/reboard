import { DefaultSession, DefaultUser } from 'next-auth'
import type { IUser } from './'

declare module 'next-auth' {
  interface User extends DefaultUser, IUser {
    login: string
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
    } & DefaultSession['user']
    accessToken: string
  }
}
