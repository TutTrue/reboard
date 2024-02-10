import { Session } from 'next-auth'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { HiOutlineUserMinus } from 'react-icons/hi2'

import { BoardWithRelations, IUser } from '@/types'
import { Button } from '@/components/ui/button'
import { inviationActions } from '@/app/lib/serverActions'

interface TeamTabProps {
  authedUser: Session['user']
  board: BoardWithRelations
}

interface MemberCardProps {
  user: IUser
  board: BoardWithRelations
  authedUser: Session['user']
}

export default function TeamTab({ board, authedUser }: TeamTabProps) {
  return (
    <div>
      <div className="flex flex-col bg-white divide-y">
        {board.UserBoards.map((user) => (
          <MemberCard
            key={user.id}
            user={user}
            board={board}
            authedUser={authedUser}
          />
        ))}
      </div>
    </div>
  )
}

function MemberCard({ user, board, authedUser }: MemberCardProps) {
  async function handleRemoveUser() {
    const res = await inviationActions.kickUserFromBoard(board.id, user.username)

    if (!res.success) {
      toast.error('Error removing user')
      return
    }
    toast.success('User removed successfully')
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <Image
          src={user.profilePictureURL || '/images/default-user.png'}
          alt="user image"
          width={45}
          height={45}
          className="rounded-full border-2 border-white"
        />

        <div className="flex flex-col">
          <h3>
            {user.fullName}
            {board.Owner.username === user.username ? ' 👑' : ''}
          </h3>
          <p className="text-gray-500 text-sm">@{user.username}</p>
        </div>
      </div>

      {authedUser.username === board.Owner.username &&
      user.username !== board.Owner.username ? (
        <Button
          variant={'destructive'}
          className="gap-2"
          onClick={handleRemoveUser}
        >
          <HiOutlineUserMinus size={18} />
          <span>Kick</span>
        </Button>
      ) : (
        ''
      )}
    </div>
  )
}

