import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { boardFormSchema } from '@/lib/formSchemas'
import { updateBoardName } from '@/lib/serverActions/boards'
import { IBoard } from '@/types'
import { Input } from '../ui/input'

interface EditBoardNameFormProps {
  board: IBoard
  setEditing: (value: boolean) => void
}

export default function EditBoardNameForm({
  board,
  setEditing,
}: EditBoardNameFormProps) {
  const form = useForm<z.infer<typeof boardFormSchema>>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      name: board.name,
    },
  })

  async function handleBoardEdit(data: z.infer<typeof boardFormSchema>) {
    const res = await updateBoardName(board.id, data.name)
    setEditing(false)
    if (res.success) {
      toast.success('board updated successfully')
      return
    }
    toast.error(res.error.error.issues[0].message || 'Failed to update board')
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(handleBoardEdit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="focus:outline-indigo-500 focus:border-indigo-500 focus:ring-indigo-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
