'use server'
import { BoardWithRelations } from '@/types'
import { revalidatePath } from 'next/cache'
import { fetcher, getToken } from '@/app/lib/fetcher'
import { APIError } from '@/types/index'

type APIRespone<T> =
  | { success: false; error: APIError }
  | { success: true; data: T }

export async function getBoards(): Promise<BoardWithRelations[] | null> {
  const res = await fetcher.get(`/boards`, {
    headers: {
      Authorization: await getToken(),
    },
  })

  if (res.status === 500 || res.status === 401) return null

  return res.data
}

export async function getBoard(
  username: string,
  boardName: string
): Promise<BoardWithRelations | null> {
  const res = await fetcher.get(`/boards/${username}/${boardName}`, {
    headers: {
      Authorization: await getToken(),
    },
  })

  if (res.status === 500 || res.status === 401) return null

  return res.data
}

export async function createBoardAction(
  name: string,
  pathToRevalidate?: string
): Promise<APIRespone<BoardWithRelations>> {
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

    revalidatePath(pathToRevalidate || '/')

    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

export async function deleteBoardAction(
  id: string
): Promise<BoardWithRelations | null> {
  const res = await fetcher.delete(`/boards/${id}`, {
    headers: {
      Authorization: await getToken(),
    },
  })

  if (res.status === 500 || res.status === 404) return null
  revalidatePath('/dashBoard')

  return res.data
}

export async function createListAction(
  name: string,
  boardId: string
): Promise<BoardWithRelations | null> {
  const res = await fetcher.post(
    `/lists/${boardId}`,
    { name, boardId },
    {
      headers: {
        Authorization: await getToken(),
      },
    }
  )

  if (res.status === 500 || res.status === 401) return null
  revalidatePath('/ListView')
  return res.data
}