import { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { decode } from 'next-auth/jwt'
import { AUTH_HEADER_NAME, TOKEN_COOKIE_NAME } from '../constants'

export type AuthVariables = {
  decodedJwtPayload?: {
    id: string
    name: string
    username: string
    email: string
    picture: string
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const token =
    getCookie(c, TOKEN_COOKIE_NAME) || c.req.header(AUTH_HEADER_NAME) || ''

  const user = (await decode({
    token,
    secret: process.env.JWT_SECRET || '',
  })) as AuthVariables['decodedJwtPayload']

  if (user) {
    c.set('decodedJwtPayload', user)
    return next()
  }

  return c.json({ message: 'Unauthorized' }, 401)
}
