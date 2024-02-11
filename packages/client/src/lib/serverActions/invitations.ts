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
  APIRespone<{ sent: IInvitation[]; received: IInvitation[] }>
> {
  try {
    const res = await fetcher.get('/invitations', {
      headers: {
        Authorization: await getToken(),
      },
    })

    revalidatePath('/InvitationsView')
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

    revalidatePath('/InvitationsView')

    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

export async function acceptInvitation(
  invitationId: string
): Promise<APIRespone<{ success: true }>> {
  try {
    const res = await fetcher.patch(
      `/invitations/accept/${invitationId}`,
      {},
      {
        headers: {
          Authorization: await getToken(),
        },
      }
    )

    revalidatePath('/NavBar')

    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

export async function archiveInvitation(
  invitationId: string
): Promise<APIRespone<{ success: true }>> {
  try {
    const res = await fetcher.patch(
      `/invitations/archive/${invitationId}`,
      {},
      {
        headers: {
          Authorization: await getToken(),
        },
      }
    )

    revalidatePath('/NavBar')

    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}

export async function deleteInvitation(
  invitationId: string
): Promise<APIRespone<{ success: true }>> {
  try {
    const res = await fetcher.delete(`/invitations/${invitationId}`, {
      headers: {
        Authorization: await getToken(),
      },
    })

    revalidatePath('/NavBar')

    return { success: true, data: res.data }
  } catch (e: any) {
    return { success: false, error: e.response.data }
  }
}
