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
  Action?: Action[]
}

export interface ITask {
  id: string
  text: string
  label?: string
  completed: boolean
  creatorId: string
  boardId: string
  listId: string
  createdAt: Date

  Creator?: IUser
  List?: IList
  Board?: IBoard
}

export interface IList {
  id: string
  name: string
  boardId: string
  createdAt: Date

  Board?: IBoard
  Task?: ITask[]
}

export interface IBoard {
  id: string
  name: string
  createdAt: Date

  Owner?: IUser
  UserBoards?: IUser[]
  List?: IList[]
  Task?: ITask[]
  Invitation?: IInvitation[]
}

export interface IInvitation {
  id: string
  boardId: string
  fromUserId: string
  toUserId: string
  accpeted: boolean
  archived: boolean
  createdAt: Date

  FromUser?: IUser
  ToUser?: IUser
  Board?: IBoard
}

export interface Action {
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
  createdAt: Date

  User?: IUser
}

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
