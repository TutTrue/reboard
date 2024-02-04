'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  HiOutlineEllipsisHorizontal,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi2'

import { deleteBoardAction } from '@/app/lib/serverActions'

function BoardOptionDropdownMenu({ boardId }: { boardId: string }) {
  async function handleDelete() {
    await deleteBoardAction(boardId)
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <HiOutlineEllipsisHorizontal size={27} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-gray-500">
          <DropdownMenuItem className="flex items-center gap-2">
            <HiOutlinePencil size={18} />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2" onClick={handleDelete}>
            <HiOutlineTrash size={18} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default BoardOptionDropdownMenu
