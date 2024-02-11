import { useMemo, useOptimistic } from 'react'
import toast from 'react-hot-toast'

import { IInvitation } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  acceptInvitation,
  archiveInvitation,
  deleteInvitation,
} from '@/lib/serverActions/invitations'
import SentInvitationsTab from './SentInvitationsTab'
import ReceivedInvitationsTab from './ReceivedInvitationsTab'

interface InvitationsViewTabBarProps {
  invitations: { sent: IInvitation[]; received: IInvitation[] }
}

export default function InvitationsViewTabBar({
  invitations,
}: InvitationsViewTabBarProps) {
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
