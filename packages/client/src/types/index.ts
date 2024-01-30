export interface IUser {
  id: string
  fullName: string
  username: string
  email: string
  profilePictureURL: string
}

export interface Board {
  id: string
  name: string
  createdAt: Date
}
