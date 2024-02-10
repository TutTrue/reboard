import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  HiOutlineCheck,
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
import { TaskWithRelations } from '@/types'
import { taskActions } from '@/app/lib/serverActions'

function TaskDropDownMenu({ task }: { task: TaskWithRelations }) {
  async function handleDelete() {
    const res = await taskActions.deleteTask(task.id)

    if (!res.success) {
      toast.error('Error deleting task')
      return
    }
    toast.success('Task deleted successfully')
  }

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
          onClick={handleDelete}
        >
          <HiOutlineTrash size={18} />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function TaskCard({ task }: { task: TaskWithRelations }) {
  async function handleToggleComplete() {
    const res = await taskActions.renameTask(
      task.id,
      undefined,
      undefined,
      !task.completed
    )

    if (!res.success) {
      toast.error('Error updating task')
      return
    }

    toast.success('Task updated successfully')
  }

  return (
    <div className="bg-white px-3 py-2 hover:bg-gray-100 rounded-md flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Image
          src={task.Creator.profilePictureURL || '/images/default-user.png'}
          alt="user image"
          width={25}
          height={25}
          className="rounded-full border-2 border-white"
        />
        <button
          className={`w-5 h-5 rounded text-sm text-white flex items-center justify-center ${
            task.completed ? 'bg-indigo-500' : 'bg-gray-300'
          }`}
          onClick={handleToggleComplete}
        >
          {task.completed ? <HiOutlineCheck size={18} /> : ''}
        </button>
        <span className={task.completed ? 'line-through' : ''}>
          {task.text}
        </span>
      </div>

      <TaskDropDownMenu task={task} />
    </div>
  )
}
