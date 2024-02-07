import { DefaultSession, DefaultUser } from 'next-auth'
import type { IUser } from './'

declare module 'next-auth' {
  interface User extends DefaultUser, IUser {
    login: string
  }
}


// TODO session type 'name' -> 'fullName'
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      profilePictureURL: string
    } & DefaultSession['user']
    accessToken: string
  }
}
