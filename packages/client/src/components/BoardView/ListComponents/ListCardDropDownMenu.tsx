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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteList } from '@/lib/serverActions/lists'

interface ListCardDropDownMenuProps {
  listId: string
  setEditing: (editing: boolean) => void
}

export default function ListCardDropDownMenu({
  listId,
  setEditing,
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
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => setEditing(true)}
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
    </DropdownMenu>
  )
}
