import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { decode } from 'next-auth/jwt'

export const board = new Hono()

board.use('/*', async (c, next) => {
  const token = c.req.header('authorization') as string
  const user = await decode({ token, secret: process.env.JWT_SECRET || '' })
  if (user) {
    c.set('jwtPayload', user)
    return next()
  }
  c.status(401)
  return c.json({ message: 'Unauthorized' })
})

board.get('/:username', async (c) => {
  try {
    const jwtPayload = c.get('jwtPayload')
    const username = c.req.param('username')
    if (jwtPayload.username !== username) {
      c.status(401)
      return c.json({
        message: 'Unauthorized',
        redirect: `/${jwtPayload.username}`,
      })
    }
    const userBoards = await prisma.user.findUnique({
      select: {
        UserBoards: true,
      },
      where: {
        username,
      },
    })
    c.status(200)
    return c.json(userBoards?.UserBoards)
  } catch (e) {
    c.status(500)
    return c.json({
      message: 'Internal server error',
    })
  }
})
