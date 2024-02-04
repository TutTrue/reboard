import { options } from '@/app/api/auth/[...nextauth]/options'
import { getBoard } from '@/app/lib/serverActions'
import Container from '@/components/Container'
import { BoardWithRelations } from '@/types'
import { getServerSession } from 'next-auth'

interface BoardViewProps {
  params: {
    boardName: string
  }
}

function ListView({ board }: { board: BoardWithRelations | null }) {
  return (
    <div className="flex gap-5 items-start">
      {board?.List.map((list) => (
        <div key={list.id} className="bg-white shadow-md border p-5 rounded-md min-w-[300px]">
          <header>
            <h2 className='text-xl font-semibold'>{list.name}</h2>
          </header>
        </div>
      ))}
    </div>
  )
}

async function BoardView({ params: { boardName } }: BoardViewProps) {
  const session = await getServerSession(options)
  const board = await getBoard(
    session?.user.username as string,
    boardName
  )

  return (
    <Container>
      <h2 className="font-bold text-5xl my-10 text-center">{boardName}</h2>

      <ListView board={board} />
    </Container>
  )
}

export default BoardView
