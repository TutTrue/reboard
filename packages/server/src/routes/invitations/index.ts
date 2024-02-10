import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { AuthVariables, authMiddleware } from '../../middleware'
import { createErrors } from '../../utils'
import { ERROR_CODES } from '../../constants'
import { createAction } from '../../utils/actions'
import { ActionType } from '@prisma/client'

export const app = new Hono<{ Variables: AuthVariables }>()

app.use('/*', authMiddleware)

// get user's invitaion list (send and received)
app.get('/', async (c) => {
  try {
    const decodedJwtPayload = c.get('decodedJwtPayload')

    const sentInvitations = await prisma.invitation.findMany({
      where: {
        fromUserId: decodedJwtPayload?.id,
        accepted: false,
      },
      select: {
        id: true,
        Board: true,
        boardId: true,
        ToUser: true,
        toUserId: true,
        fromUserId: true,
        createdAt: true,
      },
    })

    const receivedInvitations = await prisma.invitation.findMany({
      where: {
        toUserId: decodedJwtPayload?.id,
        accepted: false,
      },
    })

    return c.json({
      sent: sentInvitations,
      received: receivedInvitations,
    })
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

// invite user
app.post('/:username/:boardName', async (c) => {
  try {
    const { username, boardName } = c.req.param()
    const decodedJwtPayload = c.get('decodedJwtPayload')

    console.log(decodedJwtPayload)

    // make sure username exists
    const invitedUser = await prisma.user.findUnique({ where: { username } })
    if (!invitedUser)
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.NOT_FOUND,
            message: 'User not found',
            path: 'username',
          },
        ]),
        401
      )

    // make sure board exist and user owns the board
    const board = await prisma.board.findFirst({
      where: { name: boardName, ownerId: decodedJwtPayload?.id },
    })
    if (!board)
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.NOT_FOUND,
            message: `Board not found or user ${decodedJwtPayload?.username} is not the owner of the board`,
            path: ['boardName', 'username'],
          },
        ]),
        404
      )

    // make sure user is not already invited
    const oldInvitaion = await prisma.invitation.findFirst({
      where: {
        boardId: board.id,
        fromUserId: decodedJwtPayload?.id,
        toUserId: invitedUser.id,
      },
    })
    if (oldInvitaion)
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.DUBLICATE_ENTRY,
            message: `User ${invitedUser.username} is already invited to the board`,
            path: 'username',
          },
        ]),
        401
      )

    const newInvitation = await prisma.invitation.create({
      data: {
        boardId: board.id,
        fromUserId: decodedJwtPayload?.id!,
        toUserId: invitedUser.id,
      },
    })
    createAction(
      ActionType.INVITE_USER,
      decodedJwtPayload,
      newInvitation.boardId,
      {
        invitedUser: {
          username: invitedUser.username,
          name: invitedUser.fullName,
        },
      }
    )
    return c.json(newInvitation)
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

// accept received invitation
app.patch('/accept/:invitationId', async (c) => {
  try {
    const { invitationId } = c.req.param()
    const decodedJwtPayload = c.get('decodedJwtPayload')

    const invitaion = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
        toUserId: decodedJwtPayload?.id,
        accepted: false,
      },
    })

    // make sure invitation exists
    if (!invitaion)
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Invitation not found',
            path: 'invitationId',
          },
        ]),
        404
      )

    // accept invitation
    const acceptInvitationTransaction = prisma.invitation.update({
      where: { id: invitationId },
      data: { accepted: true },
    })

    // grant access to board
    const updateUserBoardTransaction = prisma.board.update({
      where: {
        id: invitaion.boardId,
      },
      data: {
        UserBoards: {
          connect: {
            id: decodedJwtPayload?.id,
          },
        },
      },
    })

    await prisma.$transaction([
      acceptInvitationTransaction,
      updateUserBoardTransaction,
    ])
    createAction(
      ActionType.ACCEPT_INVITATION,
      decodedJwtPayload,
      invitaion.boardId,
      {
        decodedJwtPayload,
      }
    )

    return c.json({ success: true })
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

// archive invite
app.patch('/archive/:invitationId', async (c) => {
  try {
    const { invitationId } = c.req.param()
    const decodedJwtPayload = c.get('decodedJwtPayload')

    const invitaion = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
        toUserId: decodedJwtPayload?.id,
        accepted: false,
      },
    })

    // make sure invitation exists
    if (!invitaion)
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Invitation not found',
            path: 'invitationId',
          },
        ]),
        404
      )

    // accept invitation
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { archived: true },
    })

    return c.json({ success: true })
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

/// delete invite
app.delete('/:invitationId', async (c) => {
  try {
    const { invitationId } = c.req.param()
    const decodedJwtPayload = c.get('decodedJwtPayload')

    const invitaion = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
        fromUserId: decodedJwtPayload?.id,
        accepted: false,
      },
    })

    // make sure invitation exists
    if (!invitaion)
      return c.json(
        createErrors([
          {
            code: ERROR_CODES.NOT_FOUND,
            message: 'invetation not found',
            path: 'invitationId',
          },
        ]),
        404
      )

    // delete invitation
    await prisma.invitation.delete({ where: { id: invitationId } })

    return c.json({ success: true })
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
