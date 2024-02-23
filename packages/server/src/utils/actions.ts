import { ActionType } from '@prisma/client'
import { prisma } from '../db'
import { AuthVariables } from '../middleware'

export type PayloadTypes = {
  [ActionType.CREATE_TASK]: { text: string }
  [ActionType.UPDATE_TASK]: { oldText: string; text: string }
  [ActionType.DELETE_TASK]: { text: string }
  [ActionType.COMPLETE_TASK]: { text: string }
  [ActionType.CREATE_LIST]: { name: string }
  [ActionType.UPDATE_LIST]: { oldName: string; name: string }
  [ActionType.DELETE_LIST]: { name: string }
  [ActionType.INVITE_USER]: { invitedUser: { username: string; name: string } }
  [ActionType.ACCEPT_INVITATION]: AuthVariables
  [ActionType.UPDATE_BOARD_NAME]: { oldName: string; name: string }
  [ActionType.UNCHECK_TASK]: { text: string }
}

type DefualtPayloadType = {
  name?: string
  text?: string
  oldName?: string
  oldText?: string
  invitedUser?: {
    username: string
    name: string
  }
}

export async function createAction<T extends ActionType>(
  type: T,
  decodedJwtPayload: AuthVariables['decodedJwtPayload'],
  boardId: string,
  payload: T extends keyof PayloadTypes ? PayloadTypes[T] : never
) {
  const userInfo = decodedJwtPayload?.name
    ? `${decodedJwtPayload?.name}`
    : `${decodedJwtPayload?.username}`
  const typedPayload = payload as DefualtPayloadType

  switch (type) {
    case ActionType.ACCEPT_INVITATION: {
      await prisma.action.create({
        data: {
          userId: decodedJwtPayload?.id!,
          type,
          message: `${userInfo} joined the party🥳`,
          boardId,
        },
      })

      break
    }

    case ActionType.INVITE_USER: {
      await prisma.action.create({
        data: {
          userId: decodedJwtPayload?.id!,
          type,
          message: `${userInfo} invited someone to join the party🥵`,
          boardId,
        },
      })
      break
    }

    case ActionType.CREATE_LIST: {
      await prisma.action.create({
        data: {
          userId: decodedJwtPayload?.id!,
          type,
          message: `${userInfo} created a list: "${typedPayload.name}"`,
          boardId,
        },
      })

      break
    }

    case ActionType.UPDATE_LIST: {
      await prisma.action.create({
        data: {
          userId: decodedJwtPayload?.id!,
          type,
          message: `${userInfo} updated list name: "${typedPayload.oldName}" to "${typedPayload.name}"`,
          boardId,
        },
      })

      break
    }

    case ActionType.DELETE_LIST: {
      await prisma.action.create({
        data: {
          userId: decodedJwtPayload?.id!,
          type,
          message: `${userInfo} deleted a list: "${typedPayload.name}"`,
          boardId,
        },
      })

      break
    }

    case ActionType.CREATE_TASK: {
      await prisma.action.create({
        data: {
          userId: decodedJwtPayload?.id!,
          type,
          message: `${userInfo} created a task: "${typedPayload.text}"`,
          boardId,
        },
      })
      break
    }

    case ActionType.COMPLETE_TASK: {
      await prisma.action.create({
        data: {
          userId: decodedJwtPayload?.id!,
          type,
          message: `${userInfo} completed a task: "${typedPayload.text}"🤩`,
          boardId,
        },
      })
      break
    }

    case ActionType.UPDATE_TASK: {
      await prisma.action.create({
        data: {
          userId: decodedJwtPayload?.id!,
          type,
          message: `${userInfo} updated task name: "${typedPayload.oldText}" to "${typedPayload.text}"`,
          boardId,
        },
      })
      break
    }
    case ActionType.DELETE_TASK: {
      await prisma.action.create({
        data: {
          userId: decodedJwtPayload?.id!,
          type,
          message: `${userInfo} deleted a task: "${typedPayload.text}"`,
          boardId,
        },
      })
      break
    }
    case ActionType.UPDATE_BOARD_NAME: {
      await prisma.action.create({
        data: {
          userId: decodedJwtPayload?.id!,
          type,
          message: `${userInfo} updated board name: "${typedPayload.oldName}" to "${typedPayload.name}"`,
          boardId,
        },
      })
      break
    }
    case ActionType.UNCHECK_TASK: {
      await prisma.action.create({
        data: {
          userId: decodedJwtPayload?.id!,
          type,
          message: `${userInfo} unchecked a task: "${typedPayload.text}"`,
          boardId,
        },
      })
      break
    }
  }
}
