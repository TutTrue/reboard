import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { decode } from 'next-auth/jwt'

export const app = new Hono()

app.use('/*', async (c, next) => {
  const token = c.req.header('authorization') as string
  const user = await decode({ token, secret: process.env.JWT_SECRET || '' })
  if (user) {
    c.set('jwtPayload', user)
    return next()
  }
  return c.json({ message: 'Unauthorized' }, 401)
})

app.get('/:username', async (c) => {
  try {
    const jwtPayload = c.get('jwtPayload')
    const username = c.req.param('username')
    if (jwtPayload.username !== username) {
      return c.json(
        { message: 'Unauthorized', redirect: `/${jwtPayload.username}` },
        401
      )
    }
    const userBoards = await prisma.user.findUnique({
      select: {
        UserBoards: true,
      },
      where: {
        username,
      },
    })
    return c.json(userBoards?.UserBoards, 200)
  } catch (e) {
    return c.json({ message: 'Internal server error' }, 500)
  }
})
