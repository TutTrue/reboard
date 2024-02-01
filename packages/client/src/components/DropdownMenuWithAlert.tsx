"use client"
import { clientAPIActions } from '@/app/lib/clientFetcher'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  HiOutlineEllipsisHorizontal,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi2'

export default function DropdownMenuWithAlert({ boardId }: { boardId: string }) {
  async function handleDelete() {
    const data = await clientAPIActions.deleteBoardFetcher(boardId)
  }
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <HiOutlineEllipsisHorizontal size={27} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-gray-500">
          <DropdownMenuItem className="flex items-center gap-2">
            <HiOutlinePencil size={18} />
            <span>Edit</span>
          </DropdownMenuItem>
          <AlertDialogTrigger>
            <DropdownMenuItem className="flex items-center gap-2">
              <HiOutlineTrash size={18} />
              <span>Delete</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will <span className='text-red-500'>permanently</span> delete your board
            and remove all its lists and tasks from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className='bg-red-600 hover:bg-red-400' onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
