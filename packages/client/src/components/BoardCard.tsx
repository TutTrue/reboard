'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Session } from 'next-auth'
import { useMemo } from 'react'
import { BoardWithRelations, IList } from '@/types/index'
import { HiOutlinePaperClip } from 'react-icons/hi2'
import BoardOptionDropdownMenu from '@/components/BoardOptionDropdownMenu'

interface BoardCardProps {
  board: BoardWithRelations
  session: Session | null
}

function ListCard({ list }: { list: IList }) {
  return (
    <div className="border p-2 rounded-md text-sm text-gray-500">
      {list.name}
    </div>
  )
}

export default function BoardCard({ board, session }: BoardCardProps) {
  const completedTaskCount = useMemo(
    () => board.Task.filter((task) => task.completed).length,
    [board.Task]
  )

  return (
    <main>
      <div className="group border-2 shadow-md p-5 rounded-2xl hover:border-indigo-500 hover:shadow-indigo-500 bg-white divide-y hover:divide-y hover:divide-indigo-500 transition-all duration-300">
        <header className="flex items-center justify-between pb-5">
          <Link
            href={`/${board?.Owner.username}/${board.name}`}
            className="font-semibold text-xl flex items-center gap-1 group-hover:text-indigo-500"
          >
            <HiOutlinePaperClip size={17} />
            <span>
              {board.Owner.username != session?.user.username
                ? board.Owner.username + '/'
                : ''}
              {board.name}
            </span>
          </Link>

          <div className="text-gray-500 flex-shrink-0">
            <BoardOptionDropdownMenu boardId={board.id} />
          </div>
        </header>

        {board.Task.length ? (
          <div className="py-5">
            <h4>
              Tasks: {completedTaskCount}/{board.Task?.length}
            </h4>
            <div className="w-full h-3 mt-3 bg-gray-300 border-2 border-indigo-600 rounded overflow-hidden">
              <span
                style={{
                  width: (completedTaskCount / board.Task.length) * 100 + '%',
                }}
                className={`h-full bg-indigo-400 block`}
              ></span>
            </div>
          </div>
        ) : (
          ''
        )}

        {board.List.length ? (
          <div className="py-5 space-y-3">
            <h4>Lists:</h4>
            <div className="flex flex-wrap gap-2">
              {board.List.map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          </div>
        ) : (
          ''
        )}

        <div className="pt-5">
          <div className="items-center gap-2 inline-flex flex-row-reverse">
            {board.UserBoards.map((user) => (
              <Link
                key={user.id}
                href={
                  user.username !== session?.user.username
                    ? `https://github.com/${user.username}`
                    : '#'
                }
                className="inline-avatar"
              >
                <Image
                  src={user?.profilePictureURL || '/images/default-user.png'}
                  alt="user image"
                  width={30}
                  height={30}
                  className="rounded-full w-full block border-2 border-indigo-500"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
