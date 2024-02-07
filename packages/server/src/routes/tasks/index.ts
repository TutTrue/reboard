import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { AuthVariables, authMiddleware } from '../../middleware'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

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
    if (!board) return c.json({ message: 'Board not found' }, 404)
    const tasks = await prisma.task.findMany({
      where: {
        boardId,
      },
    })
    return c.json(tasks, 200)
  } catch (e) {
    return c.json('internal server error', 500)
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
      if (!list) return c.json({ message: 'List not found' }, 404)
      if (
        !list.Board.UserBoards.find((user) => user.id === decodedJwtPayload?.id)
      )
        return c.json({ message: 'Unauthorized' }, 401)
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
      return c.json('internal server error', 500)
    }
  }
)

app.delete('/:boardId/:taskId', async (c) => {
  try {
    const decodedJwtPayload = c.get('decodedJwtPayload')
    const { boardId, taskId } = c.req.param()
    const task = await prisma.board.findUnique({
      where: {
        id: boardId,
        UserBoards: { some: { id: decodedJwtPayload?.id } },
        Task: { some: { id: taskId } },
      },
    })
    if (!task) return c.json({ message: 'Task not found' }, 404)
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    })
    return c.json({}, 200)
  } catch (e) {
    return c.json('internal server error', 500)
  }
})

app.patch(
  ':boardId/:taskId',
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
      const { boardId, taskId } = c.req.param()
      const { text, label, completed } = c.req.valid('json')
      const board = await prisma.board.findUnique({
        select: {
          Task: true,
        },
        where: {
          id: boardId,
          UserBoards: { some: { id: decodedJwtPayload?.id } },
          Task: { some: { id: taskId } },
        },
      })
      if (!board) return c.json({ message: 'Task not found' }, 404)
      const task = board.Task.find((task) => task.id === taskId)
      if (!task) return c.json({ message: 'Task not found' }, 404)
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
      return c.json('internal server error', 500)
    }
  }
)
