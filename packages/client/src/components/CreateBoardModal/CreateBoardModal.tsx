'use client'

import { useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import CreateBoardForm from './CreateBoardForm'

export default function CreateBoardModal() {
  const [isModalActive, setIsModalActive] = useState(false)

  function closeModal() {
    setIsModalActive(false)
  }

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
          <CreateBoardForm closeModal={closeModal} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
