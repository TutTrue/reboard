import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { boardsActions } from '@/app/lib/serverActions'
import Container from '@/components/Container'
import CreateListModal from '@/components/CreateListModal'
import TabBar from '@/components/BoardView/TabBar'
import InviteUserModal from '@/components/InviteUserModal'

interface BoardViewProps {
  params: {
    boardName: string
    username: string
  }
}

export default async function BoardView({ params: { boardName, username } }: BoardViewProps) {
  const session = await getServerSession(options)
  const response = await boardsActions.getBoard(username as string, boardName)

  if (!response.success) return redirect('/')

  return (
    <Container>
      <div className="flex justify-between items-center gap-2">
        <h2 className="font-bold text-3xl my-10">{response.data.name}</h2>

        <div className='flex items-center gap-3'>
          <InviteUserModal />
          <CreateListModal boardId={response.data.id} />
        </div>
      </div>

      <TabBar board={response.data} session={session!} />
    </Container>
  )
}
