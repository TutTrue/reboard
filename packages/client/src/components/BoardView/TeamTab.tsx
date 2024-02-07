import { BoardWithRelations } from '@/types'
import { Session } from 'next-auth'
import Image from 'next/image'
import { Button } from '../ui/button'
import { HiOutlineUserRemove } from 'react-icons/hi'

interface TeamTabProps {
  authedUser: Session['user']
  board: BoardWithRelations
}

export default function TeamTab({ board, authedUser }: TeamTabProps) {
  return (
    <div className="flex flex-col bg-white divide-y">
      {board.UserBoards.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between px-4 py-3"
        >
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
            <Button variant={'destructive'} className="gap-2">
              <HiOutlineUserRemove size={18} />
              <span>Kick</span>
            </Button>
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  )
}
