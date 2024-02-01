import { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { decode } from 'next-auth/jwt'

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
    getCookie(c, 'next-auth.session-token') ||
    c.req.header('authorization') ||
    ''

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
