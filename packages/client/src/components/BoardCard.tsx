import Image from 'next/image'
import Link from 'next/link'
import { Session } from 'next-auth'
import {
  HiOutlineEllipsisHorizontal,
  HiOutlinePaperClip,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi2'
import { IBoard, IList, ITask, IUser } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function BoardCard({
  board,
  session,
}: {
  board: IBoard & { Task: ITask[]; List: IList[]; UserBoards: IUser[] }
  session: Session | null
}) {
  return (
    <div className="border shadow p-5 rounded-2xl bg-white">
      <header className="flex items-center justify-between">
        <Link
          href={`/${session?.user.username}/${board.id}`}
          className="font-semibold text-2xl flex items-center gap-2"
        >
          <HiOutlinePaperClip size={27} />
          <span>{board.name}</span>
        </Link>
        <div className="text-gray-500">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <HiOutlineEllipsisHorizontal size={27} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-gray-500">
              <DropdownMenuItem className="flex items-center gap-2">
                <HiOutlinePencil size={18} />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <HiOutlineTrash size={18} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <hr className="my-5" />

      <h4>Tasks: {board.Task?.length}</h4>

      <hr className="my-5" />

      <div className="">
        <div>
          {board.UserBoards.map((user) => (
            <Link key={user.id} href={`/${user.username}}`}>
              <Image
                src={user?.profilePictureURL || '/images/default-user.png'}
                alt="user image"
                width={27}
                height={27}
                className="rounded-full"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
