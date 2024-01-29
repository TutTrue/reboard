import Link from 'next/link'
import { getBoards } from '@/app/lib/board'
import { useSnapshot } from 'valtio'
import { state } from '@/state'

export default async function dashBoard({
  params,
}: {
  params: { username: string }
}) {
  const username = params.username
  const boards = await getBoards(username)

  const { user } = useSnapshot(state)

  return (
    <>
      <div className="flex gap-5 my-5">
        {boards?.map((board) => (
          <Link
            key={board.id}
            className="bg-green-700 p-8"
            href={`/${username}/${board.id}`}
          >
            <h1>{board.name}</h1>
          </Link>
        ))}
      </div>
    </>
  )
}
