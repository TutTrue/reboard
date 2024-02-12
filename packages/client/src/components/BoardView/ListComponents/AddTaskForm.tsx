import { useRef } from 'react'
import toast from 'react-hot-toast'

import { createTask } from '@/lib/serverActions/tasks'
import { Input } from '@/components/ui/input'

interface AddTaskFormProps {
  listId: string
  addTask: (action: unknown) => void
}

export default function AddTaskForm({
  listId,
  addTask,
}: AddTaskFormProps) {
  const ref = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    ref.current?.reset()

    const text = formData.get('todo-text') as string
    addTask(text)

    const res = await createTask(listId, text)
    if (!res.success) {
      toast.error(res.error.error.issues[0].message || 'Failed to add task')
      return
    }
    toast.success('Task added successfully')
  }

  return (
    <form ref={ref} action={handleSubmit}>
      <Input
        name="todo-text"
        placeholder="Add a task..."
        className="border-2 bg-gray-200 border-gray-400"
      />
    </form>
  )
}