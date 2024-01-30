import { IUser } from '@/types'
import { proxy } from 'valtio'

interface State {
  user?: IUser
}

export const state = proxy<State>({})

export const actions = {
  setUser(user: IUser) {
    state.user = user
  }
}
