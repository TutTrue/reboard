import axios from 'axios'
import { cookies } from 'next/headers'
import { BoardWithRelations } from '@/types'
import { unstable_noStore as noStore } from 'next/cache'

const fetcher = axios.create({
  baseURL: process.env.SERVER_API_URL,
})

export const serverAPIActions = {
  async getBoards(): Promise<BoardWithRelations[] | null> {
    noStore()

    const res = await fetcher.get(`/boards`, {
      headers: {
        authorization: cookies().get('next-auth.session-token')?.value || '',
      },
    })

    if (res.status === 500 || res.status === 401) return null

    return res.data
  },
}
