import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { type AuthVariables, authMiddleware } from '../../middleware'

export const app = new Hono<{ Variables: AuthVariables }>()

app.use('/*', authMiddleware)

app.get('/', async (c) => {
  try {
    const decodedJwtPayload = c.get('decodedJwtPayload')

    const userBoards = await prisma.user.findUnique({
      select: {
        UserBoards: {
          include: {
            Task: true,
            List: true,
            UserBoards: true
          }
        },
      },
      where: {
        username: decodedJwtPayload?.username,
      },
    })

    return c.json(userBoards?.UserBoards, 200)
  } catch (e) {
    return c.json({ message: 'Internal server error' }, 500)
  }
})
