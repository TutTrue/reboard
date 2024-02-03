import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { AuthVariables, authMiddleware } from '../../middleware'

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
    return c.json({ message: 'Internal server error' }, 500)
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
      return c.json({ message: 'Provided username not found' }, 401)

    // make sure board exist and user owns the board
    const board = await prisma.board.findFirst({
      where: { name: boardName, ownerId: decodedJwtPayload?.id },
    })
    if (!board) return c.json({ message: 'Provided board ID not found' }, 404)

    // make sure user is not already invited
    const oldInvitaion = await prisma.invitation.findFirst({
      where: {
        boardId: board.id,
        fromUserId: decodedJwtPayload?.id,
        toUserId: invitedUser.id,
      },
    })
    if (oldInvitaion)
      return c.json({ message: 'User is already invited/joined' }, 401)

    const newInvitation = await prisma.invitation.create({
      data: {
        boardId: board.id,
        fromUserId: decodedJwtPayload?.id!,
        toUserId: invitedUser.id,
      },
    })

    return c.json(newInvitation)
  } catch (e) {
    return c.json({ message: 'Internal server error' }, 500)
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
    if (!invitaion) return c.json({ message: 'Inviation not found' }, 404)

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

    return c.json({ success: true })
  } catch (e) {
    return c.json({ message: 'Internal server error' }, 500)
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
    if (!invitaion) return c.json({ message: 'Inviation not found' }, 404)

    // accept invitation
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { archived: true },
    })

    return c.json({ success: true })
  } catch (e) {
    return c.json({ message: 'Internal server error' }, 500)
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
    if (!invitaion) return c.json({ message: 'Inviation not found' }, 404)

    // delete invitation
    await prisma.invitation.delete({ where: { id: invitationId } })

    return c.json({ success: true })
  } catch (e) {
    return c.json({ message: 'Internal server error' }, 500)
  }
})
