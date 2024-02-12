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
import { ITask } from '@/types'

interface TaskDropDownMenuProps {
  task: ITask
  handleDelete: (id: string) => void
}

export default function TaskDropDownMenu({
  task,
  handleDelete,
}: TaskDropDownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HiOutlineEllipsisHorizontal size={27} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-500">
        <DropdownMenuItem className="flex items-center gap-2">
          <HiOutlinePencil size={18} />
          <span>Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => handleDelete(task.id)}
        >
          <HiOutlineTrash size={18} />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
