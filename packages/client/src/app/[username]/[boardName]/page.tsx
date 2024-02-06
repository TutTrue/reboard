import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { getBoard } from '@/app/lib/serverActions'
import Container from '@/components/Container'
import { CreateListModal } from '@/components/CreateListModal'

interface BoardViewProps {
  params: {
    boardName: string
  }
}

import ListView from '@/components/BoardView/ListView'

async function BoardView({ params: { boardName } }: BoardViewProps) {
  const session = await getServerSession(options)
  const response = await getBoard(session?.user.username as string, boardName)

  if (!response.success) return redirect('/')

  return (
    <Container>
      <div className="flex justify-between items-center gap-2">
        <h2 className="font-bold text-3xl my-10">{response.data.name}</h2>

        <CreateListModal />
      </div>

      <ListView board={response.data} session={session!} />
    </Container>
  )
}

export default BoardView
