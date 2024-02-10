'use server'

import { revalidatePath } from 'next/cache'
import { APIRespone, IBoard, IInvitation } from '@/types'
import { fetcher, getToken } from '@/lib/fetcher'
import { ApiError } from 'next/dist/server/api-utils'

export async function kickUserFromBoard(
  boardId: string,
  username: string
): Promise<APIRespone<IBoard>> {
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

export async function getInvitations(): Promise<
  APIRespone<{ send: IInvitation[]; received: IInvitation[] }>
> {
  try {
    const res = await fetcher.get('/invitations', {
      headers: {
        Authorization: await getToken(),
      },
    })

    revalidatePath('/InvitationView')
    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

export async function inviteUser(
  username: string,
  boardId: string
): Promise<APIRespone<IInvitation>> {
  try {
    const res = await fetcher.post(
      `/invitations/${username}/${boardId}`,
      {},
      {
        headers: {
          Authorization: await getToken(),
        },
      }
    )

    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}
