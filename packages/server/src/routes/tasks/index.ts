import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
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
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        UserBoards: { some: { id: decodedJwtPayload?.id } },
      },
    })
    if (!board)
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.NOT_FOUND,
            message: `Board not found or user ${decodedJwtPayload?.username} does not have access to this board`,
            path: 'boardId',
          },
        ]),
        404
      )
    const tasks = await prisma.task.findMany({
      where: {
        boardId,
      },
    })
    return c.json(tasks, 200)
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

app.post(
  '/:listId',
  zValidator(
    'json',
    z.object({
      text: z.string().min(2).max(255),
      label: z.string().min(2).max(255),
    })
  ),
  async (c) => {
    try {
      const decodedJwtPayload = c.get('decodedJwtPayload')
      const { listId } = c.req.param()
      const { text, label } = c.req.valid('json')
      const list = await prisma.list.findUnique({
        include: {
          Board: {
            include: {
              UserBoards: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        where: {
          id: listId,
        },
      })
      if (!list)
        return c.json(
          createErrors([
            {
              code: ERROR_CODES.NOT_FOUND,
              message: 'List not found',
              path: 'listId',
            },
          ]),
          404
        )
      if (
        !list.Board.UserBoards.find((user) => user.id === decodedJwtPayload?.id)
      )
        return c.json(
          createErrors([
            {
              code: ERROR_CODES.NOT_A_BOARD_MEMBER,
              message: `User ${decodedJwtPayload?.username} is not a member of this board`,
              path: 'boardId',
            },
          ]),
          401
        )
      const newList = await prisma.task.create({
        data: {
          text,
          label,
          listId,
          boardId: list.Board.id,
          creatorId: decodedJwtPayload?.id!,
        },
      })
      return c.json(newList, 201)
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

app.delete('/:taskId', async (c) => {
  try {
    const decodedJwtPayload = c.get('decodedJwtPayload')
    const { taskId } = c.req.param()
    const task = await prisma.task.findUnique({
      include: {
        Board: {
          include: {
            UserBoards: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: {
        id: taskId,
      },
    })
    if (!task)
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Task not found',
            path: 'taskId',
          },
        ]),
        404
      )
    if (
      !task.Board.UserBoards.find((user) => user.id === decodedJwtPayload?.id)
    )
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.NOT_A_BOARD_MEMBER,
            message: `User ${decodedJwtPayload?.username} is not a member of this board`,
            path: 'boardId',
          },
        ]),
        401
      )
    await prisma.task.delete({
      where: {
        id: taskId,
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
  '/:taskId',
  zValidator(
    'json',
    z.object({
      text: z.string().min(2).max(255).optional(),
      label: z.string().min(2).max(255).optional(),
      completed: z.boolean().optional(),
    })
  ),
  async (c) => {
    try {
      const decodedJwtPayload = c.get('decodedJwtPayload')
      const { taskId } = c.req.param()
      const { text, label, completed } = c.req.valid('json')
      const task = await prisma.task.findUnique({
        include: {
          Board: {
            include: {
              UserBoards: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        where: {
          id: taskId,
        },
      })
      if (!task)
        return c.json(
          createErrors([
            {
              code: ERROR_CODES.NOT_FOUND,
              message: 'Task not found',
              path: 'taskId',
            },
          ]),
          404
        )
      if (
        !task.Board.UserBoards.find((user) => user.id === decodedJwtPayload?.id)
      )
        return c.json(
          createErrors([
            {
              code: ERROR_CODES.NOT_A_BOARD_MEMBER,
              message: `User ${decodedJwtPayload?.username} is not a member of this board`,
              path: 'boardId',
            },
          ]),
          401
        )
      const updatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          completed: completed ?? task.completed,
          text: text ?? task.text,
          label: label ?? task.label,
        },
      })
      return c.json(updatedTask, 200)
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
