import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { AuthVariables, authMiddleware } from '../../middleware'
import { createErrors } from '../../utils'
import { ERROR_CODES } from '../../constants'

export const app = new Hono<{ Variables: AuthVariables }>()

app.use('/*', authMiddleware)

app.get('/:boardId', async (c) => {
  try {
    const decodedJwtPayload = c.get('decodedJwtPayload')
    const { boardId } = c.req.param()

    // make sure user have access to the board
    const userBoards = await prisma.board.findFirst({
      where: {
        id: boardId,
        UserBoards: {
          some: {
            id: decodedJwtPayload?.id,
          },
        },
      },
    })

    if (!userBoards)
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.NOT_FOUND,
            message: "Couldn't find a board with the provided id",
            path: 'server',
          },
        ]),
        404
      )

    const actions = await prisma.action.findMany({
      where: {
        boardId,
      },
      include: {
        User: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return c.json(actions)
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
