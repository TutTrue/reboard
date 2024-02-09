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
import toast from 'react-hot-toast'
import { HiOutlineUserPlus } from 'react-icons/hi2'

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'name must be at least 2 characters.',
    })
    .max(120, { message: 'name must be at most 120 characters.' })
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, {
      message: "Invalid board name, name can't contain spaces",
    }),
})

function InviteUserForm({ closeModal }: { closeModal: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    closeModal()
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='capitalize'>{field.name}</FormLabel>
              <FormControl>
                <Input
                  className="focus:outline-indigo-500 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Add a new user to the board..."
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

export default function InviteUserModal() {
  const [isModalActive, setIsModalActive] = useState(false)

  function closeModal() {
    setIsModalActive(false)
  }

  return (
    <Dialog open={isModalActive} onOpenChange={setIsModalActive}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-500 hover:bg-indigo-600 gap-1">
          <HiOutlineUserPlus size={17} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="mb-5">Invite a new member</h2>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <InviteUserForm closeModal={closeModal} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
