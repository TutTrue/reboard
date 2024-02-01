import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { serverAPIActions } from '@/app/lib/serverFetcher'
import Container from '@/components/Container'
import BoardCard from '@/components/BoardCard'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { CreateBoardModal } from '@/components/CreateBoardModal'

export default async function dashBoard({
  params: { username },
}: {
  params: { username: string }
}) {
  const session = await getServerSession(options)
  const boards = await serverAPIActions.getBoards()

  if (username !== session?.user.username)
    redirect(`https://github.com/${username}`)

  return (
    <Container>
      <div className="flex justify-between items-center gap-2">
        <h2 className="font-bold text-3xl my-10">
          Welcome back, {session?.user.name}!
        </h2>

        <CreateBoardModal />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {boards?.map((board) => (
          <BoardCard key={board.id} board={board} session={session} />
        ))}
      </div>
    </Container>
  )
}
