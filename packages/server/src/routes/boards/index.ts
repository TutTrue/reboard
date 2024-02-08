import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../../db/index'
import { type AuthVariables, authMiddleware } from '../../middleware'
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
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      where: {
        username: decodedJwtPayload?.username,
      },
    })

    return c.json(userBoards?.UserBoards, 200)
  } catch (e) {
    return c.json(
      createErrors([
        {
          code: ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          path: 'server',
        },
      ]),
      500
    )
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
      UserBoards: {
        select: {
          id: true,
          fullName: true,
          username: true,
          profilePictureURL: true,
        },
      },
      List: {
        include: {
          Task: {
            include: {
              Creator: {
                select: {
                  id: true,
                  fullName: true,
                  username: true,
                  profilePictureURL: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      Owner: true,
    },
  })

  if (!board)
    return c.json(
      createErrors([
        {
          code: ERROR_CODES.NOT_FOUND,
          message: `board is not found or  user ${decodedJwtPayload?.username} does not have access to the board ${boardName} of user ${username}`,
          path: ['username', 'boardName'],
        },
      ]),
      404
    )

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
            some: {
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
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            path: 'server',
          },
        ]),
        500
      )
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

    if (!board)
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.NOT_FOUND,
            message:
              'Board not found or user does not have access to the board',
            path: 'boardId',
          },
        ]),
        404
      )

    await prisma.board.delete({
      where: {
        id: boardId,
      },
    })

    return c.json({}, 200)
  } catch (e) {
    return c.json(
      createErrors([
        {
          code: ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          path: 'server',
        },
      ]),
      500
    )
  }
})

app.patch(
  '/:boardId',
  zValidator(
    'json',
    z.object({
      username: z.string().min(1).max(255), // user to be removed
    })
  ),
  async (c) => {
    try {
      const decodedJwtPayload = c.get('decodedJwtPayload')
      const boardId = c.req.param('boardId')
      const { username } = c.req.valid('json')

      const board = await prisma.board.findFirst({
        include: {
          UserBoards: {
            select: {
              username: true,
            },
          },
        },
        where: {
          id: boardId,
          ownerId: decodedJwtPayload?.id,
        },
      })

      if (!board)
        return c.json(
          createErrors([
            {
              code: ERROR_CODES.NOT_FOUND,
              message: 'Board not found',
              path: 'boardId',
            },
          ]),
          404
        )
      if (!board.UserBoards.some((user) => user.username === username))
        return c.json(
          createErrors([
            {
              code: ERROR_CODES.NOT_A_BOARD_MEMBER,
              message: 'User is not a member of the board',
              path: 'username',
            },
          ]),
          404
        )

      const updatedBoard = await prisma.board.update({
        where: {
          id: boardId,
        },
        data: {
          UserBoards: {
            disconnect: {
              username,
            },
          },
        },
      })
      return c.json(updatedBoard, 200)
    } catch (e) {
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            path: 'server',
          },
        ]),
        500
      )
    }
  }
)
