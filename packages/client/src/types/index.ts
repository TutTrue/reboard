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
  label: string
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

export type BoardWithRelations = IBoard & {
  Task: ITask[]
  List: IList[]
  UserBoards: IUser[]
  Owner: IUser
}
