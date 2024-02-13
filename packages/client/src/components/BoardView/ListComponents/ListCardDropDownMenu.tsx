import toast from 'react-hot-toast'
import {
  HiOutlineEllipsisHorizontal,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi2'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteList } from '@/lib/serverActions/lists'
import { TaskViewMode } from '@/types'

interface ListCardDropDownMenuProps {
  listId: string
  taskViewMode: TaskViewMode
  setTaskViewMode: (mode: TaskViewMode) => void
  setEditing: (editing: boolean) => void
}

export default function ListCardDropDownMenu({
  listId,
  setEditing,
  taskViewMode,
  setTaskViewMode,
}: ListCardDropDownMenuProps) {
  async function handleDelete() {
    const res = await deleteList(listId)
    if (res.success) {
      toast.success('List deleted successfully')
      return
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HiOutlineEllipsisHorizontal size={27} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="text-gray-500">
        <DropdownMenuLabel>Tasks view</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={taskViewMode}
          onValueChange={(mode: string) =>
            setTaskViewMode(mode as TaskViewMode)
          }
          className="capitalize"
        >
          {TaskViewMode.map((mode) => (
            <DropdownMenuRadioItem key={mode} value={mode} className='capitalize'>
              {mode.toLocaleLowerCase().replace('_', ' ')}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>List</DropdownMenuLabel>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => setEditing(true)}
        >
          <HiOutlinePencil size={16} />
          <span>Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={handleDelete}
        >
          <HiOutlineTrash size={16} />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
