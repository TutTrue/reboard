import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Container from './Container'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HiOutlineLogout, HiOutlineSun, HiOutlineUsers } from 'react-icons/hi'

export default async function NavBar() {
  const session = await getServerSession()

  return (
    <nav className="bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white h-[80px]">
      <Container className="flex items-center justify-between w-full h-full">
        <Link href="/">
          <span className="text-2xl font-semibold whitespace-nowrap">
            REBOARD
          </span>
        </Link>

        {/* TODO add profile dropdown menu */}
        {session ? (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Image
                  src={session.user?.image || '/images/default-user.png'}
                  alt="user image"
                  width={30}
                  height={30}
                  className="rounded-full border-2 border-white"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-gray-500">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuItem className="flex items-center gap-2">
                  <HiOutlineUsers size={18} />
                  <span>Invitations</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <HiOutlineSun size={18} />
                  <span>Theme</span>
                </DropdownMenuItem>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    href="/api/auth/signout?callbackUrl=/"
                    className="flex items-center gap-2"
                  >
                    <HiOutlineLogout size={18} />
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link href="/api/auth/signin" className="dark:text-white">
            Login
          </Link>
        )}
      </Container>
    </nav>
  )
}
