import Image from 'next/image'
import Link from 'next/link'
import { Session } from 'next-auth'
import { HiOutlinePaperClip } from 'react-icons/hi2'
import { BoardWithRelations } from '@/types/index'
import DropdownMenuWithAlert from './DropdownMenuWithAlert'

export default function BoardCard({
  board,
  session,
}: {
  board: BoardWithRelations
  session: Session | null
}) {
  return (
    <div className="border shadow p-5 rounded-2xl bg-white">
      <header className="flex items-center justify-between">
        
        <Link
          href={`/${board?.Owner.username}/${board.name}`}
          className="font-semibold text-xl flex items-center gap-1"
        >
          <HiOutlinePaperClip size={17} />
          <span>{board.Owner.username != session?.user.username  ? (board.Owner.username + '/') : ''}{board.name}</span>
        </Link>

        <div className="text-gray-500 flex-shrink-0">
          <DropdownMenuWithAlert boardId={board.id} />
        </div>
      </header>

      <hr className="my-5" />

      <h4>Tasks: {board.Task?.length}</h4>

      <hr className="my-5" />

      <div className="">
        <div className="items-center gap-2 inline-flex flex-row-reverse">
          {board.UserBoards.map((user) => (
            <Link
              key={user.id}
              href={
                user.username !== session?.user.username
                  ? `https://github.com/${user.username}`
                  : '#'
              }
              className="inline-avatar"
            >
              <Image
                src={user?.profilePictureURL || '/images/default-user.png'}
                alt="user image"
                width={30}
                height={30}
                className="rounded-full w-full block border-2 border-indigo-500"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
