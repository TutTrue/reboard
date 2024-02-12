import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { boardFormSchema } from '@/lib/formSchemas'
import { Input } from '../ui/input'
import { createBoard } from '@/lib/serverActions/boards'
import { Button } from '../ui/button'

interface CreateBoardFormProps {
  closeModal: () => void
}

export default function CreateBoardForm({ closeModal }: CreateBoardFormProps) {
  const form = useForm<z.infer<typeof boardFormSchema>>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data: z.infer<typeof boardFormSchema>) {
    const res = await createBoard(data.name)

    if (!res.success) {
      res.error.error.issues.forEach((error) =>
        form.setError('name', { message: error.message })
      )
      return
    }

    toast.success('Board created successfully')
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
                  placeholder="Your new board's name"
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
