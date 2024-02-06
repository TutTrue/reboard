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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { BoardWithRelations, ListWithRelations, TaskWithRelations } from '@/types'
import TaskCard from './TaskCard'
import { useOptimistic, useRef, useState } from 'react'
import { Session } from 'next-auth'
import { deleteListAction, updateListAction } from '@/app/lib/serverActions'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

function ListCardDropDownMenu({ listId, setEditing }: { listId: string, setEditing: (editing: boolean) => void }) {
  async function handleDelete() {
    const res = await deleteListAction(listId)
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
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => setEditing(true)}>
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
  board,
  session,
}: {
  list: ListWithRelations
  board: BoardWithRelations
  session: Session
}) {
  const [editing, setEditing] = useState(false)
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

  async function handleListEdit(data: z.infer<typeof formSchema>) {
    const res = await updateListAction(list.id, board.id, data.name)
    setEditing(false)
    if (res.success) {
      toast.success('List updated successfully')
      return
    }
    toast.error('Failed to update list')
  }

  const formSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: 'name must be at least 2 characters.',
      })
      .max(255, { message: 'name must be at most 255 characters.' }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: list.name,
    },
  })

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white shadow-md border p-5 rounded-md min-w-[300px]">
        <header className="flex items-center justify-between gap-3">
          {
            editing ? (
              <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(handleListEdit)}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="focus:outline-indigo-500 focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Your new board's name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            ) : (
              <h2 className="text-xl font-semibold">{list.name}</h2>
            )
          }
          <ListCardDropDownMenu listId={list.id} setEditing={setEditing} />
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
