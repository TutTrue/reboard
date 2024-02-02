import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { type AuthVariables, authMiddleware } from '../../middleware'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { ERROR_CODES } from '../../constants'
import { createErrors } from '../../utils'

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
            Owner: true,
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
      Owner: true,
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
        .min(2)
        .max(255)
        .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, {
          message: "Invalid board name, name can't contain spaces",
        }),
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
          createErrors([
            {
              code: ERROR_CODES.DUBLICATE_ENTRY,
              message: 'A board with the same name already exists',
              path: 'name',
            },
          ]),
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
      return c.json('internal server error', 500)
    }
  }
)

app.delete('/:boardId', async (c) => {
  try {
    const decodedJwtPayload = c.get('decodedJwtPayload')
    const boardId = c.req.param('boardId')

    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        ownerId: decodedJwtPayload?.id,
      },
    })

    if (!board) return c.json({ message: 'Board can not be found' }, 404)

    const deletedBoard = await prisma.board.delete({
      where: {
        id: boardId,
      },
    })

    return c.json({}, 200)
  } catch (e) {
    return c.json('internal server error', 500)
  }
})

app.patch(
  '/:username/:boardName',
  zValidator(
    'json',
    z.object({
      username: z.string().min(1).max(255),
      name: z
        .string()
        .min(2)
        .max(255)
        .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, {
          message: "Invalid board name, name can't contain spaces",
        }),
    })
  ),
  async (c) => {
    try {
      const decodedJwtPayload = c.get('decodedJwtPayload')
      const { username: ownerName, boardName } = c.req.param()
      const { username, name } = c.req.valid('json')

      if (decodedJwtPayload?.username !== ownerName)
        return c.json({ message: 'Unauthorized' }, 401)

      const board = await prisma.board.findFirst({
        include: {
          UserBoards: {
            select: {
              username: true,
            },
          },
        },
        where: {
          name: boardName,
          Owner: {
            username: ownerName,
          },
        },
      })

      if (!board)
        return c.json(
          createErrors([
            {
              code: ERROR_CODES.BOARD_NOT_FOND,
              message: `no boards found with this name ${boardName} for the user ${ownerName}`,
              path: ['board name', 'username'],
            },
          ]),
          404
        )
      if (!board.UserBoards.some((board) => board.username === username))
        return c.json(
          createErrors([
            {
              code: ERROR_CODES.NOT_A_BOARD_MEMBER,
              message: `${username} is not a user in ${boardName} board`,
              path: 'username',
            },
          ]),
          404
        )

      const newOwner = await prisma.user.findFirst({
        where: {
          username,
        },
      })

      if (!newOwner)
        return c.json(
          createErrors([
            {
              code: ERROR_CODES.USER_NOT_FOUND,
              message: `${name} cant be found`,
              path: 'username',
            },
          ]),
          404
        )

      const updatedBoard = await prisma.board.update({
        where: {
          name_ownerId: {
            name: boardName,
            ownerId: decodedJwtPayload?.id!,
          },
        },
        data: {
          name: name ? name : boardName,
          ownerId: newOwner.id,
        },
      })

      return c.json(updatedBoard, 200)
    } catch (e) {
      return c.json('internal server error', 500)
    }
  }
)
