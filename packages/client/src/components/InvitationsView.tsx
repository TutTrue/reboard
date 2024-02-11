'use client'

import { useMemo, useOptimistic } from 'react'
import Image from 'next/image'
import {
  HiOutlineArchiveBox,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineUsers,
} from 'react-icons/hi2'

import { IInvitation } from '@/types'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from './ui/button'
import {
  acceptInvitation,
  archiveInvitation,
  deleteInvitation,
} from '@/lib/serverActions/invitations'
import toast from 'react-hot-toast'

interface InvitationsViewProps {
  invitations: { sent: IInvitation[]; received: IInvitation[] }
}

interface SentInvitationsTabProps {
  sentInvitations: IInvitation[]
  handleDeleteInvitation: (id: string) => void
}

interface ReceivedInvitationsTab {
  archived?: boolean
  receivedInvitations: IInvitation[]
  handleAcceptInvitation: (id: string) => void
  handleArchiveInvitation: (id: string) => void
}

function SentInvitationsTab({
  sentInvitations,
  handleDeleteInvitation,
}: SentInvitationsTabProps) {
  return (
    <div className="divide-y">
      {sentInvitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex items-center justify-between gap-3 py-3"
        >
          <div className="flex items-center gap-3">
            <Image
              src={
                invitation?.ToUser?.profilePictureURL ||
                '/images/default-user.png'
              }
              alt="user image"
              width={45}
              height={45}
              className="rounded-full border-2 border-white"
            />

            <div className="flex flex-col">
              <h3>
                <strong>{invitation?.ToUser?.fullName}</strong> to "
                {invitation.Board?.name}"
              </h3>
              <p className="text-gray-500 text-sm">
                @{invitation?.ToUser?.username}
              </p>
            </div>
          </div>

          <Button
            variant={'destructive'}
            onClick={() => handleDeleteInvitation(invitation.id)}
          >
            <HiOutlineTrash size={19} />
          </Button>
        </div>
      ))}
    </div>
  )
}

function ReceivedInvitationsTab({
  archived,
  receivedInvitations,
  handleAcceptInvitation,
  handleArchiveInvitation,
}: ReceivedInvitationsTab) {
  return (
    <div className="divide-y">
      {receivedInvitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex items-center justify-between gap-3 py-3"
        >
          <div className="flex items-center gap-3">
            <Image
              src={
                invitation?.FromUser?.profilePictureURL ||
                '/images/default-user.png'
              }
              alt="user image"
              width={45}
              height={45}
              className="rounded-full border-2 border-white"
            />

            <div className="flex flex-col">
              <h3>
                <strong>{invitation?.FromUser?.fullName}</strong> to "
                {invitation.Board?.name}"
              </h3>
              <p className="text-gray-500 text-sm">
                @{invitation?.FromUser?.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {archived ? (
              ''
            ) : (
              <Button onClick={() => handleArchiveInvitation(invitation.id)}>
                <HiOutlineArchiveBox size={19} />
              </Button>
            )}
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={() => handleAcceptInvitation(invitation.id)}
            >
              <HiOutlineCheck size={19} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function TabBar({
  invitations,
}: {
  invitations: InvitationsViewProps['invitations']
}) {
  const [optimisticInvitations, manipulateInvitations] = useOptimistic(
    invitations,
    (
      oldState,
      payload: { id: string; type: 'DELETE' | 'ACCEPT' | 'ARCHIVE' }
    ) => {
      const { id, type } = payload

      if (type === 'ACCEPT') {
        oldState.received = oldState.received.filter((inv) => inv.id !== id)
      } else if (type === 'DELETE') {
        oldState.sent = oldState.sent.filter((inv) => inv.id !== id)
      } else {
        const invitationIndex = oldState.received.findIndex(
          (inv) => inv.id === id
        )
        oldState.received[invitationIndex].archived = true
      }

      return oldState
    }
  )

  const archivedReceivedInvitations = useMemo(
    () => optimisticInvitations.received.filter((inv) => inv.archived),
    [invitations.received]
  )

  async function handleAcceptInvitation(id: string) {
    console.log(id)
    manipulateInvitations({ id, type: 'ACCEPT' })
    await acceptInvitation(id)
    toast.success('Invitation accepted succesfully')
  }

  async function handleArhciveInvitation(id: string) {
    manipulateInvitations({ id, type: 'ARCHIVE' })
    await archiveInvitation(id)
    toast.success('Invitation archived succesfully')
  }

  async function handleDeleteInvitation(id: string) {
    manipulateInvitations({ id, type: 'DELETE' })
    await deleteInvitation(id)
    toast.success('Invitation deleted succesfully')
  }

  return (
    <Tabs defaultValue="received" className="w-full mt-5">
      <TabsList className="justify-around w-full mb-3">
        <TabsTrigger value="sent" className="flex-auto border-2">
          Sent
        </TabsTrigger>
        <TabsTrigger value="received" className="flex-auto border-2">
          Received
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sent">
        <SentInvitationsTab
          sentInvitations={invitations.sent}
          handleDeleteInvitation={handleDeleteInvitation}
        />
        {invitations.sent.length === 0 && (
          <p className="text-gray-500">Couldn't find any sent invitations...</p>
        )}
      </TabsContent>

      <TabsContent value="received" className="space-y-3 pb-3">
        <div>
          <h3 className="font-semibold">Active invitations</h3>
          <ReceivedInvitationsTab
            handleAcceptInvitation={handleAcceptInvitation}
            handleArchiveInvitation={handleArhciveInvitation}
            receivedInvitations={invitations.received.filter(
              (inv) => !inv.archived
            )}
          />
          {invitations.received.length - archivedReceivedInvitations.length ===
            0 && (
            <p className="text-gray-500">No active invitations found...</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Archived invitations</h3>
          <ReceivedInvitationsTab
            archived
            handleAcceptInvitation={handleAcceptInvitation}
            handleArchiveInvitation={handleArhciveInvitation}
            receivedInvitations={archivedReceivedInvitations}
          />
          {archivedReceivedInvitations.length === 0 && (
            <p className="text-gray-500">No archived invitations found...</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default function InvitationsView({ invitations }: InvitationsViewProps) {
  const activeReceivedInvitations = useMemo(
    () => invitations.received.filter((inv) => !inv.archived),
    [invitations.received]
  )

  return (
    <Sheet>
      <SheetTrigger className="p-1 relative hover:bg-indigo-600 rounded-md">
        <HiOutlineUsers size={25} />
        {activeReceivedInvitations.length ? (
          <span className="flex items-center justify-center w-5 h-5 text-sm bg-red-500 rounded-full absolute -top-2 -right-2">
            {invitations.received.filter((inv) => !inv.archived).length}
          </span>
        ) : (
          ''
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-full sm:w-[400px]">
        <SheetTitle className="text-xl">Invitations</SheetTitle>
        <TabBar invitations={invitations} />
      </SheetContent>
    </Sheet>
  )
}
