import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { AuthVariables, authMiddleware } from '../../middleware'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

// TODO handle errors in a formal way

export const app = new Hono<{ Variables: AuthVariables }>()

app.use('/*', authMiddleware)

// get list tasks including creator (user) object
app.get('/:boardId', async (c) => {
  try {
    const decodedJwtPayload = c.get('decodedJwtPayload')
    const { boardId } = c.req.param()

    // make sure board exists and user have access to this board
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        // check whether the user owns the board, or have access to it
        OR: [
          { ownerId: decodedJwtPayload?.id },
          { UserBoards: { some: { id: decodedJwtPayload?.id } } },
        ],
      },
      include: {
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
            },
          },
        },
      },
    })
    if (!board) return c.json({ message: 'Board not found' }, 404)

    return c.json(board.List)
  } catch (e) {
    return c.json('internal server error', 500)
  }
})

// create new list
app.post(
  '/:boardId',
  zValidator(
    'json',
    z.object({
      name: z.string().min(2).max(255),
    })
  ),
  async (c) => {
    try {
      const decodedJwtPayload = c.get('decodedJwtPayload')
      const { name } = c.req.valid('json')
      const { boardId } = c.req.param()

      // make sure board exists and user have access to this board
      const board = await prisma.board.findUnique({
        where: {
          id: boardId,
          // check whether the user owns the board, or have access to it
          OR: [
            { ownerId: decodedJwtPayload?.id },
            { UserBoards: { some: { id: decodedJwtPayload?.id } } },
          ],
        },
      })
      if (!board) return c.json({ message: 'Board not found' }, 404)

      const newList = await prisma.list.create({ data: { name, boardId } })

      return c.json(newList)
    } catch (e) {
      return c.json('internal server error', 500)
    }
  }
)

// update list name
app.patch(
  '/:boardId/:listId',
  zValidator(
    'json',
    z.object({
      name: z.string().min(2).max(255),
    })
  ),
  async (c) => {
    try {
      const decodedJwtPayload = c.get('decodedJwtPayload')
      const { name } = c.req.valid('json')
      const { boardId, listId } = c.req.param()

      // make sure board exists and user have access to this board
      const list = await prisma.list.findUnique({
        where: {
          id: listId,
          Board: {
            id: boardId,
            // check whether the user owns the board, or have access to it
            OR: [
              { ownerId: decodedJwtPayload?.id },
              { UserBoards: { some: { id: decodedJwtPayload?.id } } },
            ],
          },
        },
      })
      if (!list) return c.json({ message: 'List not found' }, 404)

      const updatedListData = await prisma.list.update({
        where: { id: listId },
        data: { name },
      })

      return c.json(updatedListData)
    } catch (e) {
      return c.json('internal server error', 500)
    }
  }
)

// delete list
app.delete('/:listId', async (c) => {
  try {
    const decodedJwtPayload = c.get('decodedJwtPayload')
    const { listId } = c.req.param()

    // make sure board exists and user have access to this board
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
        Board: {
          // check whether the user owns the board, or have access to it
          OR: [
            { ownerId: decodedJwtPayload?.id },
            { UserBoards: { some: { id: decodedJwtPayload?.id } } },
          ],
        },
      },
    })
    if (!list) return c.json({ message: 'List not found' }, 404)

    await prisma.list.delete({
      where: {
        id: listId,
        // make sure the user owns the board, or have access to it
        Board: {
          OR: [
            { ownerId: decodedJwtPayload?.id },
            { UserBoards: { some: { id: decodedJwtPayload?.id } } },
          ],
        },
      },
    })

    return c.json({ success: true })
  } catch (e) {
    return c.json('internal server error', 500)
  }
})
