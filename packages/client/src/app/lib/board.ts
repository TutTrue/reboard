import { cookies } from 'next/headers'
import { Board } from '../../types/board'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getBoards(username: string): Promise<Board[] | null> {
  noStore()
  const res = await fetch(`http://localhost:3001/api/boards/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: cookies().get('next-auth.session-token')?.value || '',
    },
  })
    if (res.status === 401) {
        const response = await res.json();
        redirect(`${response.redirect}`)
    }
    if (res.status === 500) return null
  return res.json()
}
