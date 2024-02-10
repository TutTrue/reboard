'use server'

import { revalidatePath } from 'next/cache'
import { IList, APIRespone } from '@/types'
import { fetcher, getToken } from '@/lib/fetcher'

export async function createList(
  name: string,
  boardId: string
): Promise<APIRespone<IList>> {
  try {
    const res = await fetcher.post(
      `/lists/${boardId}`,
      { name, boardId },
      {
        headers: {
          Authorization: await getToken(),
        },
      }
    )

    revalidatePath('/ListTab')
    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

export async function updateList(
  ListId: string,
  name: string
): Promise<APIRespone<IList>> {
  try {
    const res = await fetcher.patch(
      `/lists/${ListId}`,
      { name },
      {
        headers: {
          Authorization: await getToken(),
        },
      }
    )
    revalidatePath('/ListTab')
    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

export async function deleteList(
  id: string
): Promise<APIRespone<IList>> {
  try {
    const res = await fetcher.delete(`/lists/${id}`, {
      headers: {
        Authorization: await getToken(),
      },
    })

    revalidatePath('/ListTab')
    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}
