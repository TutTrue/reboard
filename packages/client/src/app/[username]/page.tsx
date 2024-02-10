import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { boardsActions } from '@/app/lib/serverActions'
import { options } from '@/app/api/auth/[...nextauth]/options'
import Container from '@/components/Container'
import BoardCard from '@/components/BoardCard'
import CreateBoardModal from '@/components/CreateBoardModal'

export default async function Dashboard({
  params: { username },
}: {
  params: { username: string }
}) {
  const session = await getServerSession(options)
  const boards = await boardsActions.getBoards()

  if (username !== session?.user.username)
    redirect(`https://github.com/${username}`)

  return (
    <Container>
      <div className="flex justify-between items-center gap-3">
        <h2 className="font-bold text-3xl my-10">
          Welcome back, {session?.user.name}!
        </h2>

        <CreateBoardModal />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {boards?.map((board) => (
          <BoardCard key={board.id} board={board} session={session} />
        ))}
      </div>
    </Container>
  )
}
