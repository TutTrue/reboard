'use client'

import {
  HiOutlineEllipsisHorizontal,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi2'
import { ImExit } from "react-icons/im";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteBoard } from '@/lib/serverActions/boards'

interface BoardOptionDropdownMenuProps {
  boardId: string
  isOwner: boolean
  openEdit: () => void
}

export default function BoardOptionDropdownMenu({
  boardId,
  isOwner,
  openEdit,
}: BoardOptionDropdownMenuProps) {
  async function handleDelete() {
    await deleteBoard(boardId)
  }

  async function handleEdit() {
    openEdit()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HiOutlineEllipsisHorizontal size={27} />
      </DropdownMenuTrigger>
      {isOwner ? (
        <DropdownMenuContent className="text-gray-500">
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={handleEdit}
          >
            <HiOutlinePencil size={18} />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={handleDelete}
          >
            <HiOutlineTrash size={18} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent className="text-white bg-red-600 hover:bg-red-400">
          <DropdownMenuItem className="flex items-center gap-2 hover focus:bg-red-400 focus:text-white">
            <ImExit size={18} />
            <span>Leave board</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
