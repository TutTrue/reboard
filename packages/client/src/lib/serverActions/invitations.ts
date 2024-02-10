'use server'

import { revalidatePath } from 'next/cache'
import { APIRespone, BoardWithRelations } from '@/types'
import { fetcher, getToken } from '@/lib/fetcher'

export async function kickUserFromBoard(
  boardId: string,
  username: string
): Promise<APIRespone<BoardWithRelations>> {
  try {
    const res = await fetcher.patch(
      `/boards/${boardId}`,
      { username },
      {
        headers: {
          Authorization: await getToken(),
        },
      }
    )

    revalidatePath('/TeamTab')
    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}
