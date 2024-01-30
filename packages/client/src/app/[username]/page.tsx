import { getServerSession } from 'next-auth'
import { getBoards } from '@/app/lib/board'
import Container from '@/components/Container'
import BoardCard from '@/components/BoardCard'

import { options } from '@/app/api/auth/[...nextauth]/options'

export default async function dashBoard({
  params,
}: {
  params: { username: string }
}) {
  const session = await getServerSession(options)
  const boards = await getBoards()

  return (
    <Container>
      <h2 className="font-bold text-4xl my-10">
        Welcome back, {session?.user.name}!
      </h2>

      <div className="grid grid-cols-3 gap-5">
        {boards?.map((board) => (
          <BoardCard key={board.id} board={board} session={session} />
        ))}
      </div>
    </Container>
  )
}
