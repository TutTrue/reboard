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
import { TaskWithRelations } from '@/types'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { deleteTaskAction, updateTaskAction } from '@/app/lib/serverActions'

function TaskDropDownMenu({ task }: { task: TaskWithRelations }) {
  async function handleDelete() {
    const res = await deleteTaskAction(task.id)
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

        <DropdownMenuItem className="flex items-center gap-2" onClick={handleDelete}>
          <HiOutlineTrash size={18} />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function TaskCard({ task }: { task: TaskWithRelations }) {
  async function handleToggleComplete() {
    const res = await updateTaskAction(task.id, undefined, undefined, !task.completed)
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
        <button className="block w-5 h-5 bg-gray-300 rounded text-sm" onClick={handleToggleComplete}><span>{task.completed ? "✔️" : ""}</span></button>
        <span className={task.completed ? "line-through" : ""}>{task.text}</span>
      </div>

      <TaskDropDownMenu task={task} />
    </div>
  )
}

export default TaskCard
