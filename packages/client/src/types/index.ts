export interface IUser {
  id: string
  fullName: string
  username: string
  email: string
  profilePictureURL: string

  owns?: IBoard[]
  UserBoards?: IBoard[]
  InvitationFromUser?: IUser[]
  InvitationToUser?: IUser[]
  Task?: ITask[]
  Action?: IAction[]
}

export interface ITask {
  id: string
  text: string
  label?: string
  completed: boolean
  creatorId: string
  boardId: string
  listId: string
  createdAt: string

  Creator?: IUser
  List?: IList
  Board?: IBoard
}

export interface IList {
  id: string
  name: string
  boardId: string
  createdAt: string

  Board?: IBoard
  Task?: ITask[]
}

export interface IBoard {
  id: string
  name: string
  createdAt: string

  Owner?: IUser
  UserBoards?: IUser[]
  List?: IList[]
  Task?: ITask[]
  Invitation?: IInvitation[]
  Action?: IAction[]
}

export interface IInvitation {
  id: string
  boardId: string
  fromUserId: string
  toUserId: string
  accpeted: boolean
  archived: boolean
  createdAt: string

  FromUser?: IUser
  ToUser?: IUser
  Board?: IBoard
}

export interface IAction {
  id: string
  type:
    | 'CREATE_TASK'
    | 'CREATE_LIST'
    | 'UPDATE_TASK'
    | 'UPDATE_LIST'
    | 'DELETE_LIST'
    | 'DELETE_TASK'
    | 'COMPLETE_TASK'
    | 'INVITE_USER'
    | 'ACCEPT_INVITATION'
  userId: string
  boardId: string
  message?: string
  createdAt: string

  User?: IUser
}

export const TaskViewMode = [
  'SHOW_ALL',
  'SHOW_COMPLETED',
  'SHOW_UNCOMPLETED',
] as const

export type TaskViewMode = (typeof TaskViewMode)[number]

export type APIError = {
  error: {
    issues: {
      code: string
      message: string
      path: string[]
    }[]
  }
}

export type APIRespone<T> =
  | { success: false; error: APIError }
  | { success: true; data: T }
