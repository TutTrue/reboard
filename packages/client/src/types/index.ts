export interface IUser {
  id: string
  fullName: string
  username: string
  email: string
  profilePictureURL: string
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
}

export interface IList {
  id: string
  name: string
  boardId: string
  createdAt: Date
}

export interface IBoard {
  id: string
  name: string
  createdAt: Date
}

export type TaskWithRelations = ITask & {
  Creator: Omit<IUser, 'email'>
}

export type ListWithRelations = IList & {
  Task: TaskWithRelations[]
}

export type BoardWithRelations = IBoard & {
  Task: ITask[]
  List: ListWithRelations[]
  UserBoards: IUser[]
  Owner: IUser
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
