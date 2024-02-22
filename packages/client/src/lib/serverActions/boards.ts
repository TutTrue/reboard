'use server'

import { revalidatePath } from 'next/cache'
import { IBoard, APIRespone } from '@/types'
import { fetcher, getToken } from '@/lib/fetcher'

export async function getBoards(): Promise<APIRespone<IBoard[]>> {
  try {
    const res = await fetcher.get(`/boards`, {
      headers: {
        Authorization: await getToken(),
      },
    })

    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

export async function getBoard(
  username: string,
  boardName: string
): Promise<APIRespone<IBoard>> {
  try {
    const res = await fetcher.get(`/boards/${username}/${boardName}`, {
      headers: {
        Authorization: await getToken(),
      },
    })

    revalidatePath(`/${username}/${boardName}`)

    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

export async function createBoard(name: string): Promise<APIRespone<IBoard>> {
  try {
    const res = await fetcher.post(
      '/boards',
      { name },
      {
        headers: {
          Authorization: await getToken(),
        },
      }
    )

    revalidatePath('/Dashboard')

    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

export async function updateBoardName(
  boardId: string,
  name: string
): Promise<APIRespone<IBoard>> {
  try {
    const res = await fetcher.patch(
      `/boards/edit/${boardId}`,
      { name },
      {
        headers: {
          Authorization: await getToken(),
        },
      }
    )

    revalidatePath('/Dashboard')
    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

export async function leaveBoard(id: string): Promise<APIRespone<IBoard>> {
  try {
    const res = await fetcher.patch(
      `/boards/leave/${id}`,
      {},
      {
        headers: {
          Authorization: await getToken(),
        },
      }
    )

    revalidatePath('/Dashboard')

    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

// TODO refactor server action
export async function deleteBoard(id: string): Promise<APIRespone<IBoard>> {
  try {
    const res = await fetcher.delete(`/boards/${id}`, {
      headers: {
        Authorization: await getToken(),
      },
    })
    revalidatePath('/Dashboard')
    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}
