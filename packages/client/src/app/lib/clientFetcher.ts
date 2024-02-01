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
  async deleteBoardFetcher(id: string): Promise<BoardWithRelations | null> {
    console.log('delete board', id);
    
    const res = await fetcher.delete(`/boards/${id}`)

    if (res.status === 500 || res.status === 404) return null

    return res.data
  }
}
