import { Context, Next } from 'hono'
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
  const token = c.req.header('authorization') as string
  const user = (await decode({
    token,
    secret: process.env.JWT_SECRET || '',
  })) as AuthVariables['decodedJwtPayload']

  if (user) {
    c.set('jwtPayload', user)
    return next()
  }

  return c.json({ message: 'Unauthorized' }, 401)
}
