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
import { Input } from '@/components/ui/input'
import { ListWithRelations, TaskWithRelations } from '@/types'
import TaskCard from './TaskCard'
import { useOptimistic, useRef } from 'react'
import { Session } from 'next-auth'

function ListCardDropDownMenu() {
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

        <DropdownMenuItem className="flex items-center gap-2">
          <HiOutlineTrash size={18} />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AddTaskForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const ref = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    ref.current?.reset()

    const text = formData.get('todo-text') as string
    onSubmit(text)

    // perform server action to add a todo
  }

  return (
    <form ref={ref} action={handleSubmit}>
      <Input
      name='todo-text'
        placeholder="Add a task..."
        className="border-2 bg-gray-200 border-gray-400"
      />
    </form>
  )
}

function List({
  list,
  session,
}: {
  list: ListWithRelations
  session: Session
}) {
  const [optimisticTasks, addTask] = useOptimistic(
    list.Task,
    (tasks, newTaskName) => {
      const task: TaskWithRelations = {
        id: Date.now().toString(),
        text: newTaskName as string,
        boardId: list.boardId,
        completed: false,
        createdAt: new Date(),
        Creator: {
          id: session.user.id,
          fullName: session?.user?.name || '',
          username: session.user.username,
          profilePictureURL: session?.user.image || '',
        },
        creatorId: session.user.id,
        listId: list.id,
      }

      return [...tasks, task]
    }
  )

  function handleSubmit(text: string) {
    addTask(text)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white shadow-md border p-5 rounded-md min-w-[300px]">
        <header className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">{list.name}</h2>
          <ListCardDropDownMenu />
        </header>
      </div>

      <div className="bg-white">
        {optimisticTasks.map((task) => (
          <>
            <TaskCard key={task.id} task={task} />
          </>
        ))}
      </div>

      <AddTaskForm onSubmit={handleSubmit} />
    </div>
  )
}

export default List
