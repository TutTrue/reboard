import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { type AuthVariables, authMiddleware } from '../../middleware'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

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
            UserBoards: true,
          },
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

app.get('/:username/:boardName', async (c) => {
  const { username, boardName } = c.req.param()
  const decodedJwtPayload = c.get('decodedJwtPayload')

  // check if user have access to the board or board exist
  const board = await prisma.board.findFirst({
    where: {
      name: boardName,
      Owner: {
        username,
      },
      UserBoards: {
        some: {
          id: decodedJwtPayload?.id,
        },
      },
    },
    include: {
      List: true,
      Task: true,
    },
  })

  if (!board) return c.json({ message: 'Board can not be found' }, 404)

  return c.json(board)
})

app.post(
  '/',
  zValidator(
    'json',
    z.object({
      name: z
        .string()
        .min(1)
        .max(255)
        .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i),
    })
  ),
  async (c) => {
    try {
      const decodedJwtPayload = c.get('decodedJwtPayload')
      const name = c.req.valid('json').name.toLowerCase()

      const boardWithSameName = await prisma.board.findFirst({
        where: {
          name,
          UserBoards: {
            every: {
              id: decodedJwtPayload?.id,
            },
          },
        },
      })

      // make sure a user can't have two boards with the same name/slug
      if (boardWithSameName)
        return c.json(
          { message: 'A board with the same name already exists' },
          401
        )

      const newBoard = await prisma.board.create({
        data: {
          name,
          ownerId: decodedJwtPayload?.id!,
          UserBoards: {
            connect: {
              id: decodedJwtPayload?.id,
            },
          },
        },
      })

      return c.json(newBoard)
    } catch (e) {
      return c.json({ message: 'Internal server error' }, 500)
    }
  }
)
