'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'

import { HiOutlinePlus } from 'react-icons/hi2'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'name must be at least 2 characters.',
    })
    .max(120, { message: 'name must be at most 120 characters.' })
})

function CreateListForm({ closeModal, boardId }: { closeModal: () => void, boardId: string}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
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

export default function CreateListModal({boardId}: {boardId: string}) {
  const [isModalActive, setIsModalActive] = useState(false)

  function closeModal() {
    setIsModalActive(false)
  }

  return (
    <Dialog open={isModalActive} onOpenChange={setIsModalActive}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-500 hover:bg-indigo-600 gap-1">
          <HiOutlinePlus size={17} />
          <span>Add list</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="mb-5">Add a list</h2>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <CreateListForm closeModal={closeModal} boardId={boardId} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
