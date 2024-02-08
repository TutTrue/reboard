'use client'

import { Session } from 'next-auth'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BoardWithRelations } from '@/types'
import ListTab from './ListTab'
import TeamTab from './TeamTab'

interface TabsProps {
  session: Session
  board: BoardWithRelations
}

export default function TabBar({ session, board }: TabsProps) {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'lists'

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="justify-around w-full mb-3">
        <TabsTrigger value="lists" className="flex-auto border-2">
          Lists
        </TabsTrigger>
        <TabsTrigger value="history" className="flex-auto border-2">
          History
        </TabsTrigger>
        <TabsTrigger value="team" className="flex-auto border-2">
          Team
        </TabsTrigger>
      </TabsList>

      <TabsContent value="lists">
        <ListTab board={board} session={session} />
      </TabsContent>

      <TabsContent value="team">
        <TeamTab authedUser={session.user} board={board} />
      </TabsContent>
    </Tabs>
  )
}