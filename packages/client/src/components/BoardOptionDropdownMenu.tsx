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

function DropdownMenuWithAlert({ boardId }: { boardId: string }) {
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

          <DropdownMenuItem className="flex items-center gap-2">
            <HiOutlineTrash size={18} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default DropdownMenuWithAlert
