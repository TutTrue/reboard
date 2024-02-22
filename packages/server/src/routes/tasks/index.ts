import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../../db/index'
import { AuthVariables, authMiddleware } from '../../middleware'
import { createErrors } from '../../utils'
import { ERROR_CODES } from '../../constants'
import { createAction } from '../../utils/actions'
import { ActionType } from '@prisma/client'
import { emitListUpdate } from '../../sockets/emits'

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

      // find the list
      const list = await prisma.list.findUnique({
        include: {
          Board: true,
        },
        where: {
          id: listId,
          Board: {
            UserBoards: {
              some: {
                id: decodedJwtPayload?.id,
              },
            },
          },
        },
      })

      // if not found
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

      const newList = await prisma.task.create({
        data: {
          text,
          label,
          listId,
          boardId: list.Board.id,
          creatorId: decodedJwtPayload?.id!,
        },
      })

      createAction(ActionType.CREATE_TASK, decodedJwtPayload, newList.boardId, {
        text: newList.text,
      })

      // notify all board members
      emitListUpdate(newList.boardId)

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

      // find the task
      const task = await prisma.task.findUnique({
        where: {
          id: taskId,
          Board: {
            UserBoards: {
              some: {
                id: decodedJwtPayload?.id,
              },
            },
          },
        },
      })

      // if not found
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

      if (text !== task.text)
        createAction(ActionType.UPDATE_TASK, decodedJwtPayload, task.boardId, {
          oldText: task.text,
          text: updatedTask.text,
        })

      if (completed !== task.completed)
        createAction(
          completed ? ActionType.COMPLETE_TASK : ActionType.UNCHECK_TASK,
          decodedJwtPayload,
          task.boardId,
          { text: updatedTask.text }
        )

      // notify all board members
      emitListUpdate(task.boardId)

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

app.delete('/:taskId', async (c) => {
  try {
    const decodedJwtPayload = c.get('decodedJwtPayload')
    const { taskId } = c.req.param()

    // find the task
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        Board: {
          UserBoards: {
            some: {
              id: decodedJwtPayload?.id,
            },
          },
        },
      },
    })

    // if not found
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

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    })

    createAction(ActionType.DELETE_TASK, decodedJwtPayload, task.boardId, {
      text: task.text,
    })

    // notify all board members
    emitListUpdate(task.boardId)

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
