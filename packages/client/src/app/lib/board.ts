import { Board } from '@/types/board'
import { unstable_noStore as noStore } from 'next/cache'
import { cookies } from 'next/headers'
import { fetcher } from '.'

export async function getBoards(username: string): Promise<Board[] | null> {
  noStore()

  const res = await fetcher.get(`/boards/${username}`, {
    headers: {
      authorization: cookies().get('next-auth.session-token')?.value || '',
    },
  })
  if (res.status === 500 || res.status === 401) return null

  return res.data
}
