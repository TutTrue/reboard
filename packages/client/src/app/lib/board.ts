import { IBoard, IList, ITask, IUser } from '@/types'
import { unstable_noStore as noStore } from 'next/cache'
import { cookies } from 'next/headers'
import { fetcher } from '.'

export type BoardWithRelations = IBoard & {
  Task: ITask[]
  List: IList[]
  UserBoards: IUser[]
}

export async function getBoards(): Promise<BoardWithRelations[] | null> {
  noStore()

  const res = await fetcher.get(`/boards`, {
    headers: {
      authorization: cookies().get('next-auth.session-token')?.value || '',
    },
  })
  if (res.status === 500 || res.status === 401) return null

  return res.data
}