import { BoardWithRelations } from '@/types'
import axios from 'axios'

export const fetcher = axios.create({
  baseURL: '/proxy/api',
})

export const clientAPIActions = {
  async createBoardFetcher(name: string): Promise<BoardWithRelations | null> {
    const res = await fetcher.post('/boards', { name })

    if (res.status === 500 || res.status === 401) return null

    return res.data
  },
}
