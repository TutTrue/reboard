'use server'

import { APIRespone, IAction } from '@/types'
import { fetcher, getToken } from '@/lib/fetcher'

export async function getBoardActions(
  boardId: string
): Promise<APIRespone<IAction[]>> {
  try {
    const res = await fetcher.get(`/actions/${boardId}`, {
      headers: {
        Authorization: await getToken(),
      },
    })

    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}
