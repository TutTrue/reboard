'use server'

import { revalidatePath } from 'next/cache'
import { APIRespone, ITask } from '@/types'
import { fetcher, getToken } from '@/lib/fetcher'

export async function createTask(
  listId: string,
  text: string
): Promise<APIRespone<ITask>> {
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
}
interface IUpdateTask {
  taskId: string
  payload: {
    text?: string
    label?: string
    completed?: boolean
  }
}
export async function updateTask(
  taskId: string,
  payload: IUpdateTask['payload']
): Promise<APIRespone<ITask>> {
  try {
    const res = await fetcher.patch(`/tasks/${taskId}`, payload, {
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

export async function deleteTask(id: string): Promise<APIRespone<ITask>> {
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
}
