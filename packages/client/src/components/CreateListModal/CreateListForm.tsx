import { useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createList } from '@/lib/serverActions/lists'
import { listFormSchema } from '@/lib/formSchemas'

interface CreateListFormProps {
  boardId: string
  closeModal: () => void
}

export default function CreateListForm({ closeModal, boardId }: CreateListFormProps) {
  const form = useForm<z.infer<typeof listFormSchema>>({
    resolver: zodResolver(listFormSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data: z.infer<typeof listFormSchema>) {
    const res = await createList(data.name, boardId)

    if (!res.success) {
      res.error.error.issues.forEach((error) =>
        form.setError('name', { message: error.message })
      )
      return
    }

    toast.success('List created successfully')
    closeModal()
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="focus:outline-indigo-500 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Create a new list"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600">
          Submit
        </Button>
      </form>
    </Form>
  )
}
