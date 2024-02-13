'use client'

import { Session } from 'next-auth'
import { useSearchParams } from 'next/navigation'
import { IBoard } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ListTab from '@/components/BoardView/ListTab'
import TeamTab from '@/components/BoardView/TeamTab'
import HistoryTab from './HistoryTab/HistoryTab'

interface TabsProps {
  session: Session
  board: IBoard
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

      <TabsContent value="history">
        <HistoryTab actions={board.Action!} />
      </TabsContent>
      
      <TabsContent value="team">
        <TeamTab authedUser={session.user} board={board} />
      </TabsContent>
    </Tabs>
  )
}
