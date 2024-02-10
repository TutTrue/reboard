'use server'

import { revalidatePath } from 'next/cache'
import {
  BoardWithRelations,
  ListWithRelations,
  TaskWithRelations,
} from '@/types'
import { fetcher, getToken } from '@/app/lib/fetcher'
import { APIError } from '@/types/index'

type APIRespone<T> =
  | { success: false; error: APIError }
  | { success: true; data: T }

export const boardsActions = {
  async getBoards(): Promise<BoardWithRelations[] | null> {
    const res = await fetcher.get(`/boards`, {
      headers: {
        Authorization: await getToken(),
      },
    })

    if (res.status === 500 || res.status === 401) return null

    return res.data
  },

  async getBoard(
    username: string,
    boardName: string
  ): Promise<APIRespone<BoardWithRelations>> {
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
  },

  async createBoard(name: string): Promise<APIRespone<BoardWithRelations>> {
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
  },

  async deleteBoard(id: string): Promise<BoardWithRelations | null> {
    const res = await fetcher.delete(`/boards/${id}`, {
      headers: {
        Authorization: await getToken(),
      },
    })

    if (res.status === 500 || res.status === 404) return null
    revalidatePath('/Dashboard')

    return res.data
  },
}

export const listActions = {
  async createList(
    name: string,
    boardId: string
  ): Promise<APIRespone<ListWithRelations>> {
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
  },

  async updateList(
    ListId: string,
    name: string
  ): Promise<APIRespone<ListWithRelations>> {
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
  },

  async deleteList(id: string): Promise<APIRespone<ListWithRelations>> {
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
  },
}

export const taskActions = {
  async createTask(
    listId: string,
    text: string
  ): Promise<APIRespone<TaskWithRelations>> {
    try {
      const res = await fetcher.post(
        `/tasks/${listId}`,
        { text, label: 'none' },
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
  },

  async renameTask(
    taskId: string,
    text: string | undefined,
    label: string | undefined,
    completed: boolean | undefined
  ): Promise<APIRespone<TaskWithRelations>> {
    try {
      const res = await fetcher.patch(
        `/tasks/${taskId}`,
        { text, label, completed },
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
  },

  async deleteTask(id: string): Promise<APIRespone<TaskWithRelations>> {
    try {
      const res = await fetcher.delete(`/tasks/${id}`, {
        headers: {
          Authorization: await getToken(),
        },
      })

      revalidatePath('/ListTab')
      return { success: true, data: res.data }
    } catch (e: any) {
      return { success: false, error: e.response.data }
    }
  },
}

export const inviationActions = {
  async kickUserFromBoard(
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
  },
}
