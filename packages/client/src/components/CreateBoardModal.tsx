'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { HiOutlinePlus } from 'react-icons/hi'
import { z } from 'zod'

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
import { useState } from 'react'
import { createBoardAction } from '@/app/lib/serverActions'

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'name must be at least 2 characters.',
    })
    .max(120, { message: 'name must be at most 120 characters.' })
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, {
      message: "Invalid board name, name can't contain spaces",
    }),
})


function CreateBoardForm({ closeModal }: { closeModal: Function }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onAction(formData: FormData) {
    // TODO handle zod errors
    const name = formData.get('name') as string
    const res = await createBoardAction(name)
    if (!res) {
      console.log(res)
      return
    }
    closeModal()
  }
  return (
    <Form {...form}>
      <form action={async formData => {
        await onAction(formData)
      }} className="space-y-8">
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

export function CreateBoardModal() {
  const [isModalActive, setIsModalActive] = useState(false)

  return (
    <Dialog open={isModalActive} onOpenChange={setIsModalActive}>
      <DialogTrigger asChild>
        <button className="bg-indigo-500 text-white rounded-full p-2">
          <HiOutlinePlus size={20} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="mb-5">Create a board</h2>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <CreateBoardForm closeModal={() => setIsModalActive(false)} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
