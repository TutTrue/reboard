'use client'

import {
  HiOutlineEllipsisHorizontal,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi2'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteBoard, leaveBoard } from '@/lib/serverActions/boards'
import { HiOutlineLogout } from 'react-icons/hi'
import toast from 'react-hot-toast'

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
  async function handleDeleteBoard() {
    await deleteBoard(boardId)
  }

  async function handleEdit() {
    openEdit()
  }

  async function handleLeaveBoard() {
    const res = await leaveBoard(boardId)

    if (!res.success) toast.error('Error leaving the board')
    else toast.success('Board left successfully')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HiOutlineEllipsisHorizontal size={27} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isOwner ? (
          <>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={handleEdit}
            >
              <HiOutlinePencil size={18} />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={handleDeleteBoard}
            >
              <HiOutlineTrash size={18} />
              <span>Delete</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={handleLeaveBoard}
            className="flex items-center gap-2"
          >
            <HiOutlineLogout size={18} />
            <span>Leave board</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
